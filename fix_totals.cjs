const fs = require('fs');
let cartCode = fs.readFileSync('src/pages/storefront/Cart.tsx', 'utf8');
cartCode = cartCode.replace('const total = subtotal + deliveryCharge;', 'const total = subtotal - discount + deliveryCharge;');
fs.writeFileSync('src/pages/storefront/Cart.tsx', cartCode);

let checkoutCode = fs.readFileSync('src/pages/storefront/Checkout.tsx', 'utf8');
checkoutCode = checkoutCode.replace('const total = subtotal + deliveryCharge;', 'const total = subtotal - (getSummary().discount || 0) + deliveryCharge;');
fs.writeFileSync('src/pages/storefront/Checkout.tsx', checkoutCode);
