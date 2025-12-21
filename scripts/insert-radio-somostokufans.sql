-- Inserir card de conteúdo ao vivo - Rádio Somos Tokufans
-- Execute este SQL no SQL Editor do Supabase

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
  'lives',
  'Rádio Somos Tokufans',
  'Radio Somos Tokufans',
  'ラジオソモストクファンズ',
  'Rádio online sobre tokusatsu',
  'Online radio about tokusatsu',
  '特撮オンラインラジオ',
  '[
    {
      "platform": "other",
      "url": "http://play.radios.com.br/218889",
      "label": "Rádio Online"
    }
  ]'::jsonb,
  true,
  1
);

