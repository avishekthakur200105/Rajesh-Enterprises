import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  console.log('Profiles data:', data, error);
}
run();
