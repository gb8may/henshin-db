-- Inserir card da comunidade @somostokufans
-- Execute este SQL no SQL Editor do Supabase
-- IMPORTANTE: Execute primeiro o arquivo create-useful-links-table.sql para criar a tabela

INSERT INTO useful_links (
  category,
  name_pt,
  name_en,
  name_jp,
  note_pt,
  note_en,
  note_jp,
  links,
  is_active,
  sort_order
) VALUES (
  'community',
  'Somos Toku Fans',
  'Somos Toku Fans',
  'ソモストクファンズ',
  'Perfil sobre tokusatsu',
  'Tokusatsu profile',
  '特撮プロフィール',
  '[
    {
      "platform": "instagram",
      "url": "https://instagram.com/somostokufans",
      "label": "Instagram"
    }
  ]'::jsonb,
  true,
  1
);

