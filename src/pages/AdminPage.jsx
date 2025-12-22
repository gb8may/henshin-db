import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { supabase } from '../lib/supabase';
import { Plus, Check, X } from 'lucide-react';

const TABLES = [
  { key: 'characters', label: 'Personagens' },
  { key: 'glossary', label: 'Glossário' },
  { key: 'publications', label: 'Publicações' },
  { key: 'collectibles', label: 'Colecionáveis' },
  { key: 'useful_links', label: 'Links Úteis' },
];

const TABLE_FIELDS = {
  characters: [
    { key: 'name_en', label: 'Nome (EN)', type: 'text', required: true },
    { key: 'name_pt', label: 'Nome (PT)', type: 'text' },
    { key: 'name_jp', label: 'Nome (JP)', type: 'text' },
    { key: 'romaji', label: 'Romaji', type: 'text' },
    { key: 'franchise', label: 'Franquia', type: 'select', required: true, options: ['kamen rider', 'super sentai', 'metal hero', 'ultraman', 'cybercops'] },
    { key: 'year', label: 'Ano', type: 'number' },
    { key: 'description_pt', label: 'Descrição (PT)', type: 'textarea' },
    { key: 'description_en', label: 'Descrição (EN)', type: 'textarea' },
    { key: 'description_jp', label: 'Descrição (JP)', type: 'textarea' },
    { key: 'powers', label: 'Poderes', type: 'textarea' },
    { key: 'equipment', label: 'Equipamentos', type: 'textarea' },
    { key: 'civil_name_pt', label: 'Nome Civil (PT)', type: 'text' },
    { key: 'civil_name_en', label: 'Nome Civil (EN)', type: 'text' },
    { key: 'civil_name_jp', label: 'Nome Civil (JP)', type: 'text' },
    { key: 'actor_name', label: 'Ator', type: 'text' },
    { key: 'tags', label: 'Tags', type: 'text' },
    { key: 'search_terms', label: 'Termos de Busca', type: 'text' },
  ],
  glossary: [
    { key: 'jp', label: 'JP', type: 'text', required: true },
    { key: 'romaji', label: 'Romaji', type: 'text' },
    { key: 'en', label: 'EN', type: 'text' },
    { key: 'pt', label: 'PT', type: 'text' },
    { key: 'explanation', label: 'Explicação', type: 'textarea' },
    { key: 'category', label: 'Categoria', type: 'text' },
  ],
  publications: [
    { key: 'title_en', label: 'Título (EN)', type: 'text', required: true },
    { key: 'title_pt', label: 'Título (PT)', type: 'text' },
    { key: 'title_jp', label: 'Título (JP)', type: 'text' },
    { key: 'pub_type', label: 'Tipo', type: 'text' },
    { key: 'publisher', label: 'Editora', type: 'text' },
    { key: 'issue', label: 'Edição', type: 'text' },
    { key: 'year', label: 'Ano', type: 'number' },
    { key: 'month', label: 'Mês', type: 'number' },
    { key: 'isbn', label: 'ISBN', type: 'text' },
    { key: 'language', label: 'Idioma', type: 'text' },
    { key: 'franchise', label: 'Franquia', type: 'select', required: true, options: ['kamen rider', 'super sentai', 'metal hero', 'ultraman', 'cybercops'] },
    { key: 'era', label: 'Era', type: 'text' },
    { key: 'cover_url', label: 'URL da Capa', type: 'url' },
    { key: 'notes_pt', label: 'Notas (PT)', type: 'textarea' },
    { key: 'notes_en', label: 'Notas (EN)', type: 'textarea' },
    { key: 'notes_jp', label: 'Notas (JP)', type: 'textarea' },
    { key: 'url', label: 'URL', type: 'url' },
  ],
  collectibles: [
    { key: 'name_en', label: 'Nome (EN)', type: 'text', required: true },
    { key: 'name_pt', label: 'Nome (PT)', type: 'text' },
    { key: 'name_jp', label: 'Nome (JP)', type: 'text' },
    { key: 'franchise', label: 'Franquia', type: 'select', required: true, options: ['kamen rider', 'super sentai', 'metal hero', 'ultraman', 'cybercops'] },
    { key: 'era', label: 'Era', type: 'text' },
    { key: 'year', label: 'Ano', type: 'number' },
    { key: 'line', label: 'Linha', type: 'text' },
    { key: 'item_type', label: 'Tipo', type: 'text' },
    { key: 'manufacturer', label: 'Fabricante', type: 'text' },
    { key: 'series_code', label: 'Código da Série', type: 'text' },
    { key: 'sku_code', label: 'SKU', type: 'text' },
    { key: 'image_url', label: 'URL da Imagem', type: 'url' },
    { key: 'jp_search', label: 'Busca JP', type: 'text' },
    { key: 'rarity', label: 'Raridade', type: 'text' },
    { key: 'status', label: 'Status', type: 'text' },
  ],
  useful_links: [
    { key: 'category', label: 'Categoria', type: 'select', required: true, options: ['actors', 'community', 'lives', 'collectibles'] },
    { key: 'name_pt', label: 'Nome (PT)', type: 'text', required: true },
    { key: 'name_en', label: 'Nome (EN)', type: 'text' },
    { key: 'name_jp', label: 'Nome (JP)', type: 'text' },
    { key: 'note_pt', label: 'Nota (PT)', type: 'text' },
    { key: 'note_en', label: 'Nota (EN)', type: 'text' },
    { key: 'note_jp', label: 'Nota (JP)', type: 'text' },
    { key: 'is_active', label: 'Ativo', type: 'checkbox', default: true },
    { key: 'sort_order', label: 'Ordem', type: 'number', default: 0 },
  ],
};

