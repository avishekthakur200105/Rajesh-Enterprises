const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

const ownerSectionRegex = /\{\/\* Owner Profile Section \*\/\}\s*\{ownerProfile && ownerProfile\.name && \([\s\S]*?<\/section>\s*\)\}/;

const match = code.match(ownerSectionRegex);

if (match) {
  const ownerSectionCode = match[0];
  // Remove it from its current position
  code = code.replace(ownerSectionCode, '');
  
  // Insert it before the Hero Section
  code = code.replace(
    "{/* Hero Section */}",
    ownerSectionCode + "\n\n      {/* Hero Section */}"
  );
  
  fs.writeFileSync('src/pages/storefront/Home.tsx', code);
  console.log("Successfully reordered.");
} else {
  console.log("Could not find owner section");
}
