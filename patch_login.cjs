const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Login.tsx', 'utf8');

if (!code.includes("last_login")) {
  code = code.replace(
    "if (data.user) {\n        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();",
    `if (data.user) {
        // Try to update last_login
        await supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', data.user.id);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();`
  );
  fs.writeFileSync('src/pages/storefront/Login.tsx', code);
}
