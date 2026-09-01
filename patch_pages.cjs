const fs = require('fs');

function patchFile(file) {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  if (!code.includes('useSettingsStore')) {
    code = `import { useSettingsStore } from '../../store/settings';\n` + code;
    
    // Add hook
    code = code.replace(
      /export default function (\w+)\(\) \{/,
      "export default function $1() {\n  const { settings } = useSettingsStore();"
    );
    
    // Replace text
    code = code.replace(/About Rajesh Enterprises/g, "About {settings.shopName}");
    code = code.replace(/Rajesh Enterprises/g, "{settings.shopName}");
    
    fs.writeFileSync(file, code);
    console.log("Patched " + file);
  }
}

patchFile('src/pages/storefront/About.tsx');
patchFile('src/pages/storefront/Terms.tsx');
patchFile('src/pages/storefront/ReturnPolicy.tsx');
patchFile('src/pages/storefront/ShippingPolicy.tsx');
