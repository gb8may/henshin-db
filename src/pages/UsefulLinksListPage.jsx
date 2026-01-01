import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { Search, ExternalLink, Instagram, Youtube, Twitter, Globe, X } from 'lucide-react';
import { supabase, SUPABASE_PERSONALITIES_STORAGE_URL } from '../lib/supabase';
import { saveCache, loadCache } from '../hooks/useCache';
import { Modal, SpecCard } from '../components/Modal';

function safeText(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function hasValue(v) {
  const s = safeText(v);
  return s.length > 0 && s.toLowerCase() !== "null";
}

const SOCIAL_ICONS = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  x: X,
  default: Globe,
};

function getSocialIcon(platform) {
  const key = platform?.toLowerCase() || 'default';
  return SOCIAL_ICONS[key] || SOCIAL_ICONS.default;
}

function slugifyName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function imageUrlForPersonality(name) {
  const slug = slugifyName(name);
  return `${SUPABASE_PERSONALITIES_STORAGE_URL}/${slug}.png`;
}

// Função para mapear dados brutos para um idioma específico
function mapItemsToLang(rawItems, lang) {
  return rawItems.map(item => {
    const nameKey = `name_${lang}`;
    const noteKey = `note_${lang}`;
    return {
      id: item.id.toString(),
      name: item[nameKey] || item.name_pt || item.name_en || item.name_jp || '',
      description: item[noteKey] || item.note_pt || item.note_en || item.note_jp || '',
      links: Array.isArray(item.links) ? item.links : [],
      // Mantém os dados brutos para remapear quando o idioma mudar
      _raw: item,
    };
  });
}

export function UsefulLinksListPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [rawItems, setRawItems] = useState([]); // Dados brutos com todos os idiomas
  const [items, setItems] = useState([]); // Dados mapeados para o idioma atual
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const selectedIdRef = useRef(null);

  useEffect(() => {
    loadItems();
  }, [category]);

  // Remapeia os dados quando o idioma muda
  useEffect(() => {
    if (rawItems.length > 0) {
      const mapped = mapItemsToLang(rawItems, lang);
      setItems(mapped);
      // Atualiza o item selecionado no modal se houver
      if (selectedIdRef.current) {
        const rawItem = rawItems.find(r => r.id.toString() === selectedIdRef.current);
        if (rawItem) {
          const updatedSelected = mapItemsToLang([rawItem], lang)[0];
          setSelected(updatedSelected);
        }
      }
    }
  }, [lang, rawItems]);

  useEffect(() => {
    filterItems();
  }, [search, items]);

  async function loadItems() {
    // Tenta carregar do Supabase primeiro
    if (navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('useful_links')
          .select('id,category,name_pt,name_en,name_jp,note_pt,note_en,note_jp,links,is_active,sort_order')
          .eq('category', category)
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (!error && data) {
          // Salva os dados brutos (com todos os idiomas) no cache
          setRawItems(data);
          const mapped = mapItemsToLang(data, lang);
          setItems(mapped);
          setFiltered(mapped);
          // Salva dados brutos no cache para poder remapear depois
          saveCache(`useful_links_raw_${category}`, 'global', data);
          return;
        }
      } catch (err) {
        console.log('Erro ao carregar do Supabase:', err);
      }
    }

    // Fallback para cache local - tenta buscar dados brutos primeiro
    const cachedRaw = loadCache(`useful_links_raw_${category}`, 'global');
    if (cachedRaw.data && Array.isArray(cachedRaw.data) && cachedRaw.data.length > 0) {
      // Se tem dados brutos no cache, usa eles
      setRawItems(cachedRaw.data);
      const mapped = mapItemsToLang(cachedRaw.data, lang);
      setItems(mapped);
      setFiltered(mapped);
    } else {
      // Fallback para cache antigo (dados já mapeados)
      const cached = loadCache(`useful_links_${category}`, 'global');
      const list = Array.isArray(cached.data) ? cached.data : [];
      setItems(list);
      setFiltered(list);
      // Tenta reconstruir dados brutos a partir dos dados mapeados (limitado)
      if (list.length > 0) {
        const reconstructed = list.map(item => ({
          id: item.id,
          name_pt: item.name,
          name_en: item.name,
          name_jp: item.name,
          note_pt: item.description,
          note_en: item.description,
          note_jp: item.description,
          links: item.links || [],
        }));
        setRawItems(reconstructed);
      }
    }
  }

  function filterItems() {
    const query = safeText(search).toLowerCase();
    if (!query) {
      setFiltered(items);
      return;
    }
    const filtered = items.filter((item) => {
      const haystack = [
        item.name,
        item.description,
        ...(item.links || []).map(l => l.label || l.platform || l.url),
      ].map(x => safeText(x).toLowerCase()).join(' ');
      return haystack.includes(query);
    });
    setFiltered(filtered);
  }

  function openModal(item) {
    // Only open modal for personalities (actors category)
    if (category === 'actors') {
      // Salva o ID do item para poder atualizar quando o idioma mudar
      selectedIdRef.current = item.id;
      setSelected(item);
      setModalOpen(true);
    }
  }

  const categoryLabel = category === 'community' ? t('usefulCommunity') :
                       category === 'actors' ? t('usefulActors') :
                       category === 'lives' ? t('usefulLives') :
                       t('usefulCollectibles');

  return (
    <div className="flex flex-col h-full">
      <div className="px-3.5 py-3.5 pb-[180px] overflow-auto flex-1 -webkit-overflow-scrolling-touch relative">
        <div className="flex gap-2.5 items-center mb-3">
          <button
            onClick={() => navigate('/useful-links')}
            className="btn-ghost"
          >
            {t('back')}
          </button>
        </div>

        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div className="font-bold text-base leading-tight">
            {categoryLabel}
          </div>
        </div>

        <div className="flex gap-2.5 items-center mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-toku-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('usefulSearch')}
              className="input-search pl-10"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-toku-muted text-center py-8 px-2">
            {items.length === 0 ? t('noItemsYet') : t('noResults')}
          </div>
        ) : (
          <div className="grid gap-2.5">
            {filtered.map((item) => (
              <div 
                key={item.id} 
                className={`card ${category === 'actors' ? 'cursor-pointer hover:bg-toku-panel-2' : ''}`}
                onClick={() => {
                  if (category === 'actors') {
                    openModal(item);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm leading-tight mb-1">
                      {item.name}
                    </div>
                    {item.description && (
                      <div className="text-toku-muted text-[13px] leading-snug">
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>

                {item.links && item.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.links.map((link, idx) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-toku-border bg-[rgba(255,255,255,0.06)] text-xs text-toku-text hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{link.label || link.platform}</span>
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {category === 'actors' && (
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelected(null);
            selectedIdRef.current = null;
          }}
          title={selected?.name || t('modalDetails')}
          image={selected?.name ? imageUrlForPersonality(selected.name) : ''}
          imageAlt={selected?.name || ''}
        >
          {selected && (
            <SpecCard rows={[
              { key: t('itemName'), value: selected.name },
              { key: t('itemDescription'), value: selected.description },
              ...(selected.links || []).map((link, idx) => ({
                key: link.label || link.platform || `Link ${idx + 1}`,
                value: link.url
              }))
            ].filter(r => r.value)} />
          )}
        </Modal>
      )}
    </div>
  );
}

