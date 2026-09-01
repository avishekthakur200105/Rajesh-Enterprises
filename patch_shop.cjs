const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Shop.tsx', 'utf8');

// Categories Section Sidebar
code = code.replace("w-full lg:w-64 flex-shrink-0", "w-full lg:w-56 flex-shrink-0");
code = code.replace("mb-6 pb-4", "mb-4 pb-3");

// Grid & Typography
code = code.replace("lg:grid-cols-3 gap-6", "lg:grid-cols-4 gap-4 sm:gap-5");
code = code.replace("text-2xl font-bold text-stone-800", "text-xl font-bold text-stone-800");

// Product Card inside Shop
code = code.replace("aspect-square bg-stone-50 relative overflow-hidden p-4", "aspect-square bg-stone-50 relative overflow-hidden p-2");
code = code.replace("font-semibold text-stone-800 text-lg mb-2 truncate", "font-medium text-stone-800 text-sm mb-1 line-clamp-2 leading-snug whitespace-normal");
code = code.replace("text-xs text-stone-400 mb-1 uppercase tracking-wider", "text-[10px] text-stone-500 mb-1 uppercase tracking-wider");
code = code.replace("text-sm text-stone-400 line-through", "text-xs text-stone-400 line-through");
code = code.replace(/span className="font-bold text-green-700">\{formatCurrency/g, 'span className="font-bold text-green-700 text-sm">{formatCurrency');

// Update to line-clamp plugin support if not present in tailwind config, actually line-clamp-2 is standard in v3.
code = code.replace("mb-2 truncate", "mb-1 line-clamp-2 leading-snug whitespace-normal");

fs.writeFileSync('src/pages/storefront/Shop.tsx', code);
