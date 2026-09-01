import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard,
  Lightbulb, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Tags,
  Sprout,
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Basic protection
    if (!user || !isAdmin) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Banners', path: '/admin/banners', icon: ImageIcon },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Farmer Tips', path: '/admin/tips', icon: Lightbulb },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  if (!isAdmin) return null; // Or a loading spinner

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      {/* Sidebar */}
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800 text-white">
          <Link to="/" className="flex items-center hover:text-green-400 transition-colors">
            <Sprout className="h-6 w-6 text-green-500 mr-2" />
            <span className="font-bold tracking-wide">RE Admin</span>
          </Link>
        </div>
        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-600 text-white' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-400 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="mr-4 md:hidden text-stone-500 hover:text-stone-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-stone-800">
            {navItems.find(i => i.path === location.pathname)?.name || 'Admin Panel'}
          </h1>
          </div>
          <div className="flex items-center">
             <span className="text-sm font-medium text-stone-600">Admin</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-stone-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
