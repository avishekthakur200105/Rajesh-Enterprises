const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Login.tsx', 'utf8');

if (!code.includes("email: data.user.email")) {
  code = code.replace(
    "await supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', data.user.id);",
    "await supabase.from('profiles').update({ last_login: new Date().toISOString(), email: data.user.email }).eq('id', data.user.id);"
  );
  fs.writeFileSync('src/pages/storefront/Login.tsx', code);
}
