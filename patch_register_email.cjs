const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Register.tsx', 'utf8');

if (!code.includes("email, // Store email")) {
  code = code.replace(
    "full_name: fullName,",
    "full_name: fullName,\n            email: email, // Store email in profiles too"
  );
  fs.writeFileSync('src/pages/storefront/Register.tsx', code);
}