export function AdminPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedTable, setSelectedTable] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  function handleTableSelect(table) {
    setSelectedTable(table);
    const fields = TABLE_FIELDS[table] || [];
    const initialData = {};
    fields.forEach(field => {
      if (field.default !== undefined) {
        initialData[field.key] = field.default;
      } else if (field.type === 'checkbox') {
        initialData[field.key] = field.default !== false;
      } else {
        initialData[field.key] = '';
      }
    });
    setFormData(initialData);
    setMessage({ type: '', text: '' });
  }

  function handleFieldChange(key, value) {
    setFormData({ ...formData, [key]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Limpa campos vazios
      const cleanData = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          cleanData[key] = value;
        }
      });

      const { data, error } = await supabase
        .from(selectedTable)
        .insert(cleanData)
        .select();

      if (error) throw error;

      setMessage({ type: 'success', text: '✅ Dados inseridos com sucesso!' });
      setFormData({});
      setTimeout(() => {
        setSelectedTable('');
        setFormData({});
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: `❌ Erro: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  const fields = selectedTable ? (TABLE_FIELDS[selectedTable] || []) : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-3.5 py-3.5 pb-[90px] overflow-auto flex-1 -webkit-overflow-scrolling-touch">
        <div className="flex gap-2.5 items-center mb-3">
          <button
            onClick={() => navigate('/')}
            className="btn-ghost"
          >
            {t('back')}
          </button>
        </div>

        <div className="font-bold text-base leading-tight mb-2.5 px-0.5">
          Administração - Inserir Dados
        </div>

        {!selectedTable ? (
          <div className="grid gap-3 justify-items-center mt-4">
            {TABLES.map((table) => (
              <button
                key={table.key}
                onClick={() => handleTableSelect(table.key)}
                className="w-full max-w-[360px] btn-primary"
              >
                <span>{table.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 mt-4">
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-sm">
                  Inserir em: {TABLES.find(t => t.key === selectedTable)?.label}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTable('');
                    setFormData({});
                    setMessage({ type: '', text: '' });
                  }}
                  className="btn-ghost p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {fields.map((field) => {
                if (field.type === 'textarea') {
                  return (
                    <div key={field.key} className="mb-3">
                      <label className="block text-xs text-toku-muted mb-1.5">
                        {field.label} {field.required && '*'}
                      </label>
                      <textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="input-search resize-none"
                        rows="3"
                        required={field.required}
                      />
                    </div>
                  );
                } else if (field.type === 'select') {
                  return (
                    <div key={field.key} className="mb-3">
                      <label className="block text-xs text-toku-muted mb-1.5">
                        {field.label} {field.required && '*'}
                      </label>
                      <select
                        value={formData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="select-filter"
                        required={field.required}
                      >
                        <option value="">Selecione...</option>
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  );
                } else if (field.type === 'checkbox') {
                  return (
                    <div key={field.key} className="mb-3 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData[field.key] || false}
                        onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label className="text-xs text-toku-muted">
                        {field.label}
                      </label>
                    </div>
                  );
                } else {
                  return (
                    <div key={field.key} className="mb-3">
                      <label className="block text-xs text-toku-muted mb-1.5">
                        {field.label} {field.required && '*'}
                      </label>
                      <input
                        type={field.type}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                        className="input-search"
                        required={field.required}
                      />
                    </div>
                  );
                }
              })}

              {message.text && (
                <div className={`mt-3 p-2 rounded text-sm ${
                  message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-toku-border border-t-transparent rounded-full animate-spin" />
                      <span>Inserindo...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Inserir</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTable('');
                    setFormData({});
                    setMessage({ type: '', text: '' });
                  }}
                  className="btn-ghost"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


