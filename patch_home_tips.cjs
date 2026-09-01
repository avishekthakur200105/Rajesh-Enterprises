const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

// 1. Add translations
if (!code.includes('farmerTipsTitle:')) {
  code = code.replace(
    'latestOffers: "Latest Offers",',
    'latestOffers: "Latest Offers",\n    farmerTipsTitle: "Farmer Tips",\n    farmerTipsDesc: "Expert advice for your crops.",'
  );
  code = code.replace(
    'latestOffers: "पछिल्लो अफरहरु",',
    'latestOffers: "पछिल्लो अफरहरु",\n    farmerTipsTitle: "किसान सुझावहरू",\n    farmerTipsDesc: "तपाईंको बालीका लागि विशेषज्ञ सल्लाह।",'
  );
}

// 2. Add state
if (!code.includes('const [farmerTips, setFarmerTips]')) {
  code = code.replace(
    "const [banners, setBanners] = useState<any[]>([]);",
    "const [banners, setBanners] = useState<any[]>([]);\n  const [farmerTips, setFarmerTips] = useState<any[]>([]);"
  );
}

// 3. Fetch tips
if (!code.includes("eq('slug', '_farmer_tips_')")) {
  const fetchTipsCode = `
        // Fetch farmer tips
        const { data: tipsData } = await supabase.from('categories').select('*').eq('slug', '_farmer_tips_').single();
        if (tipsData && tipsData.description) {
          try {
            const parsed = JSON.parse(tipsData.description);
            if (Array.isArray(parsed)) setFarmerTips(parsed);
          } catch(e) {}
        }
  `;
  
  code = code.replace(
    "if (ownerData) setOwnerProfile(ownerData);",
    "if (ownerData) setOwnerProfile(ownerData);" + fetchTipsCode
  );
}

// 4. Render Tips Section (insert before "Features" section)
if (!code.includes('id="farmer-tips-section"')) {
  const tipsSection = `
      {/* Farmer Tips Section */}
      {farmerTips.length > 0 && (
        <section id="farmer-tips-section" className="py-16 bg-stone-100 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-stone-900">{t[lang].farmerTipsTitle}</h2>
              <p className="text-stone-500 mt-2">{t[lang].farmerTipsDesc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmerTips.map((tip, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
                  {tip.image_url ? (
                    <img src={tip.image_url} alt={tip.title} className="h-48 w-full object-cover" />
                  ) : (
                    <div className="h-48 w-full bg-green-50 flex items-center justify-center">
                      <Leaf className="h-12 w-12 text-green-300" />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-stone-900 mb-2">{tip.title}</h3>
                    <p className="text-stone-600 text-sm flex-1">{tip.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}`;
      
  code = code.replace("{/* Features */}", tipsSection);
}

fs.writeFileSync('src/pages/storefront/Home.tsx', code);
console.log("Home.tsx updated with Farmer Tips!");
