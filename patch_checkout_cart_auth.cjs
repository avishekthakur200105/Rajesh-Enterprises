const fs = require('fs');

let cartCode = fs.readFileSync('src/pages/storefront/Cart.tsx', 'utf8');
const cartSearch = `  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Restricted Access</h2>
        <p className="text-stone-600 mb-8">Purchasing is currently restricted to administrators only.</p>
        <Link to="/shop" className="bg-green-700 text-white px-6 py-3 rounded-md font-medium hover:bg-green-800 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }`;
cartCode = cartCode.replace(cartSearch, '');
fs.writeFileSync('src/pages/storefront/Cart.tsx', cartCode);

let checkoutCode = fs.readFileSync('src/pages/storefront/Checkout.tsx', 'utf8');
const checkoutSearch = `  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Restricted Access</h2>
        <p className="text-stone-600 mb-8">Purchasing is currently restricted to administrators only.</p>
        <button onClick={() => navigate('/shop')} className="bg-green-700 text-white px-6 py-3 rounded-md font-medium hover:bg-green-800 transition-colors">
          Return to Shop
        </button>
      </div>
    );
  }`;
checkoutCode = checkoutCode.replace(checkoutSearch, '');
fs.writeFileSync('src/pages/storefront/Checkout.tsx', checkoutCode);

