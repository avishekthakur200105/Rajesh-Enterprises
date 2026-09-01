const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

const importSearch = "import { useCartStore } from '../../store/cart';";
const importReplace = "import { useCartStore } from '../../store/cart';\nimport { useAuthStore } from '../../store/auth';";
code = code.replace(importSearch, importReplace);

const stateSearch = `  const { lang, setLang } = useSettingsStore();`;
const stateReplace = `  const { lang, setLang } = useSettingsStore();
  const { isAdmin } = useAuthStore();`;
code = code.replace(stateSearch, stateReplace);

const buttonsSearch = `                    <div className="flex gap-2">
                      <button 
                        disabled={addingToCart[product.id]}
                        onClick={(e) => handleAddToCart(e, product)}
                        className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-700 rounded-md py-2 text-xs font-bold transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {addingToCart[product.id] ? 'Added' : 'Cart'}
                      </button>
                      <button 
                        onClick={(e) => handleBuyNow(e, product)}
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-md py-2 text-xs font-bold transition-colors flex items-center justify-center"
                      >
                        Buy Now
                      </button>
                    </div>`;
                    
const buttonsReplace = `                    {isAdmin && (
                      <div className="flex gap-2">
                        <button 
                          disabled={addingToCart[product.id]}
                          onClick={(e) => handleAddToCart(e, product)}
                          className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-700 rounded-md py-2 text-xs font-bold transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {addingToCart[product.id] ? 'Added' : 'Cart'}
                        </button>
                        <button 
                          onClick={(e) => handleBuyNow(e, product)}
                          className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-md py-2 text-xs font-bold transition-colors flex items-center justify-center"
                        >
                          Buy Now
                        </button>
                      </div>
                    )}`;

code = code.replace(buttonsSearch, buttonsReplace);
fs.writeFileSync('src/pages/storefront/Home.tsx', code);
