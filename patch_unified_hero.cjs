const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

const regex = /\{\/\* Owner Profile Section \*\/\}[\s\S]*?\{\/\* Hero Section \*\/\}[\s\S]*?<\/section>/;

const unifiedSection = `{/* Unified Hero & Owner Profile Section */}
      <section className="relative bg-stone-50 text-stone-900 border-b border-stone-200 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className={\`flex flex-col \${ownerProfile && ownerProfile.name ? 'md:flex-row md:items-center md:justify-between gap-12' : 'items-center text-center'}\`}>
            
            {/* Hero Text */}
            <div className={\`flex flex-col \${ownerProfile && ownerProfile.name ? 'md:w-1/2 items-center md:items-start text-center md:text-left' : 'items-center text-center'}\`}>
              <Sprout className="h-12 w-12 text-green-600 mb-6" />
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Nepal's Premier <span className="text-green-700">Agro Pharmacy</span>
              </h1>
              <p className={\`text-base md:text-lg text-stone-600 max-w-2xl mb-8 \${ownerProfile && ownerProfile.name ? '' : 'mx-auto'}\`}>
                High-quality seeds, organic fertilizers, and reliable farming tools. Empowering Nepali farmers for a better harvest.
              </p>
              <div className="flex gap-4">
                <Link to="/shop" className="bg-green-700 hover:bg-green-800 text-white shadow-md font-bold py-3 px-8 rounded-full transition-colors text-base">
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Owner Profile Card */}
            {ownerProfile && ownerProfile.name && (
              <div className="w-full md:w-5/12 lg:w-1/3 mt-8 md:mt-0">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-green-50 to-white"></div>
                  {ownerProfile.image_url ? (
                    <img 
                      src={ownerProfile.image_url} 
                      alt={ownerProfile.name} 
                      className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-sm mb-5 relative z-10"
                    />
                  ) : (
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-green-100 flex items-center justify-center border-4 border-white shadow-sm mb-5 relative z-10">
                      <span className="text-4xl text-green-800 font-bold">{ownerProfile.name.charAt(0)}</span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-stone-900 mb-1 relative z-10">{ownerProfile.name}</h3>
                  <div className="w-full pt-5 mt-3 border-t border-stone-100 relative z-10">
                    <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3">Founder & Owner</p>
                    <p className="text-sm text-stone-600 leading-relaxed italic">
                      "{ownerProfile.description}"
                    </p>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </section>`;

if (regex.test(code)) {
  code = code.replace(regex, unifiedSection);
  fs.writeFileSync('src/pages/storefront/Home.tsx', code);
  console.log("Successfully replaced and unified!");
} else {
  console.log("Regex did not match.");
}
