const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductDetail.tsx', 'utf8');

const handleAddCart = `  const handleAddToCart = () => {
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
    
    setTimeout(() => setAddingToCart(false), 1000);
  };`;

const newHandles = `  const handleAddToCart = () => {
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
    
    setTimeout(() => setAddingToCart(false), 1000);
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
      name: product.title,
      variantName: selectedVariant?.name,
      price: Number(price),
      quantity: quantity,
      image: product.image_url?.[0]?.url,
      maxStock: maxStock || 0
    });
    
    navigate('/checkout');
  };`;

const uiTarget = `                <button 
                  disabled={isOutOfStock || addingToCart}
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white h-12 rounded-lg font-bold flex items-center justify-center transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {addingToCart ? 'Added to Cart' : 'Add to Cart'}
                </button>`;

const uiReplacement = `                <button 
                  disabled={isOutOfStock || addingToCart}
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-50 text-green-700 border border-green-700 hover:bg-green-100 disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-300 disabled:cursor-not-allowed h-12 rounded-lg font-bold flex items-center justify-center transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {addingToCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
                <button 
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white h-12 rounded-lg font-bold flex items-center justify-center transition-colors"
                >
                  Buy Now
                </button>`;

code = code.replace(handleAddCart, newHandles);
code = code.replace(uiTarget, uiReplacement);

fs.writeFileSync('src/pages/storefront/ProductDetail.tsx', code);
