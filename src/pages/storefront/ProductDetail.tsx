import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { useCartStore } from '../../store/cart';
import { Leaf, Minus, Plus, ShoppingCart, CheckCircle2 } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!import.meta.env.VITE_SUPABASE_URL) return;
        const { data: prod } = await supabase
          .from('products')
          .select('*, image_url:product_images(url), category:categories(name)')
          .eq('slug', slug)
          .single();

        if (prod) {
          setProduct(prod);
          // Fetch variants
          const { data: vars } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', prod.id)
            .eq('is_active', true);
          
          if (vars && vars.length > 0) {
            setVariants(vars);
            setSelectedVariant(vars[0]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    setAddingToCart(true);
    
    const price = selectedVariant 
      ? (product.discount_price || product.regular_price) + Number(selectedVariant.price_adjustment)
      : (product.discount_price || product.regular_price);
      
    const maxStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;

    addItem({
      id: selectedVariant ? selectedVariant.id : product.id,
      productId: product.id,
      name: product.title,
      variantName: selectedVariant?.name,
      price: Number(price),
      quantity: quantity,
      image: product.image_url?.[0]?.url,
      maxStock: maxStock || 0
    });

    setTimeout(() => {
      setAddingToCart(false);
      // Optional: show a toast here
    }, 500);
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-pulse h-96 bg-stone-100 rounded-xl"></div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-stone-800">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="mt-4 text-green-600 hover:underline">Return to Shop</button>
      </div>
    );
  }

  const currentPrice = selectedVariant 
    ? (product.discount_price || product.regular_price) + Number(selectedVariant.price_adjustment)
    : (product.discount_price || product.regular_price);
    
  const currentMaxStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
  const isOutOfStock = currentMaxStock <= 0;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Images */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-stone-50 rounded-2xl border border-stone-100 overflow-hidden p-4 flex items-center justify-center relative">
              {product.image_url?.[0]?.url ? (
                <img src={product.image_url[0].url} alt={product.title} className="object-contain w-full h-full mix-blend-multiply" />
              ) : (
                <Leaf className="h-24 w-24 text-stone-200" />
              )}
              {product.discount_price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded shadow-sm">
                  SALE
                </div>
              )}
            </div>
            {/* Gallery thumbnails could go here */}
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2 text-sm text-stone-500 uppercase tracking-wider font-semibold">
              {product.category?.name || 'Uncategorized'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-2">
              {product.title}
            </h1>
            {product.title_np && (
              <h2 className="text-xl text-stone-600 mb-4 font-medium">{product.title_np}</h2>
            )}

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-extrabold text-green-700">{formatCurrency(currentPrice)}</span>
              {product.discount_price && !selectedVariant && (
                 <span className="text-lg text-stone-400 line-through">{formatCurrency(product.regular_price)}</span>
              )}
            </div>

            <p className="text-stone-600 mb-8 leading-relaxed">
              {product.short_description || product.description || 'No description available for this product.'}
            </p>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-stone-900 mb-3">Available Options</h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => { setSelectedVariant(variant); setQuantity(1); }}
                      className={`px-4 py-2 border rounded-md font-medium text-sm transition-colors ${
                        selectedVariant?.id === variant.id 
                          ? 'border-green-600 bg-green-50 text-green-800' 
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-stone-700">Quantity</span>
                {isOutOfStock ? (
                  <span className="text-red-500 font-medium bg-red-50 px-2 py-1 rounded text-sm">Out of Stock</span>
                ) : (
                  <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded text-sm flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> In Stock ({currentMaxStock})
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden w-32 h-12">
                  <button 
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity(q => q - 1)}
                    className="w-10 h-full flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex-1 text-center font-semibold text-stone-800">{quantity}</div>
                  <button 
                    disabled={quantity >= currentMaxStock || isOutOfStock}
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-full flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <button 
                  disabled={isOutOfStock || addingToCart}
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white h-12 rounded-lg font-bold flex items-center justify-center transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {addingToCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="space-y-3 text-sm text-stone-600 border-t border-stone-200 pt-6">
              <div className="flex">
                <span className="w-24 font-semibold">SKU:</span>
                <span>{selectedVariant?.sku || product.sku || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-semibold">Unit:</span>
                <span>{product.unit || 'N/A'}</span>
              </div>
            </div>

          </div>
        </div>
        
        {/* Long Description & Specs tabs could go here */}
      </div>
    </div>
  );
}
