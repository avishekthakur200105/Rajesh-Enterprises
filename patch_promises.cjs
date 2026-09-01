const fs = require('fs');

// Patch Home.tsx
let home = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');
home = home.replace(
  `// Fetch products
        const { data: prodData } = await supabase
          .from('products')
          .select('id, title, slug, regular_price, discount_price, image_url:product_images(url)')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(4);
                
        if (prodData) setFeaturedProducts(prodData);

        // Fetch banners
        const { data: bannerData, error: bannerError } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        if (bannerData) setBanners(bannerData);
        
        // Fetch owner profile
        const { data: ownerData } = await supabase.from('categories').select('*').eq('slug', '_owner_profile_').single();
        if (ownerData) setOwnerProfile(ownerData);

        // Fetch farmer tips
        const { data: tipsData } = await supabase.from('categories').select('*').eq('slug', '_farmer_tips_').single();
        if (tipsData && tipsData.description) {
          try {
            const parsed = JSON.parse(tipsData.description);
            if (Array.isArray(parsed)) setFarmerTips(parsed);
          } catch(e) {}
        }`,
  `// Fetch everything concurrently using Promise.all for speed
        const [
          { data: prodData },
          { data: bannerData },
          { data: ownerData },
          { data: tipsData }
        ] = await Promise.all([
          supabase.from('products').select('id, title, slug, regular_price, discount_price, image_url:product_images(url)').eq('is_active', true).order('created_at', { ascending: false }).limit(4),
          supabase.from('banners').select('*').eq('is_active', true).order('created_at', { ascending: false }),
          supabase.from('categories').select('*').eq('slug', '_owner_profile_').maybeSingle(),
          supabase.from('categories').select('*').eq('slug', '_farmer_tips_').maybeSingle()
        ]);
        
        if (prodData) setFeaturedProducts(prodData);
        if (bannerData) setBanners(bannerData);
        if (ownerData) setOwnerProfile(ownerData);
        if (tipsData && tipsData.description) {
          try {
            const parsed = JSON.parse(tipsData.description);
            if (Array.isArray(parsed)) setFarmerTips(parsed);
          } catch(e) {}
        }`
);
fs.writeFileSync('src/pages/storefront/Home.tsx', home);

// Patch Shop.tsx
let shop = fs.readFileSync('src/pages/storefront/Shop.tsx', 'utf8');
shop = shop.replace(
  `// Fetch categories
        const { data: cats } = await supabase.from('categories').select('*').eq('is_active', true);
        if (cats) setCategories(cats);

        // Fetch products
        let query = supabase
          .from('products')
          .select('id, title, slug, regular_price, discount_price, image_url:product_images(url), category:categories(name, slug)')
          .eq('is_active', true);

        if (searchQuery) {
          query = query.ilike('title', \`%\${searchQuery}%\`);
        }
        if (categoryParam) {
          // Note: In a real app, we'd join on category slug properly.
          // For simplicity here, we assume category fetching is handled.
          // query = query.eq('category.slug', categoryParam); // This needs proper PostgREST syntax
        }
        const { data } = await query;
        if (data) setProducts(data);`,
  `// Fetch categories and products concurrently for speed
        let query = supabase
          .from('products')
          .select('id, title, slug, regular_price, discount_price, image_url:product_images(url), category:categories(name, slug)')
          .eq('is_active', true);

        if (searchQuery) {
          query = query.ilike('title', \`%\${searchQuery}%\`);
        }

        const [ { data: cats }, { data: productsData } ] = await Promise.all([
          supabase.from('categories').select('*').eq('is_active', true),
          query
        ]);

        if (cats) setCategories(cats);
        if (productsData) setProducts(productsData);`
);
fs.writeFileSync('src/pages/storefront/Shop.tsx', shop);
