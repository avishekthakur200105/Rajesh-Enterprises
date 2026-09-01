const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

// Update Dictionary EN
code = code.replace(
  'premier: "Nepal\'s Premier",\n    agro: "Agro Pharmacy",\n    heroDesc: "High-quality seeds, organic fertilizers, and reliable farming tools. Empowering Nepali farmers for a better harvest.",',
  'trustedSince: "TRUSTED SINCE 1998",\n    heroTitle: "Rajesh Enterprises",\n    heroDesc: "Your Trusted Partner in Agriculture & Crop Protection",\n    contactUs: "Contact Us",\n    productsStat: "Products",\n    yearsStat: "Years",\n    farmersStat: "Farmers",\n    premier: "Nepal\'s Premier",\n    agro: "Agro Pharmacy",'
);
code = code.replace(
  'shopNow: "Shop Now",',
  'shopNow: "View Products",'
);

// Update Dictionary NP
code = code.replace(
  'premier: "नेपालको प्रमुख",\n    agro: "कृषि फार्मेसी",\n    heroDesc: "उच्च गुणस्तरको बीउ, जैविक मल, र भरपर्दो कृषि उपकरणहरू। उत्कृष्ट उत्पादनको लागि नेपाली किसानहरूको सशक्तिकरण।",',
  'trustedSince: "१९९८ देखि भरपर्दो",\n    heroTitle: "राजेश इन्टरप्राइजेज",\n    heroDesc: "कृषि र बाली संरक्षणमा तपाईंको भरपर्दो साझेदार",\n    contactUs: "सम्पर्क गर्नुहोस्",\n    productsStat: "उत्पादनहरू",\n    yearsStat: "वर्ष",\n    farmersStat: "किसानहरू",\n    premier: "नेपालको प्रमुख",\n    agro: "कृषि फार्मेसी",'
);
code = code.replace(
  'shopNow: "किनमेल गर्नुहोस्",',
  'shopNow: "उत्पादनहरू हेर्नुहोस्",'
);

// Update Hero Section Component
const newHeroText = `
            {/* Hero Text */}
            <div className={\`flex flex-col \${ownerProfile && ownerProfile.name ? 'md:w-1/2 items-center md:items-start text-center md:text-left' : 'items-center text-center'}\`}>
              <div className="flex items-center gap-2 text-green-300 font-bold tracking-widest text-sm mb-4 uppercase">
                <Leaf className="w-5 h-5" /> {t[lang].trustedSince}
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                {t[lang].heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-green-50 mb-8 max-w-2xl">
                {t[lang].heroDesc}
              </p>
              
              <div className="flex gap-4 mb-10 w-full justify-center md:justify-start">
                <Link to="/shop" className="bg-white text-green-900 font-bold py-3 px-6 rounded-md hover:bg-stone-100 transition-colors shadow-sm">{t[lang].shopNow}</Link>
                <Link to="/contact" className="bg-transparent border border-white text-white font-bold py-3 px-6 rounded-md hover:bg-white hover:text-green-900 transition-colors">{t[lang].contactUs || "Contact Us"}</Link>
              </div>

              <div className="flex gap-8 text-white">
                <div>
                  <div className="text-2xl font-extrabold mb-1">12+</div>
                  <div className="text-green-300 text-sm font-medium">{t[lang].productsStat}</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold mb-1">25+</div>
                  <div className="text-green-300 text-sm font-medium">{t[lang].yearsStat}</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold mb-1">1000+</div>
                  <div className="text-green-300 text-sm font-medium">{t[lang].farmersStat}</div>
                </div>
              </div>
            </div>
`;

code = code.replace(
  /\{\/\* Hero Text \*\/\}.*?<\/div>.*?(?=\{\/\* Owner Profile Card \*\/)/s,
  newHeroText
);

// We need to change the section background to match the dark green in the image. 
// It looks like #234E29 or similar. We can use bg-[#234E29] or bg-green-900.
code = code.replace(
  '<section className="relative bg-stone-50 text-stone-900 border-b border-stone-200 overflow-hidden">',
  '<section className="relative bg-[#234E29] text-white overflow-hidden">'
);

fs.writeFileSync('src/pages/storefront/Home.tsx', code);
console.log("Updated Hero Section!");
