import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { formatFranchise } from '../lib/i18n';
import { supabase, SUPABASE_STORAGE_URL } from '../lib/supabase';
import { saveCache, loadCache, fmtAge } from '../hooks/useCache';
import { CharacterCard } from '../components/Card';
import { Modal, SpecCard } from '../components/Modal';
import { Search } from 'lucide-react';

function slugifyName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function imageUrlForCharacter(nameEn) {
  const slug = slugifyName(nameEn);
  return `${SUPABASE_STORAGE_URL}/${slug}.png`;
}

function pickFieldByLang(obj, base, lang) {
  const map = { pt: `${base}_pt`, en: `${base}_en`, ja: `${base}_jp` };
  const key = map[lang] || map.en;
  return String(obj?.[key] || obj?.[map.en] || obj?.[map.pt] || obj?.[map.ja] || obj?.[base] || "").trim();
}

function safeText(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function hasValue(v) {
  const s = safeText(v);
  return s.length > 0 && s.toLowerCase() !== "null";
}

export function CharactersPage() {
  const { franchise } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [characters, setCharacters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, [franchise, lang]);

  useEffect(() => {
    filterCharacters();
  }, [search, characters, lang]);

  async function loadCharacters() {
    setLoading(true);
    setStatus(t('loading'));

    if (!navigator.onLine) {
      const cached = loadCache('characters', franchise);
      const list = Array.isArray(cached.data) ? cached.data : [];
      setCharacters(list);
      setStatus(list.length
        ? `${list.length} ${t('charactersItems')} (${t('cacheSuffix')} · ${t(fmtAge(cached.ts))})`
        : t('noCacheAvailable'));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('characters')
        .select('id,name_en,name_pt,name_jp,romaji,franchise,year,description_pt,description_en,description_jp,powers,equipment,civil_name_pt,civil_name_en,civil_name_jp,actor_name,tags,search_terms')
        .eq('franchise', franchise);

      if (error) throw error;

      const list = Array.isArray(data) ? data : [];
      list.sort((a, b) => safeText(a.name_en).localeCompare(safeText(b.name_en), 'en', { sensitivity: 'base' }));
      
      setCharacters(list);
      setStatus(`${list.length} ${t('charactersItems')}`);
      saveCache('characters', franchise, list);
    } catch (err) {
      const cached = loadCache('characters', franchise);
      const list = Array.isArray(cached.data) ? cached.data : [];
      setCharacters(list);
      setStatus(list.length
        ? `${list.length} ${t('charactersItems')} (${t('cacheSuffix')} · ${t(fmtAge(cached.ts))})`
        : `Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function filterCharacters() {
    const query = safeText(search).toLowerCase();
    if (!query) {
      setFiltered(characters);
      return;
    }
    const filtered = characters.filter((c) =>
      [c.name_en, c.name_pt, c.name_jp, c.romaji, c.civil_name_pt, c.civil_name_en, c.civil_name_jp, c.actor_name]
        .some((v) => safeText(v).toLowerCase().includes(query))
    );
    setFiltered(filtered);
  }

  function openModal(character) {
    setSelected(character);
    setModalOpen(true);
  }

  const rows = selected ? [
    { key: t('spec_name_pt'), value: selected.name_pt },
    { key: t('spec_name_en'), value: selected.name_en },
    { key: t('spec_name_jp'), value: selected.name_jp },
    { key: t('spec_romaji'), value: selected.romaji },
    { key: t('spec_franchise'), value: formatFranchise(selected.franchise) },
    { key: t('spec_year'), value: selected.year },
    { key: t('spec_civil_pt'), value: selected.civil_name_pt },
    { key: t('spec_civil_en'), value: selected.civil_name_en },
    { key: t('spec_civil_jp'), value: selected.civil_name_jp },
    { key: t('spec_actor'), value: selected.actor_name },
    { key: t('spec_description'), value: pickFieldByLang(selected, 'description', lang) },
    { key: t('spec_powers'), value: selected.powers },
    { key: t('spec_equipment'), value: selected.equipment },
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
          {formatFranchise(franchise)} · {t('characters')}
        </div>

        <div className="flex gap-2.5 items-center mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-toku-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchCharacters')}
              className="input-search pl-10"
            />
          </div>
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
            {filtered.map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                imageUrl={imageUrlForCharacter(char.name_en)}
                onClick={() => openModal(char)}
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
        title={pickFieldByLang(selected, 'name', lang) || selected?.name_en || t('modalDetails')}
        image={selected ? imageUrlForCharacter(selected.name_en) : ''}
        imageAlt={selected?.name_en || ''}
      >
        <SpecCard rows={rows} />
      </Modal>
    </div>
  );
}

