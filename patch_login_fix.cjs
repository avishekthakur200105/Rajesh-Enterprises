const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Login.tsx', 'utf8');

code = code.replace(
  /const { error } = await supabase\.auth\.signInWithPassword\(\{\s*email,\s*password,\s*\}\);\s*if \(error\) throw error;\s*navigate\('\/'\);/,
  `const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      let isAdmin = false;
      let userProfile = null;
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        userProfile = profile;
        if (profile && (profile.role === 'admin' || profile.role === 'super_admin' || profile.role === 'manager')) {
          isAdmin = true;
        }
      }
      
      setUser(data.user, userProfile);

      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }`
);

fs.writeFileSync('src/pages/storefront/Login.tsx', code);
