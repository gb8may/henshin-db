import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://grvmisyiyxzlqfqgponm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdydm1pc3lpeXh6bHFmcWdwb25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTgwNTgsImV4cCI6MjA4MDg3NDA1OH0.VPzEEvayTYxVZ7D56h7pWFCVDykciO7OCmGrmD1J0XE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function analyzeTable(tableName) {
  console.log(`\n📊 Analisando tabela: ${tableName}`);
  console.log('─'.repeat(50));
  
  try {
    // Tenta buscar uma amostra para entender a estrutura
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`❌ Erro ao acessar: ${error.message}`);
      return null;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Tabela existe e tem dados');
      console.log('📋 Estrutura (primeiro registro):');
      const sample = data[0];
      Object.keys(sample).forEach(key => {
        const value = sample[key];
        const type = value === null ? 'null' : typeof value;
        const preview = typeof value === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value;
        console.log(`   ${key}: ${type} = ${JSON.stringify(preview)}`);
      });
    } else {
      console.log('⚠️  Tabela existe mas está vazia');
    }
    
    // Conta total de registros
    const { count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    console.log(`📈 Total de registros: ${count || 0}`);
    
    return data && data.length > 0 ? Object.keys(data[0]) : [];
  } catch (err) {
    console.log(`❌ Erro: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('🔍 Analisando estrutura do Supabase...\n');
  
  const tables = ['characters', 'glossary', 'publications', 'collectibles', 'useful_links'];
  
  const structures = {};
  
  for (const table of tables) {
    const columns = await analyzeTable(table);
    if (columns) {
      structures[table] = columns;
    }
  }
  
  console.log('\n\n📋 RESUMO DAS TABELAS:');
  console.log('═'.repeat(50));
  Object.entries(structures).forEach(([table, columns]) => {
    console.log(`\n${table}:`);
    columns.forEach(col => console.log(`  - ${col}`));
  });
}

main().catch(console.error);

