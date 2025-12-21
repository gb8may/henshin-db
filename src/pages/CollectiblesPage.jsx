import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { formatFranchise } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { saveCache, loadCache, fmtAge } from '../hooks/useCache';
import { CollectibleCard } from '../components/Card';
import { Modal, SpecCard } from '../components/Modal';
import { Search } from 'lucide-react';

function safeText(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function hasValue(v) {
  const s = safeText(v);
  return s.length > 0 && s.toLowerCase() !== "null";
}

function pickFieldByLang(obj, base, lang) {
  const map = { pt: `${base}_pt`, en: `${base}_en`, ja: `${base}_jp` };
  const key = map[lang] || map.en;
  return String(obj?.[key] || obj?.[map.en] || obj?.[map.pt] || obj?.[map.ja] || obj?.[base] || "").trim();
}

function colDisplayName(it, lang) {
  return pickFieldByLang(it, 'name', lang) || safeText(it.name_en) || safeText(it.name_pt) || safeText(it.name_jp) || 'Collectible';
}

export function CollectiblesPage() {
  const { franchise } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [collectibles, setCollectibles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [itemType, setItemType] = useState('');
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadCollectibles();
  }, [franchise, lang]);

  useEffect(() => {
    filterCollectibles();
  }, [search, itemType, collectibles, lang]);

  async function loadCollectibles() {
    setLoading(true);
    setStatus(t('loading'));

    if (!navigator.onLine) {
      const cached = loadCache('collectibles', franchise);
      const list = Array.isArray(cached.data) ? cached.data : [];
      setCollectibles(list);
      const typs = Array.from(new Set(list.map(x => safeText(x.item_type)).filter(Boolean))).sort();
      setTypes(typs);
      setStatus(list.length
        ? `${list.length} ${t('collectiblesItems')} (${t('cacheSuffix')} · ${t(fmtAge(cached.ts))})`
        : t('noCacheAvailable'));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('collectibles')
        .select('id,name_en,name_pt,name_jp,franchise,era,year,line,item_type,manufacturer,series_code,sku_code,image_url,jp_search,rarity,status,created_at')
        .eq('franchise', franchise);

      if (error) throw error;

      const list = Array.isArray(data) ? data : [];
      list.sort((a, b) => colDisplayName(a, lang).localeCompare(colDisplayName(b, lang), 'pt', { sensitivity: 'base' }));

      setCollectibles(list);
      const typs = Array.from(new Set(list.map(x => safeText(x.item_type)).filter(Boolean))).sort();
      setTypes(typs);
      setStatus(`${list.length} ${t('collectiblesItems')}`);
      saveCache('collectibles', franchise, list);
    } catch (err) {
      const cached = loadCache('collectibles', franchise);
      const list = Array.isArray(cached.data) ? cached.data : [];
      setCollectibles(list);
      const typs = Array.from(new Set(list.map(x => safeText(x.item_type)).filter(Boolean))).sort();
      setTypes(typs);
      setStatus(list.length
        ? `${list.length} ${t('collectiblesItems')} (${t('cacheSuffix')} · ${t(fmtAge(cached.ts))})`
        : `Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function filterCollectibles() {
    const query = safeText(search).toLowerCase();
    const type = safeText(itemType).toLowerCase();

    const filtered = collectibles.filter((it) => {
      if (type && safeText(it.item_type).toLowerCase() !== type) return false;
      if (!query) return true;
      return [
        it.name_pt, it.name_en, it.name_jp,
        it.line, it.item_type, it.manufacturer,
        it.series_code, it.sku_code,
        it.jp_search,
        it.rarity, it.status, it.year, it.era
      ].some((v) => safeText(v).toLowerCase().includes(query));
    });

    setFiltered(filtered);
  }

  function openModal(collectible) {
    setSelected(collectible);
    setModalOpen(true);
  }

  const rows = selected ? [
    { key: t('spec_name_pt'), value: selected.name_pt },
    { key: t('spec_name_en'), value: selected.name_en },
    { key: t('spec_name_jp'), value: selected.name_jp },
    { key: t('spec_line'), value: selected.line },
    { key: t('spec_type'), value: selected.item_type },
    { key: t('spec_manufacturer'), value: selected.manufacturer },
    { key: t('spec_year'), value: selected.year },
    { key: t('spec_era'), value: selected.era },
    { key: t('spec_series_code'), value: selected.series_code },
    { key: t('spec_sku'), value: selected.sku_code },
    { key: t('spec_status'), value: selected.status },
    { key: t('spec_rarity'), value: selected.rarity },
    { key: t('spec_jp_search'), value: selected.jp_search },
    { key: t('spec_franchise'), value: formatFranchise(selected.franchise) },
  ].filter(r => hasValue(r.value)) : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-3.5 py-3.5 pb-[90px] overflow-auto flex-1 -webkit-overflow-scrolling-touch">
        <div className="flex gap-2.5 items-center mb-3">
          <button
            onClick={() => navigate(`/franchise/${franchise}`)}
            className="btn-ghost"
          >
            {t('back')}
          </button>
        </div>

        <div className="font-bold text-base leading-tight mb-2.5 px-0.5">
          {formatFranchise(franchise)} · {t('collectibles')}
        </div>

        <div className="flex gap-2.5 items-center mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-toku-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchCollectibles')}
              className="input-search pl-10"
            />
          </div>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className="select-filter"
          >
            <option value="">{t('allTypes')}</option>
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {status && (
          <div className="text-toku-muted text-sm mb-3 px-0.5">{status}</div>
        )}

        {loading ? (
          <div className="text-toku-muted text-center py-8">{t('loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="text-toku-muted text-center py-8 px-2">{t('noResults')}</div>
        ) : (
          <div className="grid gap-2.5">
            {filtered.map((col) => (
              <CollectibleCard
                key={col.id}
                collectible={col}
                onClick={() => openModal(col)}
                t={t}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selected ? colDisplayName(selected, lang) : t('modalDetails')}
        image={selected?.image_url || ''}
        imageAlt={selected ? colDisplayName(selected, lang) : ''}
      >
        <SpecCard rows={rows} />
      </Modal>
    </div>
  );
}

