const fs = require('fs');

// Patch Home.tsx
let homeCode = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');
homeCode = homeCode.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5"',
  'className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"'
);
homeCode = homeCode.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"',
  'className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"'
);

// Decrease text size in product cards on Home to fit smaller cards
homeCode = homeCode.replace(/text-sm mb-1 leading-snug/g, 'text-xs md:text-sm mb-1 leading-snug');
fs.writeFileSync('src/pages/storefront/Home.tsx', homeCode);

// Patch Shop.tsx
let shopCode = fs.readFileSync('src/pages/storefront/Shop.tsx', 'utf8');
shopCode = shopCode.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"',
  'className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"'
);
shopCode = shopCode.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"',
  'className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"'
);

// Decrease text size in product cards on Shop to fit smaller cards
shopCode = shopCode.replace(/text-sm mb-1 line-clamp-2 leading-snug/g, 'text-xs md:text-sm mb-1 line-clamp-2 leading-snug');
fs.writeFileSync('src/pages/storefront/Shop.tsx', shopCode);

console.log("Grids patched.");
