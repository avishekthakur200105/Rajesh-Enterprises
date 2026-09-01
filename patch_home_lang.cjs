const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

// Add translation dictionary outside component
const translations = `
const t = {
  en: {
    premier: "Nepal's Premier",
    agro: "Agro Pharmacy",
    heroDesc: "High-quality seeds, organic fertilizers, and reliable farming tools. Empowering Nepali farmers for a better harvest.",
    shopNow: "Shop Now",
    founder: "Founder & Owner",
    latestOffers: "Latest Offers",
    quality: "Quality Products",
    qualityDesc: "Certified seeds and genuine agro-chemicals.",
    delivery: "Nationwide Delivery",
    deliveryDesc: "Fast delivery to all major districts in Nepal.",
    expert: "Expert Guidance",
    expertDesc: "Free consultation for your farming needs.",
    featured: "Featured Products",
    featuredDesc: "Top picks for this season's farming.",
    viewAll: "View All",
    sale: "Sale"
  },
  np: {
    premier: "नेपालको प्रमुख",
    agro: "कृषि फार्मेसी",
    heroDesc: "उच्च गुणस्तरको बीउ, जैविक मल, र भरपर्दो कृषि उपकरणहरू। उत्कृष्ट उत्पादनको लागि नेपाली किसानहरूको सशक्तिकरण।",
    shopNow: "किनमेल गर्नुहोस्",
    founder: "संस्थापक र मालिक",
    latestOffers: "पछिल्लो अफरहरु",
    quality: "गुणस्तरीय उत्पादनहरू",
    qualityDesc: "प्रमाणित बीउ र सक्कली कृषि रसायन।",
    delivery: "देशव्यापी डेलिभरी",
    deliveryDesc: "नेपालका सबै प्रमुख जिल्लाहरूमा छिटो डेलिभरी।",
    expert: "विशेषज्ञ मार्गदर्शन",
    expertDesc: "तपाईंको कृषि आवश्यकताहरूको लागि नि: शुल्क परामर्श।",
    featured: "विशेष उत्पादनहरू",
    featuredDesc: "यस सिजनको कृषिको लागि उत्कृष्ट छनोटहरू।",
    viewAll: "सबै हेर्नुहोस्",
    sale: "छुट"
  }
};
`;

code = code.replace("export default function Home() {", translations + "\nexport default function Home() {");

// Add Language icon
code = code.replace("Sprout } from 'lucide-react';", "Sprout, Languages } from 'lucide-react';");

// Add language state
code = code.replace("const [loading, setLoading] = useState(true);", "const [loading, setLoading] = useState(true);\n  const [lang, setLang] = useState<'en' | 'np'>('en');");

// Add language toggle button in hero section
const toggleBtn = `
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={() => setLang(lang === 'en' ? 'np' : 'en')}
            className="flex items-center gap-2 bg-white border border-stone-200 shadow-sm hover:bg-stone-50 text-stone-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            <Languages className="h-4 w-4 text-green-600" />
            {lang === 'en' ? 'नेपाली' : 'English'}
          </button>
        </div>
        <div className="relative max-w-7xl`;

code = code.replace('<div className="relative max-w-7xl', toggleBtn);

// Replace hardcoded strings
code = code.replace("Nepal's Premier", "{t[lang].premier}");
code = code.replace("Agro Pharmacy", "{t[lang].agro}");
code = code.replace("High-quality seeds, organic fertilizers, and reliable farming tools. Empowering Nepali farmers for a better harvest.", "{t[lang].heroDesc}");
code = code.replace("Shop Now", "{t[lang].shopNow}");
code = code.replace("Founder & Owner", "{t[lang].founder}");
code = code.replace("Latest Offers", "{t[lang].latestOffers}");
code = code.replace("Quality Products", "{t[lang].quality}");
code = code.replace("Certified seeds and genuine agro-chemicals.", "{t[lang].qualityDesc}");
code = code.replace("Nationwide Delivery", "{t[lang].delivery}");
code = code.replace("Fast delivery to all major districts in Nepal.", "{t[lang].deliveryDesc}");
code = code.replace("Expert Guidance", "{t[lang].expert}");
code = code.replace("Free consultation for your farming needs.", "{t[lang].expertDesc}");
code = code.replace("Featured Products", "{t[lang].featured}");
code = code.replace("Top picks for this season's farming.", "{t[lang].featuredDesc}");
code = code.replace("View All", "{t[lang].viewAll}");
code = code.replace("Sale", "{t[lang].sale}");

fs.writeFileSync('src/pages/storefront/Home.tsx', code);
console.log("Replaced successfully!");
