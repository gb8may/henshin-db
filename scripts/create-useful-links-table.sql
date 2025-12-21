-- Criar tabela useful_links no Supabase
-- Execute este SQL primeiro no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS useful_links (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  name_pt TEXT,
  name_en TEXT,
  name_jp TEXT,
  note_pt TEXT,
  note_en TEXT,
  note_jp TEXT,
  links JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_useful_links_category ON useful_links(category);
CREATE INDEX IF NOT EXISTS idx_useful_links_is_active ON useful_links(is_active);
CREATE INDEX IF NOT EXISTS idx_useful_links_sort_order ON useful_links(sort_order);

-- Habilitar Row Level Security (RLS) - ajuste conforme necessário
ALTER TABLE useful_links ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (anon)
CREATE POLICY "Allow public read access" ON useful_links
  FOR SELECT
  USING (true);

-- Política para permitir inserção (ajuste conforme suas necessidades de segurança)
-- Por enquanto, permitindo inserção pública - você pode restringir depois
CREATE POLICY "Allow public insert" ON useful_links
  FOR INSERT
  WITH CHECK (true);

-- Política para permitir atualização (ajuste conforme suas necessidades de segurança)
CREATE POLICY "Allow public update" ON useful_links
  FOR UPDATE
  USING (true);

-- Política para permitir deleção (ajuste conforme suas necessidades de segurança)
CREATE POLICY "Allow public delete" ON useful_links
  FOR DELETE
  USING (true);

