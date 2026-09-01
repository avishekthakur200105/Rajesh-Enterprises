const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductDetail.tsx', 'utf8');

const search = `  const addItem = useCartStore(state => state.addItem);`;
const replace = `  const addItem = useCartStore(state => state.addItem);
  const { isAdmin } = useAuthStore();`;

code = code.replace(search, replace);

const buttonSearch = `                <div className="flex gap-2">
                  <button 
                    disabled={addingToCart || isOutOfStock}
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-50 text-green-700 border border-green-700 hover:bg-green-100 disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 disabled:cursor-not-allowed h-11 rounded-lg font-bold flex items-center justify-center transition-colors whitespace-nowrap px-3 text-sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button 
                    disabled={isOutOfStock}
                    onClick={handleBuyNow}
                    className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white h-11 rounded-lg font-bold flex items-center justify-center transition-colors whitespace-nowrap px-3 text-sm"
                  >
                    Buy Now
                  </button>
                </div>`;

const buttonReplace = `                {isAdmin ? (
                  <div className="flex gap-2">
                    <button 
                      disabled={addingToCart || isOutOfStock}
                      onClick={handleAddToCart}
                      className="flex-1 bg-green-50 text-green-700 border border-green-700 hover:bg-green-100 disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 disabled:cursor-not-allowed h-11 rounded-lg font-bold flex items-center justify-center transition-colors whitespace-nowrap px-3 text-sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {addingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                    <button 
                      disabled={isOutOfStock}
                      onClick={handleBuyNow}
                      className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white h-11 rounded-lg font-bold flex items-center justify-center transition-colors whitespace-nowrap px-3 text-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                ) : (
                  <div className="bg-stone-100 p-4 rounded-md text-sm text-stone-600 text-center">
                    Purchasing is restricted to administrators only.
                  </div>
                )}`;

code = code.replace(buttonSearch, buttonReplace);

fs.writeFileSync('src/pages/storefront/ProductDetail.tsx', code);
