const fs = require('fs');

// 1. Admin Categories
let adminCatsCode = fs.readFileSync('src/pages/admin/categories/index.tsx', 'utf8');
adminCatsCode = adminCatsCode.replace(
  `setCategories((data || []).filter((c: any) => !['_owner_profile_', '_farmer_tips_'].includes(c.slug)));`,
  `setCategories((data || []).filter((c: any) => !['_owner_profile_', '_farmer_tips_', '_store_settings_', '_contact_messages_'].includes(c.slug)));`
);
fs.writeFileSync('src/pages/admin/categories/index.tsx', adminCatsCode);

// 2. Shop Categories
let shopCode = fs.readFileSync('src/pages/storefront/Shop.tsx', 'utf8');
shopCode = shopCode.replace(
  `if (cats) setCategories(cats);`,
  `if (cats) setCategories(cats.filter((c: any) => !['_owner_profile_', '_farmer_tips_', '_store_settings_', '_contact_messages_'].includes(c.slug)));`
);
fs.writeFileSync('src/pages/storefront/Shop.tsx', shopCode);

// 3. Admin Products (category dropdown)
let adminProdCode = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');
adminProdCode = adminProdCode.replace(
  `if (data) setCategories(data);`,
  `if (data) setCategories(data.filter((c: any) => !['_owner_profile_', '_farmer_tips_', '_store_settings_', '_contact_messages_'].includes(c.slug)));`
);
fs.writeFileSync('src/pages/admin/Products.tsx', adminProdCode);

console.log("Categories patched.");
