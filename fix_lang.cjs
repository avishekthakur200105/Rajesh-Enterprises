const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

// The dictionary is already there. Let's make sure by checking:
if (!code.includes('const t = {')) {
  console.log("Dictionary not found, something is wrong.");
  process.exit(1);
}

// 1. Hero replacements
code = code.replace(
  /Nepal's Premier/g,
  '{t[lang].premier}'
);
code = code.replace(
  /Agro Pharmacy/g,
  '{t[lang].agro}'
);
code = code.replace(
  /High-quality seeds, organic fertilizers, and reliable farming tools\. Empowering Nepali farmers for a better harvest\./g,
  '{t[lang].heroDesc}'
);
code = code.replace(
  />\s*Shop Now\s*<\/Link>/g,
  '>{t[lang].shopNow}</Link>'
);
code = code.replace(
  />\s*Founder & Owner\s*<\/p>/g,
  '>{t[lang].founder}</p>'
);

// 2. Latest Offers
code = code.replace(
  />\s*Latest Offers\s*<\/h2>/g,
  '>{t[lang].latestOffers}</h2>'
);

// 3. Features
code = code.replace(
  />\s*Quality Products\s*<\/h3>/g,
  '>{t[lang].quality}</h3>'
);
code = code.replace(
  />\s*Certified seeds and genuine agro-chemicals\.\s*<\/p>/g,
  '>{t[lang].qualityDesc}</p>'
);
code = code.replace(
  />\s*Nationwide Delivery\s*<\/h3>/g,
  '>{t[lang].delivery}</h3>'
);
code = code.replace(
  />\s*Fast delivery to all major districts in Nepal\.\s*<\/p>/g,
  '>{t[lang].deliveryDesc}</p>'
);
code = code.replace(
  />\s*Expert Guidance\s*<\/h3>/g,
  '>{t[lang].expert}</h3>'
);
code = code.replace(
  />\s*Free consultation for your farming needs\.\s*<\/p>/g,
  '>{t[lang].expertDesc}</p>'
);

// 4. Featured Products
code = code.replace(
  />\s*Featured Products\s*<\/h2>/g,
  '>{t[lang].featured}</h2>'
);
code = code.replace(
  />\s*Top picks for this season's farming\.\s*<\/p>/g,
  '>{t[lang].featuredDesc}</p>'
);
code = code.replace(
  /View All <ArrowRight/g,
  '{t[lang].viewAll} <ArrowRight'
);
code = code.replace(
  />\s*Sale\s*<\/div>/g,
  '>{t[lang].sale}</div>'
);

fs.writeFileSync('src/pages/storefront/Home.tsx', code);
console.log("Fixed!");
