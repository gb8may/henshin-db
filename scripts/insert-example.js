// Script de exemplo para inserir dados
// Execute após: npm install
// node scripts/insert-example.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://grvmisyiyxzlqfqgponm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdydm1pc3lpeXh6bHFmcWdwb25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTgwNTgsImV4cCI6MjA4MDg3NDA1OH0.VPzEEvayTYxVZ7D56h7pWFCVDykciO7OCmGrmD1J0XE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exemplos de dados para inserção
const examples = {
  character: {
    name_en: "Kamen Rider Ichigo",
    name_pt: "Kamen Rider Ichigo",
    name_jp: "仮面ライダー1号",
    romaji: "Kamen Raidā Ichigō",
    franchise: "kamen rider",
    year: 1971,
    description_pt: "O primeiro Kamen Rider, criado por Shocker.",
    description_en: "The first Kamen Rider, created by Shocker.",
    actor_name: "Hiroshi Fujioka"
  },
  
  glossary: {
    jp: "変身",
    romaji: "henshin",
    en: "transformation",
    pt: "transformação",
    explanation: "O ato de se transformar em um herói usando um cinto ou dispositivo.",
    category: "Ações"
  },
  
  publication: {
    title_en: "Kamen Rider Official Guide 2020",
    title_pt: "Guia Oficial Kamen Rider 2020",
    pub_type: "guide",
    publisher: "Kodansha",
    year: 2020,
    franchise: "kamen rider",
    language: "ja"
  },
  
  collectible: {
    name_en: "Kamen Rider Ichigo DX Typhoon",
    name_pt: "Cinto DX Typhoon Kamen Rider Ichigo",
    franchise: "kamen rider",
    year: 2020,
    line: "DX",
    item_type: "toy",
    manufacturer: "Bandai",
    status: "released"
  },
  
  useful_link: {
    category: "community",
    name_pt: "Canal Tokusatsu BR",
    name_en: "Tokusatsu BR Channel",
    note_pt: "Canal sobre tokusatsu",
    links: [
      { platform: "instagram", url: "https://instagram.com/exemplo", label: "Instagram" },
      { platform: "youtube", url: "https://youtube.com/@exemplo", label: "YouTube" }
    ],
    is_active: true,
    sort_order: 1
  }
};

async function insertData(table, data) {
  console.log(`\n➕ Inserindo em ${table}...`);
  try {
    const { data: inserted, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    
    if (error) {
      console.log(`❌ Erro: ${error.message}`);
      return null;
    }
    
    console.log('✅ Inserido com sucesso!');
    console.log(JSON.stringify(inserted, null, 2));
    return inserted;
  } catch (err) {
    console.log(`❌ Erro: ${err.message}`);
    return null;
  }
}

// Descomente a linha abaixo para inserir um exemplo
// await insertData('characters', examples.character);

console.log('📋 Exemplos de dados prontos para inserção:');
console.log('Descomente a linha no código para inserir.');
console.log('\nExemplos disponíveis:');
Object.keys(examples).forEach(key => {
  console.log(`  - ${key}`);
});

