import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env'));
const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_ANON_KEY);

async function fix() {
  const { data, error } = await supabase
    .from('categories')
    .update({ is_active: true })
    .in('slug', ['_owner_profile_', '_contact_messages_']);
  console.log('Fixed:', error || 'Success');
}
fix();
