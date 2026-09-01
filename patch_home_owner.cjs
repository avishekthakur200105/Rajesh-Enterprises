const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

if (!code.includes('ownerProfile')) {
  // Add state
  code = code.replace(
    "const [banners, setBanners] = useState<any[]>([]);",
    "const [banners, setBanners] = useState<any[]>([]);\n  const [ownerProfile, setOwnerProfile] = useState<any>(null);"
  );

  // Add fetch logic
  code = code.replace(
    "if (bannerData) setBanners(bannerData);",
    `if (bannerData) setBanners(bannerData);
        
        // Fetch owner profile
        const { data: ownerData } = await supabase.from('categories').select('*').eq('slug', '_owner_profile_').single();
        if (ownerData) setOwnerProfile(ownerData);`
  );

  // Add JSX right after Hero section
  const ownerSection = `

      {/* Owner Profile Section */}
      {ownerProfile && ownerProfile.name && (
        <section className="bg-white py-12 border-b border-stone-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-col items-center">
              {ownerProfile.image_url ? (
                <img 
                  src={ownerProfile.image_url} 
                  alt={ownerProfile.name} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-green-100 shadow-md mb-6"
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-green-100 flex items-center justify-center border-4 border-white shadow-md mb-6">
                  <span className="text-4xl text-green-800 font-bold">{ownerProfile.name.charAt(0)}</span>
                </div>
              )}
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">{ownerProfile.name}</h2>
              <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-2xl">
                {ownerProfile.description}
              </p>
            </div>
          </div>
        </section>
      )}`;

  code = code.replace(
    "</section>\n\n      {/* Moving Banners Section */}",
    "</section>" + ownerSection + "\n\n      {/* Moving Banners Section */}"
  );

  fs.writeFileSync('src/pages/storefront/Home.tsx', code);
}
