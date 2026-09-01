const fs = require('fs');
let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

code = code.replace('MessageSquare', 'MessageSquare,\n  Star');
code = code.replace(
  "{ name: 'Customers', path: '/admin/customers', icon: Users },",
  "{ name: 'Customers', path: '/admin/customers', icon: Users },\n    { name: 'Reviews', path: '/admin/reviews', icon: Star },"
);

fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
