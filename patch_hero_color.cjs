const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

// Replace section background
code = code.replace(
  '<section className="relative bg-green-900 text-white overflow-hidden">',
  '<section className="relative bg-stone-50 text-stone-900 overflow-hidden">'
);

// Remove the dark background image div
code = code.replace(
  '<div className="absolute inset-0 opacity-20 bg-[url(\'https://images.unsplash.com/photo-1592982537447-6f23349e54bb?q=80&w=2940&auto=format&fit=crop\')] bg-cover bg-center"></div>',
  ''
);

// Update Sprout icon color
code = code.replace(
  '<Sprout className="h-12 w-12 text-green-400 mb-4" />',
  '<Sprout className="h-12 w-12 text-green-600 mb-4" />'
);

// Update span text color inside h1
code = code.replace(
  '<span className="text-green-400">Agro Pharmacy</span>',
  '<span className="text-green-700">Agro Pharmacy</span>'
);

// Update paragraph text color
code = code.replace(
  '<p className="text-base md:text-lg text-green-100 max-w-2xl mb-8">',
  '<p className="text-base md:text-lg text-stone-600 max-w-2xl mb-8">'
);

// Update button slightly to fit the light theme better (optional, but amber looks good, maybe green looks better now)
code = code.replace(
  '<Link to="/shop" className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-2.5 px-6 rounded-full transition-colors font-semibold text-base">',
  '<Link to="/shop" className="bg-green-700 hover:bg-green-800 text-white shadow-md font-bold py-2.5 px-6 rounded-full transition-colors font-semibold text-base">'
);


fs.writeFileSync('src/pages/storefront/Home.tsx', code);
