const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/categories/index.tsx', 'utf8');

code = code.replace(
  "setCategories(data || []);",
  "setCategories((data || []).filter((c: any) => !['_owner_profile_', '_farmer_tips_'].includes(c.slug)));"
);

fs.writeFileSync('src/pages/admin/categories/index.tsx', code);
console.log("Patched fetchCategories to hide internal ones.");
