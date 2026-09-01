const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductDetail.tsx', 'utf8');

const searchSection = `          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-stone-200 pb-8 lg:pb-0 lg:pr-8">
              <h3 className="text-lg font-bold text-stone-800 mb-4">Write a Review</h3>
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 text-center">
                <Star className="h-10 w-10 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-600 text-sm">
                  You can review this product by placing an order. A review form will appear after checkout!
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6">`;

const replaceSection = `          <div className="p-6 md:p-8">
            <div className="space-y-6">`;

code = code.replace(searchSection, replaceSection);
fs.writeFileSync('src/pages/storefront/ProductDetail.tsx', code);
