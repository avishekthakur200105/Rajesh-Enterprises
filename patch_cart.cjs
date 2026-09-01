const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Cart.tsx', 'utf8');

code = code.replace(
  /<Link to=\{\`\/product\/\$\{item\.productId\}\`\} className="w-full sm:w-24/g,
  '<Link to={`/products/${item.slug || item.productId}`} className="w-full sm:w-24'
);

code = code.replace(
  /<Link to=\{\`\/product\/\$\{item\.productId\}\`\} className="hover:text-green-700">\{item\.name\}<\/Link>/g,
  '<Link to={`/products/${item.slug || item.productId}`} className="hover:text-green-700">{item.name}</Link>'
);

fs.writeFileSync('src/pages/storefront/Cart.tsx', code);
