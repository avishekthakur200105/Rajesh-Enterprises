const fs = require('fs');

let code = fs.readFileSync('src/pages/storefront/Shop.tsx', 'utf8');

const search = `        let query = supabase
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

        if (cats) setCategories(cats.filter((c: any) => !['_owner_profile_', '_farmer_tips_', '_store_settings_', '_contact_messages_'].includes(c.slug)));
        if (data) setProducts(data);`;

const replace = `        let query = supabase
          .from('products')
          .select('id, title, slug, regular_price, discount_price, category_id, image_url:product_images(url), category:categories(name, slug)')
          .eq('is_active', true);

        if (searchQuery) {
          query = query.ilike('title', \`%\${searchQuery}%\`);
        }

        const { data: cats } = await supabase.from('categories').select('*').eq('is_active', true);
        
        if (cats) {
          setCategories(cats.filter((c: any) => !['_owner_profile_', '_farmer_tips_', '_store_settings_', '_contact_messages_'].includes(c.slug)));
        }

        if (categoryParam && cats) {
          const targetCat = cats.find(c => c.slug === categoryParam);
          if (targetCat) {
            query = query.eq('category_id', targetCat.id);
          }
        }

        const { data } = await query;
        if (data) setProducts(data);`;

code = code.replace(search, replace);

fs.writeFileSync('src/pages/storefront/Shop.tsx', code);
console.log("Shop.tsx patched");
