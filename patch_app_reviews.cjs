const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import AdminCustomers from './pages/admin/customers';",
  "import AdminCustomers from './pages/admin/customers';\nimport AdminReviews from './pages/admin/reviews';"
);

code = code.replace(
  '<Route path="customers" element={<AdminCustomers />} />',
  '<Route path="customers" element={<AdminCustomers />} />\n          <Route path="reviews" element={<AdminReviews />} />'
);

fs.writeFileSync('src/App.tsx', code);
