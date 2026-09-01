const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Cart.tsx', 'utf8');

code = code.replace(
  "import { Link, useNavigate } from 'react-router-dom';",
  "import { Link, useNavigate, Navigate } from 'react-router-dom';\nimport { useAuthStore } from '../../store/auth';"
);

code = code.replace(
  "  const { settings } = useSettingsStore();",
  "  const { settings } = useSettingsStore();\n  const { isAdmin } = useAuthStore();\n\n  if (!isAdmin) {\n    return <Navigate to=\"/shop\" replace />;\n  }"
);

fs.writeFileSync('src/pages/storefront/Cart.tsx', code);
