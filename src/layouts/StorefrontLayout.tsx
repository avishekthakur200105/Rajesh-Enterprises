import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, Sprout, X } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import { useSettingsStore } from '../store/settings';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StorefrontLayout() {
  const cartItems = useCartStore((state) => state.items);
  const { user, isAdmin } = useAuthStore();
  const { settings, fetchSettings } = useSettingsStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans">
      {/* Top bar */}
      <div className="bg-green-800 text-green-50 text-xs py-2 px-4 text-center sm:text-sm">
        {settings.topBarText}
      </div>
      
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Sprout className="h-8 w-8 text-green-700" />
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none text-green-900 tracking-tight whitespace-nowrap">{settings.shopName.split(' ')[0] || 'Rajesh'}</span>
                <span className="text-xs font-semibold text-green-700 uppercase tracking-widest whitespace-nowrap">{settings.shopName.substring(settings.shopName.indexOf(' ') + 1) || 'Enterprises'}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-stone-600 hover:text-green-700 font-medium transition-colors">Home</Link>
              <Link to="/shop" className="text-stone-600 hover:text-green-700 font-medium transition-colors">Shop</Link>
            </nav>

            {/* Search, Auth, Cart */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-stone-600 hover:text-green-700">
                <Search className="h-5 w-5" />
              </button>
              
              <div className="relative group">
                <Link to={user ? "/account" : "/login"} className="text-stone-600 hover:text-green-700">
                  <User className="h-5 w-5" />
                </Link>
                {isAdmin && (
                  <div className="absolute right-0 w-32 mt-2 bg-white border border-stone-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/admin" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Admin Panel</Link>
                  </div>
                )}
              </div>

              <Link to="/cart" className="text-stone-600 hover:text-green-700 relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <button className="md:hidden text-stone-600 hover:text-green-700">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {isSearchOpen && (
            <div className="border-t border-stone-100 py-3 px-4 md:px-0 animate-in fade-in slide-in-from-top-2">
              <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto flex items-center">
                <Search className="absolute left-3 text-stone-400 h-5 w-5" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 text-stone-400 hover:text-stone-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-8 md:py-10 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <Sprout className="h-6 w-6 text-green-500" />
              <span className="font-bold text-lg">{settings.shopName}</span>
            </div>
            <p className="text-sm text-stone-400 mb-4">
              {settings.description}
            </p>
            <p className="text-sm">📞 {settings.phone}</p>
            <p className="text-sm">📧 {settings.email}</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Agro Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/return-policy" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-stone-800 text-sm text-center text-stone-500">
          &copy; {new Date().getFullYear()} {settings.shopName}. All rights reserved. Built with Nepal in mind.
        </div>
      </footer>
    </div>
  );
}
