const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

const correctEn = `  en: {
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
  },`;

code = code.replace(/en: \{[\s\S]*?\},/m, correctEn);

fs.writeFileSync('src/pages/storefront/Home.tsx', code);
console.log("Dictionary fixed!");
