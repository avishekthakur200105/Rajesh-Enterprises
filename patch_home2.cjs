const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

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
        if (ownerData) setOwnerProfile(ownerData);
`;

code = code.replace(/\/\/ Fetch products[\s\S]*?\/\/ Fetch farmer tips\s*const { data: tipsData }[^;]+;/m, replacement);

fs.writeFileSync('src/pages/storefront/Home.tsx', code);
