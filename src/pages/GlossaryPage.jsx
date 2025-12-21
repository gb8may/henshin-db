import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { supabase } from '../lib/supabase';
import { saveCache, loadCache, fmtAge } from '../hooks/useCache';
import { GlossaryCard } from '../components/Card';
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

export function GlossaryPage() {
  const { franchise } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [terms, setTerms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadGlossary();
  }, [lang]);

  useEffect(() => {
    filterGlossary();
  }, [search, category, terms, lang]);

  async function loadGlossary() {
    setLoading(true);
    setStatus(t('loading'));

    if (!navigator.onLine) {
      const cached = loadCache('glossary', 'global');
      const list = Array.isArray(cached.data) ? cached.data : [];
      setTerms(list);
      const cats = Array.from(new Set(list.map(x => safeText(x.category)).filter(Boolean))).sort();
      setCategories(cats);
      setStatus(list.length
        ? `${list.length} ${t('terms')} (${t('cacheSuffix')} · ${t(fmtAge(cached.ts))})`
        : t('noCacheAvailable'));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('glossary')
        .select('id,jp,romaji,en,pt,explanation,category');

      if (error) throw error;

      const list = Array.isArray(data) ? data : [];
      list.sort((a, b) =>
        (safeText(a.pt) || safeText(a.en) || safeText(a.jp)).localeCompare(
          safeText(b.pt) || safeText(b.en) || safeText(b.jp),
          'pt',
          { sensitivity: 'base' }
        )
      );

      setTerms(list);
      const cats = Array.from(new Set(list.map(x => safeText(x.category)).filter(Boolean))).sort();
      setCategories(cats);
      setStatus(`${list.length} ${t('terms')}`);
      saveCache('glossary', 'global', list);
    } catch (err) {
      const cached = loadCache('glossary', 'global');
      const list = Array.isArray(cached.data) ? cached.data : [];
      setTerms(list);
      const cats = Array.from(new Set(list.map(x => safeText(x.category)).filter(Boolean))).sort();
      setCategories(cats);
      setStatus(list.length
        ? `${list.length} ${t('terms')} (${t('cacheSuffix')} · ${t(fmtAge(cached.ts))})`
        : `Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function filterGlossary() {
    const query = safeText(search).toLowerCase();
    const cat = safeText(category).toLowerCase();

    const filtered = terms.filter((term) => {
      if (cat && safeText(term.category).toLowerCase() !== cat) return false;
      if (!query) return true;
      return [term.jp, term.romaji, term.en, term.pt, term.explanation, term.category]
        .some((v) => safeText(v).toLowerCase().includes(query));
    });

    setFiltered(filtered);
  }

  function openModal(term) {
    setSelected(term);
    setModalOpen(true);
  }

  const rows = selected ? [
    { key: t('spec_jp'), value: selected.jp },
    { key: t('spec_romaji'), value: selected.romaji },
    { key: t('spec_en'), value: selected.en },
    { key: t('spec_pt'), value: selected.pt },
    { key: t('spec_category'), value: selected.category },
    { key: t('spec_explanation'), value: selected.explanation },
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
          {t('glossary')}
        </div>

        <div className="flex gap-2.5 items-center mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-toku-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchGlossary')}
              className="input-search pl-10"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select-filter"
          >
            <option value="">{t('allCategories')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
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
            {filtered.map((term) => (
              <GlossaryCard
                key={term.id}
                term={term}
                onClick={() => openModal(term)}
                t={t}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selected ? (selected.pt || selected.en || selected.jp || 'Term') : t('modalDetails')}
      >
        <SpecCard rows={rows} />
      </Modal>
    </div>
  );
}

