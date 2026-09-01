const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Shop.tsx', 'utf8');

const replacement = `        let query = supabase
          .from('products')
          .select('id, title, slug, regular_price, discount_price, image_url:product_images(url), category:categories(name, slug)')
          .eq('is_active', true);

        if (searchQuery) {
          query = query.ilike('title', \`%\${searchQuery}%\`);
        }
        if (categoryParam) {
          // Join on category handled in real app
        }

        const [ { data: cats }, { data } ] = await Promise.all([
          supabase.from('categories').select('*').eq('is_active', true),
          query
        ]);

        if (cats) setCategories(cats);
        if (data) setProducts(data);`;

code = code.replace(/\/\/ Fetch categories[\s\S]*?if \(data\) setProducts\(data\);/m, replacement);

fs.writeFileSync('src/pages/storefront/Shop.tsx', code);
