import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { Search, Plus, ExternalLink, Instagram, Youtube, Twitter, Globe, X } from 'lucide-react';
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

export function UsefulLinksListPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    links: [{ platform: 'instagram', url: '', label: '' }],
  });

  useEffect(() => {
    loadItems();
  }, [category, lang]);

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
          const list = data.map(item => {
            // Seleciona o nome e descrição baseado no idioma atual
            const nameKey = `name_${lang}`;
            const noteKey = `note_${lang}`;
            return {
              id: item.id.toString(),
              name: item[nameKey] || item.name_pt || item.name_en || item.name_jp || '',
              description: item[noteKey] || item.note_pt || item.note_en || item.note_jp || '',
              links: Array.isArray(item.links) ? item.links : [],
            };
          });
          setItems(list);
          setFiltered(list);
          saveCache(`useful_links_${category}`, 'global', list);
          return;
        }
      } catch (err) {
        console.log('Erro ao carregar do Supabase:', err);
      }
    }

    // Fallback para cache local
    const cached = loadCache(`useful_links_${category}`, 'global');
    const list = Array.isArray(cached.data) ? cached.data : [];
    setItems(list);
    setFiltered(list);
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

  function handleAddLink() {
    setFormData({
      ...formData,
      links: [...formData.links, { platform: 'instagram', url: '', label: '' }],
    });
  }

  function handleRemoveLink(index) {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: newLinks });
  }

  function handleLinkChange(index, field, value) {
    const newLinks = [...formData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, links: newLinks });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!hasValue(formData.name)) return;

    const newItem = {
      id: Date.now().toString(),
      name: safeText(formData.name),
      description: safeText(formData.description),
      links: formData.links
        .filter(l => hasValue(l.url))
        .map(l => ({
          platform: safeText(l.platform) || 'instagram',
          url: safeText(l.url),
          label: safeText(l.label) || safeText(l.platform) || 'Link',
        })),
      createdAt: new Date().toISOString(),
    };

    const updated = [...items, newItem];
    setItems(updated);
    setFiltered(updated);
    saveCache(`useful_links_${category}`, 'global', updated);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      links: [{ platform: 'instagram', url: '', label: '' }],
    });
    setShowAddForm(false);
  }

  function handleDelete(id) {
    if (!confirm(t('confirmDelete'))) return;
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    setFiltered(updated);
    saveCache(`useful_links_${category}`, 'global', updated);
  }

  function openModal(item) {
    // Only open modal for personalities (actors category)
    if (category === 'actors') {
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
      <div className="px-3.5 py-3.5 pb-[90px] overflow-auto flex-1 -webkit-overflow-scrolling-touch">
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
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-ghost flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addItem')}</span>
          </button>
        </div>

        {showAddForm && (
          <div className="card mb-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-toku-muted mb-1.5">{t('itemName')} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-search"
                  placeholder={t('itemNamePlaceholder')}
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-toku-muted mb-1.5">{t('itemDescription')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-search resize-none"
                  rows="3"
                  placeholder={t('itemDescriptionPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-xs text-toku-muted mb-1.5">{t('socialLinks')}</label>
                {formData.links.map((link, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      value={link.platform}
                      onChange={(e) => handleLinkChange(index, 'platform', e.target.value)}
                      className="select-filter flex-shrink-0 w-32"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="twitter">Twitter</option>
                      <option value="x">X (Twitter)</option>
                      <option value="other">Outro</option>
                    </select>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                      className="input-search flex-1"
                      placeholder={t('linkLabelPlaceholder')}
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                      className="input-search flex-1"
                      placeholder={t('linkUrlPlaceholder')}
                    />
                    {formData.links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                        className="btn-ghost px-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="btn-ghost text-xs"
                >
                  + {t('addAnotherLink')}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      name: '',
                      description: '',
                      links: [{ platform: 'instagram', url: '', label: '' }],
                    });
                  }}
                  className="btn-ghost"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

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
                className={`card ${category === 'actors' ? 'cursor-pointer' : ''}`}
                onClick={() => category === 'actors' && openModal(item)}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="btn-ghost p-1 flex-shrink-0"
                    title={t('remove')}
                  >
                    <X className="w-4 h-4" />
                  </button>
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

      {category === 'actors' && selected && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selected.name || t('modalDetails')}
          image={selected.name ? imageUrlForPersonality(selected.name) : ''}
          imageAlt={selected.name || ''}
        >
          <SpecCard rows={[
            { key: t('itemName'), value: selected.name },
            { key: t('itemDescription'), value: selected.description },
            ...(selected.links || []).map((link, idx) => ({
              key: link.label || link.platform || `Link ${idx + 1}`,
              value: link.url
            }))
          ].filter(r => r.value)} />
        </Modal>
      )}
    </div>
  );
}

