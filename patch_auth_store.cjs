const fs = require('fs');
let code = fs.readFileSync('src/store/auth.ts', 'utf8');

code = code.replace(
  "isAdmin: profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'manager'",
  "isAdmin: profile?.role?.toLowerCase() === 'admin' || profile?.role?.toLowerCase() === 'super_admin' || profile?.role?.toLowerCase() === 'manager'"
);

fs.writeFileSync('src/store/auth.ts', code);
