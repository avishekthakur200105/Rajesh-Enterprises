const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('AdminMessages')) {
  // Add import
  code = code.replace(
    "import AdminTips from './pages/admin/tips';",
    "import AdminTips from './pages/admin/tips';\nimport AdminMessages from './pages/admin/messages';"
  );
  
  // Add route
  code = code.replace(
    '<Route path="tips" element={<AdminTips />} />',
    '<Route path="tips" element={<AdminTips />} />\n          <Route path="messages" element={<AdminMessages />} />'
  );
  
  fs.writeFileSync('src/App.tsx', code);
}
