const fs = require('fs');
let code = fs.readFileSync('src/layouts/StorefrontLayout.tsx', 'utf8');

const cartSearch = `<Link to="/cart" className="text-stone-600 hover:text-green-700 relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>`;

const cartReplace = `{isAdmin && (
              <Link to="/cart" className="text-stone-600 hover:text-green-700 relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              )}`;

code = code.replace(cartSearch, cartReplace);
fs.writeFileSync('src/layouts/StorefrontLayout.tsx', code);
