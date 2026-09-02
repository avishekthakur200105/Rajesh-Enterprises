const { createClient } = require('@supabase/supabase-js');

const baseUrl = process.env.VITE_SUPABASE_URL.replace('/rest/v1/', '');
const supabase = createClient(baseUrl, process.env.VITE_SUPABASE_ANON_KEY);

async function fix() {
  const { data, error } = await supabase
    .from('categories')
    .update({ is_active: true })
    .in('slug', ['_owner_profile_', '_store_settings_', '_contact_messages_']);
  console.log('Fixed DB:', error || 'Success');
}
fix();
