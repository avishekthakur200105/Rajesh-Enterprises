const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductDetail.tsx', 'utf8');

const searchSection = `            {/* Product Meta */}
            <div className="space-y-3 text-sm text-stone-600 border-t border-stone-200 pt-6">
              <div className="flex">
                <span className="w-24 font-semibold">SKU:</span>
                <span>{selectedVariant?.sku || product.sku || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-semibold">Unit:</span>
                <span>{product.unit || 'N/A'}</span>
              </div>
            </div>`;

code = code.replace(searchSection, "");
fs.writeFileSync('src/pages/storefront/ProductDetail.tsx', code);
