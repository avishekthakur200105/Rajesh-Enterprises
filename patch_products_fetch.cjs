const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

code = code.replace(
  ".select('*, category:categories(name)')",
  ".select('*, category:categories(name), image_url:product_images(url)')"
);

code = code.replace(
  "image_url: product.image_url || '',",
  "image_url: product.image_url?.[0]?.url || '',"
);

code = code.replace(
  "{product.image_url ? (",
  "{product.image_url?.[0]?.url ? ("
);

code = code.replace(
  "<img src={product.image_url} alt=\"\" className=\"h-full w-full object-cover\" />",
  "<img src={product.image_url[0].url} alt=\"\" className=\"h-full w-full object-cover\" />"
);

fs.writeFileSync('src/pages/admin/Products.tsx', code);
