const { createClient } = require('@supabase/supabase-js');
const baseUrl = process.env.VITE_SUPABASE_URL.replace('/rest/v1/', '');
const supabase = createClient(baseUrl, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('reviews').select('*').limit(1);
  console.log("Data:", data);
}
run();
