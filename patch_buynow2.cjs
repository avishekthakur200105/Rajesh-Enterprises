const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductDetail.tsx', 'utf8');

const targetFunction = `  const handleAddToCart = () => {
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
  };`;

const newFunctions = targetFunction + `

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

code = code.replace(targetFunction, newFunctions);

fs.writeFileSync('src/pages/storefront/ProductDetail.tsx', code);
