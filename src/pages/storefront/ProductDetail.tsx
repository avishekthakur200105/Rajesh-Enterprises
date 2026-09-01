import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { useCartStore } from '../../store/cart';
import { useAuthStore } from '../../store/auth';
import { Leaf, Minus, Plus, ShoppingCart, CheckCircle2, Star } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const { isAdmin } = useAuthStore();
  
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Load reviews from local storage or mock data
  useEffect(() => {
    if (product) {
      const storedReviews = localStorage.getItem(`reviews_${product.id}`);
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      } else {
        // Mock default review
        setReviews([
          {
            id: 1,
            name: "Ram Bahadur",
            rating: 5,
            comment: "Very good product. Helped my crops grow better this season.",
            date: new Date().toLocaleDateString()
          }
        ]);
      }
    }
  }, [product]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    
    setIsSubmittingReview(true);
    
    const review = {
      id: Date.now(),
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString()
    };
    
    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${product?.id}`, JSON.stringify(updatedReviews));
    
    setNewReview({ rating: 5, comment: '', name: '' });
    setIsSubmittingReview(false);
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!import.meta.env.VITE_SUPABASE_URL) return;
        let { data: prod } = await supabase
          .from('products')
          .select('*, image_url:product_images(url), category:categories(name)')
          .eq('slug', slug)
          .single();
          
        if (!prod && slug && slug.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
          // Fallback if the slug is actually an ID (from old cart items)
          const { data: prodById } = await supabase
            .from('products')
            .select('*, image_url:product_images(url), category:categories(name)')
            .eq('id', slug)
            .single();
          prod = prodById;
        }

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
      slug: product.slug,
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

  const handleBuyNow = () => {
    if (!product) return;
    
    const price = selectedVariant 
      ? (product.discount_price || product.regular_price) + Number(selectedVariant.price_adjustment)
      : (product.discount_price || product.regular_price);
      
    const maxStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;

    addItem({
      id: selectedVariant ? selectedVariant.id : product.id,
      productId: product.id,
      slug: product.slug,
      name: product.title,
      variantName: selectedVariant?.name,
      price: Number(price),
      quantity: quantity,
      image: product.image_url?.[0]?.url,
      maxStock: maxStock || 0
    });
    
    navigate('/checkout');
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
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          {/* Images */}
          <div className="w-full md:w-1/2 lg:w-5/12">
            <div className="aspect-square max-w-lg mx-auto md:mx-0 bg-stone-50 rounded-2xl border border-stone-100 overflow-hidden p-4 md:p-8 flex items-center justify-center relative">
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
          <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col">
            <div className="mb-2 text-sm text-stone-500 uppercase tracking-wider font-semibold">
              {product.category?.name || 'Uncategorized'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-2">
              {product.title}
            </h1>
            {product.title_np && (
              <h2 className="text-lg text-stone-600 mb-4 font-medium">{product.title_np}</h2>
            )}

            <div className="flex items-center gap-4 mb-5">
              <span className="text-2xl font-extrabold text-green-700">{formatCurrency(currentPrice)}</span>
              {product.discount_price && !selectedVariant && (
                 <span className="text-base text-stone-400 line-through">{formatCurrency(product.regular_price)}</span>
              )}
            </div>

            <p className="text-stone-600 mb-6 leading-relaxed text-sm sm:text-base">
              {product.short_description || product.description || 'No description available for this product.'}
            </p>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-stone-900 mb-2">Available Options</h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => { setSelectedVariant(variant); setQuantity(1); }}
                      className={`px-3 py-1.5 border rounded-md font-medium text-sm transition-colors ${
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
            {!isAdmin ? (
              <div className="bg-orange-50 p-4 sm:p-5 rounded-xl border border-orange-100 mb-6 max-w-lg">
                <p className="text-orange-800 text-sm font-medium">Purchasing is currently restricted to administrators only.</p>
              </div>
            ) : (
            <div className="bg-stone-50 p-4 sm:p-5 rounded-xl border border-stone-100 mb-6 max-w-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-stone-700 text-sm">Quantity</span>
                {isOutOfStock ? (
                  <span className="text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded text-xs">Out of Stock</span>
                ) : (
                  <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded text-xs flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> In Stock ({currentMaxStock})
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden w-28 h-11 shrink-0">
                  <button 
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity(q => q - 1)}
                    className="w-8 h-full flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-50"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex-1 text-center font-semibold text-stone-800 text-sm">{quantity}</div>
                  <button 
                    disabled={quantity >= currentMaxStock || isOutOfStock}
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-full flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                <div className="flex flex-1 gap-3 min-w-[200px]">
                  <button 
                    disabled={isOutOfStock || addingToCart}
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-50 text-green-700 border border-green-700 hover:bg-green-100 disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-300 disabled:cursor-not-allowed h-11 rounded-lg font-bold flex items-center justify-center transition-colors whitespace-nowrap px-3 text-sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1.5 shrink-0" />
                    <span className="truncate">{addingToCart ? 'Added' : 'Add to Cart'}</span>
                  </button>
                  <button 
                    disabled={isOutOfStock}
                    onClick={handleBuyNow}
                    className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white h-11 rounded-lg font-bold flex items-center justify-center transition-colors whitespace-nowrap px-3 text-sm"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
            )}

          </div>
        </div>
        
        {/* Long Description & Reviews */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="border-b border-stone-200">
            <h2 className="text-xl font-bold text-stone-800 px-6 py-4">Customer Reviews & Ratings</h2>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-stone-800 flex items-center justify-between">
                Reviews ({reviews.length})
                <div className="flex items-center text-sm font-normal text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-bold text-stone-800 mr-1">
                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                  </span>
                  out of 5
                </div>
              </h3>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                  <p className="text-stone-500 italic text-center py-8">No reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-stone-800">{review.name}</span>
                        <span className="text-xs text-stone-500">{review.date}</span>
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-stone-600 text-sm whitespace-pre-line">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
