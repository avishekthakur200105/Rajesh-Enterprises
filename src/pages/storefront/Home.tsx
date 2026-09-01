import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../store/settings';
import { useCartStore } from '../../store/cart';
import { useAuthStore } from '../../store/auth';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { ArrowRight, Leaf, ShieldCheck, Truck, Sprout, Languages, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';


const t = {
    en: {
    trustedSince: "TRUSTED SINCE 1998",
    heroTitle: "Rajesh Enterprises",
    heroDesc: "Your Trusted Partner in Agriculture & Crop Protection",
    contactUs: "Contact Us",
    productsStat: "Products",
    yearsStat: "Years",
    farmersStat: "Farmers",
    premier: "Nepal's Premier",
    agro: "Agro Pharmacy",
    shopNow: "View Products",
    founder: "Founder & Owner",
    latestOffers: "Latest Offers",
    farmerTipsTitle: "Farmer Tips",
    farmerTipsDesc: "Expert advice for your crops.",
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
    trustedSince: "१९९८ देखि भरपर्दो",
    heroTitle: "राजेश इन्टरप्राइजेज",
    heroDesc: "कृषि र बाली संरक्षणमा तपाईंको भरपर्दो साझेदार",
    contactUs: "सम्पर्क गर्नुहोस्",
    productsStat: "उत्पादनहरू",
    yearsStat: "वर्ष",
    farmersStat: "किसानहरू",
    premier: "नेपालको प्रमुख",
    agro: "कृषि फार्मेसी",
    shopNow: "उत्पादनहरू हेर्नुहोस्",
    founder: "संस्थापक र मालिक",
    latestOffers: "पछिल्लो अफरहरु",
    farmerTipsTitle: "किसान सुझावहरू",
    farmerTipsDesc: "तपाईंको बालीका लागि विशेषज्ञ सल्लाह।",
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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [farmerTips, setFarmerTips] = useState<any[]>([]);
  const [ownerProfile, setOwnerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'np'>('en');
  const { settings } = useSettingsStore();

  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    const price = product.discount_price || product.regular_price;
    
    addItem({
      id: product.id,
      productId: product.id,
      slug: product.slug,
      name: product.title,
      price: Number(price),
      quantity: 1,
      image: product.image_url?.[0]?.url,
      maxStock: product.stock_quantity || 99
    });
    
    setTimeout(() => {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }, 1000);
  };

  const handleBuyNow = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    const price = product.discount_price || product.regular_price;
    
    addItem({
      id: product.id,
      productId: product.id,
      slug: product.slug,
      name: product.title,
      price: Number(price),
      quantity: 1,
      image: product.image_url?.[0]?.url,
      maxStock: product.stock_quantity || 99
    });
    
    navigate('/checkout');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (!import.meta.env.VITE_SUPABASE_URL) return;
        
                // Fetch everything concurrently to significantly reduce loading time on Vercel
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

        if (tipsData && tipsData.description) {
          try {
            const parsed = JSON.parse(tipsData.description);
            if (Array.isArray(parsed)) setFarmerTips(parsed);
          } catch(e) {}
        }
  
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Unified Hero & Owner Profile Section */}
      <section className="relative bg-[#234E29] text-white overflow-hidden">
        
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={() => setLang(lang === 'en' ? 'np' : 'en')}
            className="flex items-center gap-2 bg-white border border-stone-200 shadow-sm hover:bg-stone-50 text-stone-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            <Languages className="h-4 w-4 text-green-600" />
            {lang === 'en' ? 'नेपाली' : 'English'}
          </button>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className={`flex flex-col ${ownerProfile && ownerProfile.name ? 'md:flex-row md:items-center md:justify-between gap-12' : 'items-center text-center'}`}>
            
            
            {/* Hero Text */}
            <div className={`flex flex-col ${ownerProfile && ownerProfile.name ? 'md:w-1/2 items-center md:items-start text-center md:text-left' : 'items-center text-center'}`}>
              <div className="flex items-center gap-2 text-green-300 font-bold tracking-widest text-sm mb-4 uppercase">
                <Leaf className="w-5 h-5" /> {t[lang].trustedSince}
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                {lang === 'np' ? t['np'].heroTitle : settings.shopName}
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
                    <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3">{t[lang].founder}</p>
                    <p className="text-sm text-stone-600 leading-relaxed italic">
                      "{ownerProfile.description}"
                    </p>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </section>

      

      {/* Moving Banners Section */}
      {banners.length > 0 && (
        <section className="bg-stone-50 py-6 border-b border-stone-200 overflow-hidden relative">
           <div className="max-w-7xl mx-auto mb-4 px-4 sm:px-6 lg:px-8">
             <h2 className="text-xl font-bold text-stone-900">{t[lang].latestOffers}</h2>
           </div>
           
           <div className="flex overflow-hidden relative w-full">
             <motion.div 
                className="flex whitespace-nowrap gap-6 px-4"
                animate={{ x: ["-100%", "0%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
              >
                {/* Double the array for seamless loop */}
                {[...banners, ...banners, ...banners].map((banner, i) => (
                  <Link 
                    key={`${banner.id}-${i}`} 
                    to={banner.link_url || '/shop'} 
                    className="relative block w-[300px] sm:w-[450px] h-[200px] flex-shrink-0 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                    </div>
                  </Link>
                ))}
             </motion.div>
           </div>
        </section>
      )}

      
      {/* Farmer Tips Section */}
      {farmerTips.length > 0 && (
        <section id="farmer-tips-section" className="py-10 md:py-16 bg-stone-100 border-b border-stone-200">
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
                    <h3 className="text-lg font-bold text-stone-900 mb-2">{lang === 'np' && tip.title_np ? tip.title_np : tip.title}</h3>
                    <p className="text-stone-600 text-sm flex-1">{lang === 'np' && tip.content_np ? tip.content_np : tip.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-8 md:py-12 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6">
              <div className="bg-green-100 p-3 rounded-full mb-3 text-green-700">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-stone-800 mb-1">{t[lang].quality}</h3>
              <p className="text-stone-600 text-sm">{t[lang].qualityDesc}</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="bg-green-100 p-4 rounded-full mb-4 text-green-700">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg text-stone-800 mb-2">{t[lang].delivery}</h3>
              <p className="text-stone-600 text-sm">{t[lang].deliveryDesc}</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="bg-green-100 p-4 rounded-full mb-4 text-green-700">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg text-stone-800 mb-2">{t[lang].expert}</h3>
              <p className="text-stone-600 text-sm">{t[lang].expertDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">{t[lang].featured}</h2>
              <p className="text-stone-500 mt-2">{t[lang].featuredDesc}</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center text-green-700 font-semibold hover:text-green-800">
              {t[lang].viewAll} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 h-80 animate-pulse flex flex-col">
                  <div className="bg-stone-200 h-48 rounded-lg mb-4 w-full"></div>
                  <div className="bg-stone-200 h-4 w-3/4 rounded mb-2"></div>
                  <div className="bg-stone-200 h-4 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  <Link to={`/products/${product.slug}`} className="block relative">
                    <div className="aspect-square bg-stone-50 relative overflow-hidden p-2">
                      {product.image_url?.[0]?.url ? (
                        <img src={product.image_url[0].url} alt={product.title} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <Leaf className="h-12 w-12" />
                        </div>
                      )}
                      {product.discount_price && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{t[lang].sale}</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <Link to={`/products/${product.slug}`} className="block flex-1">
                      <h3 className="font-semibold text-stone-800 text-xs md:text-sm mb-1 leading-snug truncate hover:text-green-700 transition-colors">{product.title}</h3>
                      <div className="flex items-center gap-2">
                        {product.discount_price ? (
                          <>
                            <span className="font-bold text-green-700 text-sm">{formatCurrency(product.discount_price)}</span>
                            <span className="text-xs text-stone-400 line-through">{formatCurrency(product.regular_price)}</span>
                          </>
                        ) : (
                          <span className="font-bold text-green-700 text-sm">{formatCurrency(product.regular_price)}</span>
                        )}
                      </div>
                    </Link>
                    <div className="mt-4 flex items-center gap-2">
                      <button 
                        disabled={addingToCart[product.id]}
                        onClick={(e) => handleAddToCart(e, product)}
                        className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-700 rounded-md py-2 text-xs font-bold transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {addingToCart[product.id] ? 'Added' : 'Cart'}
                      </button>
                      <button 
                        onClick={(e) => handleBuyNow(e, product)}
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-md py-2 text-xs font-bold transition-colors flex items-center justify-center"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-500">
              <p>Configure Supabase and add some products to see them here.</p>
            </div>
          )}
        </div>
      </section>

      
    </div>
  );
}
