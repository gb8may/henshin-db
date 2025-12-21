import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://grvmisyiyxzlqfqgponm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdydm1pc3lpeXh6bHFmcWdwb25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTgwNTgsImV4cCI6MjA4MDg3NDA1OH0.VPzEEvayTYxVZ7D56h7pWFCVDykciO7OCmGrmD1J0XE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/henshin-images`;
export const SUPABASE_PERSONALITIES_STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/henshin-personalidades`;

