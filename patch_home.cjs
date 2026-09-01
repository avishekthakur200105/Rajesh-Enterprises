const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

code = code.replace(
  'className="py-16 bg-stone-100 border-b border-stone-200"',
  'className="py-10 md:py-16 bg-stone-100 border-b border-stone-200"'
);

code = code.replace(
  'className="py-12 bg-white border-b border-stone-100"',
  'className="py-8 md:py-12 bg-white border-b border-stone-100"'
);

code = code.replace(
  'className="py-20 bg-stone-50"',
  'className="py-12 md:py-20 bg-stone-50"'
);

fs.writeFileSync('src/pages/storefront/Home.tsx', code);
