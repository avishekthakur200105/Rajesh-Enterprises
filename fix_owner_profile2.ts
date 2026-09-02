import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)?.[1];
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1];

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function fix() {
  const { data, error } = await supabase
    .from('categories')
    .update({ is_active: true })
    .in('slug', ['_owner_profile_', '_contact_messages_']);
  console.log('Fixed:', error || 'Success');
}
fix();
