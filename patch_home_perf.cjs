const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

const target = `        // Fetch products
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
        const { data: tipsData } = await supabase.from('categories').select('*').eq('slug', '_farmer_tips_').single();`;

const replacement = `        // Fetch everything concurrently to significantly reduce loading time on Vercel
        const [
          { data: prodData },
          { data: bannerData },
          { data: ownerData },
          { data: tipsData }
        ] = await Promise.all([
          supabase
            .from('products')
            .select('id, title, slug, regular_price, discount_price, image_url:product_images(url)')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(4),
          supabase
            .from('banners')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false }),
          supabase.from('categories').select('*').eq('slug', '_owner_profile_').single(),
          supabase.from('categories').select('*').eq('slug', '_farmer_tips_').single()
        ]);

        if (prodData) setFeaturedProducts(prodData);
        if (bannerData) setBanners(bannerData);
        if (ownerData) setOwnerProfile(ownerData);`;

code = code.replace(target, replacement);

fs.writeFileSync('src/pages/storefront/Home.tsx', code);
