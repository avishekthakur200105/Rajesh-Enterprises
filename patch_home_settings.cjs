const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

if (!code.includes('useSettingsStore')) {
  code = code.replace(
    "import { Link } from 'react-router-dom';",
    "import { Link } from 'react-router-dom';\nimport { useSettingsStore } from '../../store/settings';"
  );
  
  code = code.replace(
    "const [lang, setLang] = useState<'en' | 'np'>('en');",
    "const [lang, setLang] = useState<'en' | 'np'>('en');\n  const { settings } = useSettingsStore();"
  );
  
  // Replace {t[lang].heroTitle} with {lang === 'np' ? t['np'].heroTitle : settings.shopName}
  code = code.replace(
    "{t[lang].heroTitle}",
    "{lang === 'np' ? t['np'].heroTitle : settings.shopName}"
  );
  
  fs.writeFileSync('src/pages/storefront/Home.tsx', code);
}
