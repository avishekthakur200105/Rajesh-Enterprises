const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/categories/index.tsx', 'utf8');

code = code.replace(
  "    if (!confirm('Are you sure you want to delete this category? (Products inside will not be deleted)')) return;",
  ""
);

fs.writeFileSync('src/pages/admin/categories/index.tsx', code);
console.log("Fixed categories");
