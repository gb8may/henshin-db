// Script para inserir dados no Supabase
// Uso: node scripts/insert-data.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://grvmisyiyxzlqfqgponm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdydm1pc3lpeXh6bHFmcWdwb25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTgwNTgsImV4cCI6MjA4MDg3NDA1OH0.VPzEEvayTYxVZ7D56h7pWFCVDykciO7OCmGrmD1J0XE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exemplo de estrutura das tabelas baseado no código
const TABLE_STRUCTURES = {
  characters: {
    fields: [
      'name_en', 'name_pt', 'name_jp', 'romaji', 'franchise', 'year',
      'description_pt', 'description_en', 'description_jp',
      'powers', 'equipment', 'civil_name_pt', 'civil_name_en', 'civil_name_jp',
      'actor_name', 'tags', 'search_terms'
    ],
    required: ['name_en', 'franchise']
  },
  glossary: {
    fields: ['jp', 'romaji', 'en', 'pt', 'explanation', 'category'],
    required: ['jp']
  },
  publications: {
    fields: [
      'title_en', 'title_pt', 'title_jp', 'pub_type', 'publisher', 'issue',
      'year', 'month', 'isbn', 'language', 'franchise', 'era',
      'cover_url', 'notes_pt', 'notes_en', 'notes_jp', 'url'
    ],
    required: ['title_en', 'franchise']
  },
  collectibles: {
    fields: [
      'name_en', 'name_pt', 'name_jp', 'franchise', 'era', 'year',
      'line', 'item_type', 'manufacturer', 'series_code', 'sku_code',
      'image_url', 'jp_search', 'rarity', 'status'
    ],
    required: ['name_en', 'franchise']
  },
  useful_links: {
    fields: [
      'category', 'name_pt', 'name_en', 'name_jp',
      'note_pt', 'note_en', 'note_jp',
      'links', 'is_active', 'sort_order'
    ],
    required: ['category', 'name_pt']
  }
};

async function showTableInfo(tableName) {
  console.log(`\n📊 Tabela: ${tableName}`);
  console.log('─'.repeat(60));
  
  if (!TABLE_STRUCTURES[tableName]) {
    console.log('⚠️  Estrutura não documentada no código');
    return;
  }
  
  const structure = TABLE_STRUCTURES[tableName];
  console.log('📋 Campos disponíveis:');
  structure.fields.forEach(field => {
    const isRequired = structure.required.includes(field);
    console.log(`   ${isRequired ? '★' : ' '} ${field}${isRequired ? ' (obrigatório)' : ''}`);
  });
  
  // Tenta buscar uma amostra
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.log(`❌ Erro: ${error.message}`);
    } else {
      console.log(`\n📈 Total de registros: ${count || 0}`);
      if (data && data.length > 0) {
        console.log('\n📝 Exemplo de registro:');
        console.log(JSON.stringify(data[0], null, 2));
      }
    }
  } catch (err) {
    console.log(`❌ Erro ao consultar: ${err.message}`);
  }
}

async function insertExample(tableName, data) {
  console.log(`\n➕ Inserindo dados em ${tableName}...`);
  try {
    const { data: inserted, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();
    
    if (error) {
      console.log(`❌ Erro: ${error.message}`);
      return null;
    }
    
    console.log('✅ Dados inseridos com sucesso!');
    console.log(JSON.stringify(inserted, null, 2));
    return inserted;
  } catch (err) {
    console.log(`❌ Erro: ${err.message}`);
    return null;
  }
}

// Função principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🔍 Análise da estrutura do Supabase\n');
    console.log('Tabelas disponíveis:');
    Object.keys(TABLE_STRUCTURES).forEach(table => {
      console.log(`  - ${table}`);
    });
    console.log('\nPara ver detalhes de uma tabela:');
    console.log('  node scripts/insert-data.js info <nome_tabela>');
    console.log('\nPara inserir dados:');
    console.log('  node scripts/insert-data.js insert <nome_tabela>');
    return;
  }
  
  const command = args[0];
  const tableName = args[1];
  
  if (command === 'info') {
    if (!tableName) {
      console.log('❌ Especifique o nome da tabela');
      return;
    }
    await showTableInfo(tableName);
  } else if (command === 'insert') {
    console.log('💡 Use a função insertExample() no código para inserir dados');
    console.log('   Ou me diga quais dados você quer inserir e eu crio o script!');
  } else {
    console.log('❌ Comando inválido. Use "info" ou "insert"');
  }
}

main().catch(console.error);

// Exemplos de dados para inserção (descomente e ajuste conforme necessário)
export async function insertCommunityExample() {
  const data = {
    category: 'community',
    name_pt: 'Exemplo de Canal Tokusatsu',
    name_en: 'Example Tokusatsu Channel',
    name_jp: 'トクサツチャンネル例',
    note_pt: 'Canal sobre tokusatsu',
    note_en: 'Tokusatsu channel',
    note_jp: '特撮チャンネル',
    links: [
      { platform: 'instagram', url: 'https://instagram.com/exemplo', label: 'Instagram' },
      { platform: 'youtube', url: 'https://youtube.com/@exemplo', label: 'YouTube' }
    ],
    is_active: true,
    sort_order: 1
  };
  
  return await insertExample('useful_links', data);
}

