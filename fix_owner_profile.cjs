require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fix() {
  const { data, error } = await supabase
    .from('categories')
    .update({ is_active: true })
    .eq('slug', '_owner_profile_');
  console.log(data, error);
}
fix();
