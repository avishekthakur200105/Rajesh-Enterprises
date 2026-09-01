const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

// 1. Add imports
code = code.replace(
  "import { Link } from 'react-router-dom';",
  "import { Link, useNavigate } from 'react-router-dom';"
);
code = code.replace(
  "import { useSettingsStore } from '../../store/settings';",
  "import { useSettingsStore } from '../../store/settings';\nimport { useCartStore } from '../../store/cart';"
);
code = code.replace(
  "import { ArrowRight, Leaf, ShieldCheck, Truck, Sprout, Languages } from 'lucide-react';",
  "import { ArrowRight, Leaf, ShieldCheck, Truck, Sprout, Languages, ShoppingCart } from 'lucide-react';"
);

// 2. Add hooks and functions
const componentStart = "export default function Home() {\n";
const hooksToAdd = \`  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    const price = product.discount_price || product.regular_price;
    
    addItem({
      id: product.id,
      productId: product.id,
      name: product.title,
      price: Number(price),
      quantity: 1,
      image: product.image_url?.[0]?.url,
      maxStock: 99
    });
    
    setTimeout(() => {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }, 1000);
  };

  const handleBuyNow = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    const price = product.discount_price || product.regular_price;
    
    addItem({
      id: product.id,
      productId: product.id,
      name: product.title,
      price: Number(price),
      quantity: 1,
      image: product.image_url?.[0]?.url,
      maxStock: 99
    });
    
    navigate('/checkout');
  };\n\`;

code = code.replace(componentStart, componentStart + hooksToAdd);

// 3. Update the product card map
const oldCard = \`              {featuredProducts.map((product) => (
                <Link key={product.id} to={\`/products/\${product.slug}\`} className="group bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-stone-50 relative overflow-hidden p-2">
                    {product.image_url?.[0]?.url ? (
                      <img src={product.image_url[0].url} alt={product.title} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <Leaf className="h-12 w-12" />
                      </div>
                    )}
                    {product.discount_price && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{t[lang].sale}</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-stone-800 text-xs md:text-sm mb-1 leading-snug truncate">{product.title}</h3>
                    <div className="flex items-center gap-2">
                      {product.discount_price ? (
                        <>
                          <span className="font-bold text-green-700 text-sm">{formatCurrency(product.discount_price)}</span>
                          <span className="text-xs text-stone-400 line-through">{formatCurrency(product.regular_price)}</span>
                        </>
                      ) : (
                        <span className="font-bold text-green-700 text-sm">{formatCurrency(product.regular_price)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}\`;

const newCard = \`              {featuredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  <Link to={\`/product/\${product.slug}\`} className="block relative">
                    <div className="aspect-square bg-stone-50 relative overflow-hidden p-2">
                      {product.image_url?.[0]?.url ? (
                        <img src={product.image_url[0].url} alt={product.title} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <Leaf className="h-12 w-12" />
                        </div>
                      )}
                      {product.discount_price && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{t[lang].sale}</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <Link to={\`/product/\${product.slug}\`} className="block flex-1">
                      <h3 className="font-semibold text-stone-800 text-xs md:text-sm mb-1 leading-snug truncate hover:text-green-700 transition-colors">{product.title}</h3>
                      <div className="flex items-center gap-2">
                        {product.discount_price ? (
                          <>
                            <span className="font-bold text-green-700 text-sm">{formatCurrency(product.discount_price)}</span>
                            <span className="text-xs text-stone-400 line-through">{formatCurrency(product.regular_price)}</span>
                          </>
                        ) : (
                          <span className="font-bold text-green-700 text-sm">{formatCurrency(product.regular_price)}</span>
                        )}
                      </div>
                    </Link>
                    <div className="mt-4 flex items-center gap-2">
                      <button 
                        disabled={addingToCart[product.id]}
                        onClick={(e) => handleAddToCart(e, product)}
                        className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-700 rounded-md py-2 text-xs font-bold transition-colors flex items-center justify-center"
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
                  </div>
                </div>
              ))}\`;

code = code.replace(oldCard, newCard);

fs.writeFileSync('src/pages/storefront/Home.tsx', code);
