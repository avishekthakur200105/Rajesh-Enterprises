import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { Filter, Leaf, ChevronDown } from 'lucide-react';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('q');
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (!import.meta.env.VITE_SUPABASE_URL) return;
        
                let query = supabase
          .from('products')
          .select('id, title, slug, regular_price, discount_price, image_url:product_images(url), category:categories(name, slug)')
          .eq('is_active', true);

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }
        if (categoryParam) {
          // Join on category handled in real app
        }

        const [ { data: cats }, { data } ] = await Promise.all([
          supabase.from('categories').select('*').eq('is_active', true),
          query
        ]);

        if (cats) setCategories(cats.filter((c: any) => !['_owner_profile_', '_farmer_tips_', '_store_settings_', '_contact_messages_'].includes(c.slug)));
        if (data) setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [categoryParam]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-stone-800 mb-4 pb-3 border-b border-stone-100">
              <Filter className="h-5 w-5" /> Filters
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-stone-800 mb-3 text-sm uppercase tracking-wider">Categories</h3>
              <div className="space-y-2">
                <Link to="/shop" className={`block text-sm ${!categoryParam ? 'text-green-700 font-medium' : 'text-stone-500 hover:text-stone-800'}`}>
                  All Products
                </Link>
                {categories.map(cat => (
                  <Link key={cat.id} to={`/shop?category=${cat.slug}`} className={`block text-sm ${categoryParam === cat.slug ? 'text-green-700 font-medium' : 'text-stone-500 hover:text-stone-800'}`}>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Additional filters like Price could go here */}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-stone-800 tracking-tight">
              {categoryParam ? `Category: ${categoryParam}` : 'All Products'}
            </h1>
            <div className="flex items-center text-sm text-stone-500">
              {searchQuery && <span className="mr-2">Results for "<span className="font-semibold">{searchQuery}</span>"</span>} Showing {products.length} results
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 h-80 animate-pulse flex flex-col">
                 <div className="bg-stone-200 h-48 rounded-lg mb-4 w-full"></div>
                 <div className="bg-stone-200 h-4 w-3/4 rounded mb-2"></div>
                 <div className="bg-stone-200 h-4 w-1/2 rounded"></div>
               </div>
             ))}
           </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {products.map((product) => (
                <Link key={product.id} to={`/products/${product.slug}`} className="group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:border-green-300 hover:shadow-md transition-all">
                  <div className="aspect-square bg-stone-50 relative overflow-hidden p-2">
                    {product.image_url?.[0]?.url ? (
                      <img src={product.image_url[0].url} alt={product.title} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <Leaf className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 border-t border-stone-100">
                    <p className="text-[10px] text-stone-500 mb-1 uppercase tracking-wider">{product.category?.name || 'Uncategorized'}</p>
                    <h3 className="font-medium text-stone-800 text-xs md:text-sm mb-1 line-clamp-2 leading-snug whitespace-normal">{product.title}</h3>
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
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-stone-200">
              <Leaf className="h-12 w-12 mx-auto text-stone-300 mb-4" />
              <h3 className="text-lg font-medium text-stone-900">No products found</h3>
              <p className="text-stone-500 mt-2">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
