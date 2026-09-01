const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Shop.tsx', 'utf8');

if (!code.includes("searchParams.get('q')")) {
  code = code.replace(
    "const categoryParam = searchParams.get('category');",
    "const categoryParam = searchParams.get('category');\n  const searchQuery = searchParams.get('q');"
  );
  
  code = code.replace(
    "if (categoryParam) {",
    "if (searchQuery) {\n          query = query.ilike('title', `%${searchQuery}%`);\n        }\n        if (categoryParam) {"
  );
  
  code = code.replace(
    "Showing {products.length} results",
    "{searchQuery && <span className=\"mr-2\">Results for \"<span className=\"font-semibold\">{searchQuery}</span>\"</span>} Showing {products.length} results"
  );
  
  fs.writeFileSync('src/pages/storefront/Shop.tsx', code);
}
