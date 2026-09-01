const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductDetail.tsx', 'utf8');

// Title size
code = code.replace("text-3xl md:text-4xl font-bold text-stone-900 mb-2", "text-2xl md:text-3xl font-bold text-stone-900 mb-2");
code = code.replace("text-lg text-stone-500 mb-6", "text-base text-stone-500 mb-4");

// Price size
code = code.replace("text-3xl font-bold text-green-700", "text-2xl font-bold text-green-700");
code = code.replace("text-xl text-stone-400 line-through", "text-lg text-stone-400 line-through");

// Image padding
code = code.replace("p-8 flex items-center", "p-4 flex items-center");

fs.writeFileSync('src/pages/storefront/ProductDetail.tsx', code);
