const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

code = code.replace(
  'className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"',
  'className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"'
);

code = code.replace(
  '<div className="aspect-square bg-stone-100 relative overflow-hidden">',
  '<div className="aspect-square bg-stone-50 relative overflow-hidden p-2">'
);

fs.writeFileSync('src/pages/storefront/Home.tsx', code);
