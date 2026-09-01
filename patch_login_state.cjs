const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Login.tsx', 'utf8');

if (!code.includes('useAuthStore')) {
  code = code.replace(
    "import { Sprout } from 'lucide-react';",
    "import { Sprout } from 'lucide-react';\nimport { useAuthStore } from '../../store/auth';"
  );
}

if (!code.includes('const { setUser } = useAuthStore()')) {
  code = code.replace(
    "const navigate = useNavigate();",
    "const navigate = useNavigate();\n  const { setUser } = useAuthStore();"
  );
}

code = code.replace(
  `      // Check user role for redirection
      let isAdmin = false;
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        if (profile && (profile.role === 'admin' || profile.role === 'super_admin' || profile.role === 'manager')) {
          isAdmin = true;
        }
      }

      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }`,
  `      // Check user role for redirection
      let isAdmin = false;
      let userProfile = null;
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        userProfile = profile;
        if (profile && (profile.role === 'admin' || profile.role === 'super_admin' || profile.role === 'manager')) {
          isAdmin = true;
        }
      }
      
      // Update global auth store state immediately so the layout doesn't bounce us back
      setUser(data.user, userProfile);

      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }`
);

fs.writeFileSync('src/pages/storefront/Login.tsx', code);
