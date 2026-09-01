const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import AdminCategories from '\.\/pages\/admin\/categories';/, "import AdminCategories from './pages/admin/categories/index';");
code = code.replace(/import AdminCustomers from '\.\/pages\/admin\/customers';/, "import AdminCustomers from './pages/admin/customers/index';");
code = code.replace(/import AdminReviews from '\.\/pages\/admin\/reviews';/, "import AdminReviews from './pages/admin/reviews/index';");
code = code.replace(/import AdminSettings from '\.\/pages\/admin\/settings';/, "import AdminSettings from './pages/admin/settings/index';");
code = code.replace(/import AdminBanners from '\.\/pages\/admin\/banners';/, "import AdminBanners from './pages/admin/banners/index';");
code = code.replace(/import AdminTips from '\.\/pages\/admin\/tips';/, "import AdminTips from './pages/admin/tips/index';");
code = code.replace(/import AdminMessages from '\.\/pages\/admin\/messages';/, "import AdminMessages from './pages/admin/messages/index';");
code = code.replace(/import AccountDashboard from '\.\/pages\/storefront\/account';/, "import AccountDashboard from './pages/storefront/account/index';");

fs.writeFileSync('src/App.tsx', code);
