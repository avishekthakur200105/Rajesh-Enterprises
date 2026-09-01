import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/auth';

// Layouts
import StorefrontLayout from './layouts/StorefrontLayout';
import AdminLayout from './layouts/AdminLayout';

// Storefront Pages
import Home from './pages/storefront/Home';
import Shop from './pages/storefront/Shop';
import ProductDetail from './pages/storefront/ProductDetail';
import Cart from './pages/storefront/Cart';
import Checkout from './pages/storefront/Checkout';
import Login from './pages/storefront/Login';
import Register from './pages/storefront/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';

import AdminCategories from './pages/admin/categories/index';
import AdminCustomers from './pages/admin/customers/index';
import AdminReviews from './pages/admin/reviews/index';
import AdminSettings from './pages/admin/settings/index';
import AdminBanners from './pages/admin/banners/index';
import AdminTips from './pages/admin/tips/index';
import AdminMessages from './pages/admin/messages/index';

import About from './pages/storefront/About';
import Contact from './pages/storefront/Contact';
import FAQ from './pages/storefront/FAQ';
import Blog from './pages/storefront/Blog';
import Terms from './pages/storefront/Terms';
import Privacy from './pages/storefront/Privacy';
import ShippingPolicy from './pages/storefront/ShippingPolicy';
import ReturnPolicy from './pages/storefront/ReturnPolicy';
import AccountDashboard from './pages/storefront/account/index';

function App() {
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (user: any) => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
         setLoading(false);
         return;
      }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setUser(user, data);
    } catch (e) {
      console.error(e);
      setUser(user, null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Storefront Routes */}
        <Route path="/" element={<StorefrontLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="products/:slug" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="account/*" element={
            <ProtectedRoute>
              <AccountDashboard />
            </ProtectedRoute>
          } />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="blog" element={<Blog />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="shipping-policy" element={<ShippingPolicy />} />
          <Route path="return-policy" element={<ReturnPolicy />} />
          {/* Fallback */}
          <Route path="*" element={<div className="max-w-7xl mx-auto px-4 py-24 text-center">Page Not Found</div>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="tips" element={<AdminTips />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Routes>
    </Router>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default App;
