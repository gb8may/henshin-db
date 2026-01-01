import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { formatFranchise } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { saveCache, loadCache, fmtAge } from '../hooks/useCache';
import { PublicationCard } from '../components/Card';
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

function pubDisplayTitle(p, lang) {
  return pickFieldByLang(p, 'title', lang) || safeText(p.title_en) || safeText(p.title_pt) || safeText(p.title_jp) || 'Publication';
}

export function PublicationsPage() {
  const { franchise } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [publications, setPublications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [pubType, setPubType] = useState('');
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadPublications();
  }, [franchise, lang]);

  useEffect(() => {
    filterPublications();
  }, [search, pubType, publications, lang]);

  async function loadPublications() {
    setLoading(true);
    setStatus(t('loading'));

    if (!navigator.onLine) {
      const cached = loadCache('publications', franchise);
      const list = Array.isArray(cached.data) ? cached.data : [];
      setPublications(list);
      const typs = Array.from(new Set(list.map(x => safeText(x.pub_type)).filter(Boolean))).sort();
      setTypes(typs);
      setStatus(list.length
        ? `${list.length} ${t('publicationsItems')} (${t('cacheSuffix')} · ${t(fmtAge(cached.ts))})`
        : t('noCacheAvailable'));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('publications')
        .select('id,title_en,title_pt,title_jp,pub_type,publisher,issue,year,month,isbn,language,franchise,era,cover_url,notes_pt,notes_en,notes_jp,url,created_at')
        .eq('franchise', franchise);

      if (error) throw error;

      const list = Array.isArray(data) ? data : [];
      list.sort((a, b) => {
        const ay = Number(a.year || 0), by = Number(b.year || 0);
        if (by !== ay) return by - ay;
        return pubDisplayTitle(a, lang).localeCompare(pubDisplayTitle(b, lang), 'pt', { sensitivity: 'base' });
      });

      setPublications(list);
      const typs = Array.from(new Set(list.map(x => safeText(x.pub_type)).filter(Boolean))).sort();
      setTypes(typs);
      setStatus(`${list.length} ${t('publicationsItems')}`);
      saveCache('publications', franchise, list);
    } catch (err) {
      const cached = loadCache('publications', franchise);
      const list = Array.isArray(cached.data) ? cached.data : [];
      setPublications(list);
      const typs = Array.from(new Set(list.map(x => safeText(x.pub_type)).filter(Boolean))).sort();
      setTypes(typs);
      setStatus(list.length
        ? `${list.length} ${t('publicationsItems')} (${t('cacheSuffix')} · ${t(fmtAge(cached.ts))})`
        : `Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function filterPublications() {
    const query = safeText(search).toLowerCase();
    const type = safeText(pubType).toLowerCase();

    const filtered = publications.filter((p) => {
      if (type && safeText(p.pub_type).toLowerCase() !== type) return false;
      if (!query) return true;
      return [
        p.title_pt, p.title_en, p.title_jp,
        p.pub_type, p.publisher, p.issue,
        p.year, p.month, p.isbn, p.language,
        p.notes_pt, p.notes_en, p.notes_jp,
        p.era
      ].some((v) => safeText(v).toLowerCase().includes(query));
    });

    setFiltered(filtered);
  }

  function openModal(pub) {
    setSelected(pub);
    setModalOpen(true);
  }

  const rows = selected ? [
    { key: t('spec_title_pt'), value: selected.title_pt },
    { key: t('spec_title_en'), value: selected.title_en },
    { key: t('spec_title_jp'), value: selected.title_jp },
    { key: t('spec_type'), value: selected.pub_type },
    { key: t('spec_publisher'), value: selected.publisher },
    { key: t('spec_issue'), value: selected.issue },
    { key: t('spec_year'), value: selected.year },
    { key: t('spec_month'), value: selected.month },
    { key: t('spec_language'), value: selected.language },
    { key: t('spec_isbn'), value: selected.isbn },
    { key: t('spec_era'), value: selected.era },
    { key: t('spec_franchise'), value: formatFranchise(selected.franchise) },
    { key: t('spec_notes'), value: pickFieldByLang(selected, 'notes', lang) },
    { key: t('spec_url'), value: selected.url },
  ].filter(r => hasValue(r.value)) : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-3.5 py-3.5 pb-[180px] overflow-auto flex-1 -webkit-overflow-scrolling-touch">
        <div className="flex gap-2.5 items-center mb-3">
          <button
            onClick={() => navigate(`/franchise/${franchise}`)}
            className="btn-ghost"
          >
            {t('back')}
          </button>
        </div>

        <div className="font-bold text-base leading-tight mb-2.5 px-0.5">
          {formatFranchise(franchise)} · {t('publications')}
        </div>

        <div className="flex gap-2.5 items-center mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-toku-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPublications')}
              className="input-search pl-10"
            />
          </div>
          <select
            value={pubType}
            onChange={(e) => setPubType(e.target.value)}
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
            {filtered.map((pub) => (
              <PublicationCard
                key={pub.id}
                publication={pub}
                onClick={() => openModal(pub)}
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
        title={selected ? pubDisplayTitle(selected, lang) : t('modalDetails')}
        image={selected?.cover_url || ''}
        imageAlt={selected ? pubDisplayTitle(selected, lang) : ''}
        linkUrl={selected?.url || ''}
      >
        <SpecCard rows={rows} />
      </Modal>
    </div>
  );
}

