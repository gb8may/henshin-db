# Estrutura do Banco de Dados - Supabase

## 📊 Tabelas

### 1. `characters` (Personagens)

**Campos:**
- `id` (auto)
- `name_en` (string, obrigatório) - Nome em inglês
- `name_pt` (string) - Nome em português
- `name_jp` (string) - Nome em japonês
- `romaji` (string) - Romaji do nome
- `franchise` (string, obrigatório) - "kamen rider", "super sentai", "metal hero", "ultraman", "cybercops"
- `year` (number) - Ano
- `description_pt` (text) - Descrição em português
- `description_en` (text) - Descrição em inglês
- `description_jp` (text) - Descrição em japonês
- `powers` (text) - Poderes
- `equipment` (text) - Equipamentos
- `civil_name_pt` (string) - Nome civil em português
- `civil_name_en` (string) - Nome civil em inglês
- `civil_name_jp` (string) - Nome civil em japonês
- `actor_name` (string) - Nome do ator
- `tags` (text) - Tags
- `search_terms` (text) - Termos de busca

**Exemplo:**
```json
{
  "name_en": "Kamen Rider Ichigo",
  "name_pt": "Kamen Rider Ichigo",
  "name_jp": "仮面ライダー1号",
  "romaji": "Kamen Raidā Ichigō",
  "franchise": "kamen rider",
  "year": 1971,
  "description_pt": "Primeiro Kamen Rider...",
  "actor_name": "Hiroshi Fujioka"
}
```

### 2. `glossary` (Glossário)

**Campos:**
- `id` (auto)
- `jp` (string, obrigatório) - Termo em japonês
- `romaji` (string) - Romaji
- `en` (string) - Tradução em inglês
- `pt` (string) - Tradução em português
- `explanation` (text) - Explicação
- `category` (string) - Categoria

**Exemplo:**
```json
{
  "jp": "変身",
  "romaji": "henshin",
  "en": "transformation",
  "pt": "transformação",
  "explanation": "Ato de se transformar em um herói...",
  "category": "Ações"
}
```

### 3. `publications` (Publicações)

**Campos:**
- `id` (auto)
- `title_en` (string, obrigatório)
- `title_pt` (string)
- `title_jp` (string)
- `pub_type` (string) - Tipo: "book", "mook", "guide", etc.
- `publisher` (string) - Editora
- `issue` (string) - Edição
- `year` (number) - Ano
- `month` (number) - Mês
- `isbn` (string) - ISBN
- `language` (string) - Idioma
- `franchise` (string, obrigatório)
- `era` (string) - Era (ex: "Showa", "Heisei", "Reiwa")
- `cover_url` (string) - URL da capa
- `notes_pt` (text) - Notas em português
- `notes_en` (text) - Notas em inglês
- `notes_jp` (text) - Notas em japonês
- `url` (string) - URL externa
- `created_at` (timestamp, auto)

**Exemplo:**
```json
{
  "title_en": "Kamen Rider Official Guide",
  "title_pt": "Guia Oficial Kamen Rider",
  "pub_type": "guide",
  "publisher": "Kodansha",
  "year": 2020,
  "franchise": "kamen rider",
  "cover_url": "https://..."
}
```

### 4. `collectibles` (Colecionáveis)

**Campos:**
- `id` (auto)
- `name_en` (string, obrigatório)
- `name_pt` (string)
- `name_jp` (string)
- `franchise` (string, obrigatório)
- `era` (string)
- `year` (number)
- `line` (string) - Linha: "DX", "SHF", "sofubi", etc.
- `item_type` (string) - Tipo: "figure", "toy", "mecha", etc.
- `manufacturer` (string) - Fabricante: "Bandai", etc.
- `series_code` (string) - Código da série
- `sku_code` (string) - SKU
- `image_url` (string) - URL da imagem
- `jp_search` (string) - Termo de busca em japonês
- `rarity` (string) - Raridade
- `status` (string) - Status: "released", "pre-order", etc.
- `created_at` (timestamp, auto)

**Exemplo:**
```json
{
  "name_en": "Kamen Rider Ichigo DX Belt",
  "name_pt": "Cinto DX Kamen Rider Ichigo",
  "franchise": "kamen rider",
  "year": 2020,
  "line": "DX",
  "item_type": "toy",
  "manufacturer": "Bandai",
  "status": "released"
}
```

### 5. `useful_links` (Links Úteis) - Opcional

**Campos:**
- `id` (auto)
- `category` (string, obrigatório) - "actors", "community", "lives", "collectibles"
- `name_pt` (string, obrigatório)
- `name_en` (string)
- `name_jp` (string)
- `note_pt` (string)
- `note_en` (string)
- `note_jp` (string)
- `links` (jsonb) - Array de objetos: `[{platform: "instagram", url: "...", label: "..."}]`
- `is_active` (boolean) - Padrão: true
- `sort_order` (number) - Padrão: 0
- `created_at` (timestamp, auto)

**Exemplo:**
```json
{
  "category": "community",
  "name_pt": "Canal Tokusatsu BR",
  "name_en": "Tokusatsu BR Channel",
  "note_pt": "Canal sobre tokusatsu",
  "links": [
    {"platform": "instagram", "url": "https://instagram.com/...", "label": "Instagram"},
    {"platform": "youtube", "url": "https://youtube.com/...", "label": "YouTube"}
  ],
  "is_active": true,
  "sort_order": 1
}
```

## 🔗 Conexão

- **URL:** https://grvmisyiyxzlqfqgponm.supabase.co
- **Chave Anônima:** (está no código)

## 📝 Notas

- Todas as tabelas têm `id` auto-incrementado
- Use `franchise` em minúsculas: "kamen rider", "super sentai", etc.
- Campos de texto podem ser `null` ou vazios
- `created_at` é automático nas tabelas que têm

