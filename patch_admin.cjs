const fs = require('fs');

// 1. App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
if (!appCode.includes('AdminTips')) {
  appCode = appCode.replace(
    "import AdminBanners from './pages/admin/banners';",
    "import AdminBanners from './pages/admin/banners';\nimport AdminTips from './pages/admin/tips';"
  );
  
  appCode = appCode.replace(
    '<Route path="banners" element={<AdminBanners />} />',
    '<Route path="banners" element={<AdminBanners />} />\n          <Route path="tips" element={<AdminTips />} />'
  );
  
  fs.writeFileSync('src/App.tsx', appCode);
}

// 2. AdminLayout.tsx
let layoutCode = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');
if (!layoutCode.includes('path: \'/admin/tips\'')) {
  layoutCode = layoutCode.replace(
    "import { \n  LayoutDashboard,",
    "import { \n  LayoutDashboard,\n  Lightbulb,"
  );
  
  layoutCode = layoutCode.replace(
    "{ name: 'Settings', path: '/admin/settings', icon: Settings },",
    "{ name: 'Farmer Tips', path: '/admin/tips', icon: Lightbulb },\n    { name: 'Settings', path: '/admin/settings', icon: Settings },"
  );
  
  fs.writeFileSync('src/layouts/AdminLayout.tsx', layoutCode);
}
console.log("Admin routing updated.");
