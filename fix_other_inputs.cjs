const fs = require('fs');

function fixInputs(file) {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  code = code.replace(/value=\{formData\.([^}]+)\}/g, 'value={formData.$1 || \'\'}');
  // we might have doubled up if it was already || ''
  code = code.replace(/\|\| '' \|\| ''/g, '|| \'\'');

  fs.writeFileSync(file, code);
}

fixInputs('src/pages/admin/categories/index.tsx');
fixInputs('src/pages/admin/Products.tsx');
fixInputs('src/pages/admin/banners/index.tsx');
