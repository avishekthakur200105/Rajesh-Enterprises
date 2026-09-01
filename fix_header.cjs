const fs = require('fs');
let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

code = code.replace(
  '<h1 className="text-xl font-semibold text-stone-800 hidden sm:block">\n          <h1 className="text-xl font-semibold text-stone-800">',
  '<h1 className="text-xl font-semibold text-stone-800">'
);
fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
