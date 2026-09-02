const fs = require('fs');

let adminProdCode = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');
adminProdCode = adminProdCode.replace(
  `const { data } = await supabase.from('categories').select('id, name').order('name');`,
  `const { data } = await supabase.from('categories').select('id, name, slug').order('name');`
);
fs.writeFileSync('src/pages/admin/Products.tsx', adminProdCode);

console.log("Fixed missing slug in Products.tsx");
