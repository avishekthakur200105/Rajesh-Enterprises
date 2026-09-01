const fs = require('fs');
let code = fs.readFileSync('src/layouts/StorefrontLayout.tsx', 'utf8');

const searchCart = `              <Link to="/cart" className="text-stone-600 hover:text-green-700 relative">
                <ShoppingCart className="h-6 w-6" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>`;

const replaceCart = `              {isAdmin && (
                <Link to="/cart" className="text-stone-600 hover:text-green-700 relative">
                  <ShoppingCart className="h-6 w-6" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {items.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </Link>
              )}`;

code = code.replace(searchCart, replaceCart);
fs.writeFileSync('src/layouts/StorefrontLayout.tsx', code);
