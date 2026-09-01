const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Checkout.tsx', 'utf8');

if (!code.includes("Navigate } from 'react-router-dom'")) {
  code = code.replace(
    "import { useNavigate } from 'react-router-dom';",
    "import { useNavigate, Navigate } from 'react-router-dom';"
  );
}

code = code.replace(
  "  const { user } = useAuthStore();",
  "  const { user, isAdmin } = useAuthStore();"
);

const redirectCode = `  if (!isAdmin) {
    return <Navigate to="/shop" replace />;
  }`;

code = code.replace(
  "  const { subtotal } = getSummary();",
  `${redirectCode}\n\n  const { subtotal } = getSummary();`
);

fs.writeFileSync('src/pages/storefront/Checkout.tsx', code);
