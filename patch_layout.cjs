const fs = require('fs');
let code = fs.readFileSync('src/layouts/StorefrontLayout.tsx', 'utf8');

// 1. Add import for settings store
code = code.replace(
  "import { useAuthStore } from '../store/auth';",
  "import { useAuthStore } from '../store/auth';\nimport { useSettingsStore } from '../store/settings';\nimport { useEffect } from 'react';"
);

// 2. Fetch settings inside layout
code = code.replace(
  "const { user, isAdmin } = useAuthStore();",
  "const { user, isAdmin } = useAuthStore();\n  const { settings, fetchSettings } = useSettingsStore();\n\n  useEffect(() => {\n    fetchSettings();\n  }, []);\n"
);

// 3. Replace static Top bar text
code = code.replace(
  "Welcome to Rajesh Enterprises - Your Trusted Nepal Agro Pharmacy",
  "{settings.topBarText}"
);

// 4. Replace Header logo text
code = code.replace(
  /<span className="font-bold text-xl leading-none text-green-900 tracking-tight">Rajesh<\/span>\s*<span className="text-xs font-semibold text-green-700 uppercase tracking-widest">Enterprises<\/span>/,
  '<span className="font-bold text-xl leading-none text-green-900 tracking-tight whitespace-nowrap">{settings.shopName.split(\' \')[0] || \'Rajesh\'}</span>\n                <span className="text-xs font-semibold text-green-700 uppercase tracking-widest whitespace-nowrap">{settings.shopName.substring(settings.shopName.indexOf(\' \') + 1) || \'Enterprises\'}</span>'
);

// 5. Replace Footer texts
code = code.replace(
  /<span className="font-bold text-lg">Rajesh Enterprises<\/span>/,
  '<span className="font-bold text-lg">{settings.shopName}</span>'
);
code = code.replace(
  "Your trusted partner in agriculture. Supplying top quality seeds, fertilizers, and farming equipment across Nepal.",
  "{settings.description}"
);
code = code.replace(
  "📞 +977 1-2345678",
  "📞 {settings.phone}"
);
code = code.replace(
  "📧 info@rajeshenterprises.com",
  "📧 {settings.email}"
);
code = code.replace(
  "Rajesh Enterprises. All rights reserved.",
  "{settings.shopName}. All rights reserved."
);

fs.writeFileSync('src/layouts/StorefrontLayout.tsx', code);
