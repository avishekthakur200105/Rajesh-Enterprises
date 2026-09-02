const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductDetail.tsx', 'utf8');

const search = `            {!isAdmin ? (
              <div className="bg-orange-50 p-4 sm:p-5 rounded-xl border border-orange-100 mb-6 max-w-lg">
                <p className="text-orange-800 text-sm font-medium">Purchasing is currently restricted to administrators only.</p>
              </div>
            ) : (`;

const replace = `            {false ? null : (`;

code = code.replace(search, replace);
fs.writeFileSync('src/pages/storefront/ProductDetail.tsx', code);
