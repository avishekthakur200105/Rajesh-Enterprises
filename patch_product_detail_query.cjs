const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductDetail.tsx', 'utf8');

const search = `        const { data: prod } = await supabase
          .from('products')
          .select('*, image_url:product_images(url), category:categories(name)')
          .eq('slug', slug)
          .single();`;

const replace = `        let { data: prod } = await supabase
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
        }`;

code = code.replace(search, replace);
fs.writeFileSync('src/pages/storefront/ProductDetail.tsx', code);
