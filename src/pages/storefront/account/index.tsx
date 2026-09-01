import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';
import { supabase } from '../../../lib/supabase';
import { User, Package, MapPin, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';


function ProfileView() {
  const { user, profile, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone
        })
        .eq('id', user?.id)
        .select()
        .single();
        
      if (error) throw error;
      
      setUser(user, data);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
      <h2 className="text-xl font-bold text-stone-800 mb-6">Profile Details</h2>
      
      {!isEditing ? (
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-1">Full Name</label>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800">{profile?.full_name || '-'}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-1">Email</label>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800">{user?.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-1">Phone</label>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800">{profile?.phone || 'Not provided'}</div>
          </div>
          <button 
            onClick={() => {
              setFormData({ full_name: profile?.full_name || '', phone: profile?.phone || '' });
              setIsEditing(true);
            }} 
            className="mt-4 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-1">Full Name</label>
            <input 
              type="text" 
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="w-full p-3 bg-white border border-stone-300 focus:border-green-500 focus:ring-green-500 rounded-lg text-stone-800" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-1">Email (Cannot be changed)</label>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-500 cursor-not-allowed">{user?.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-1">Phone</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-3 bg-white border border-stone-300 focus:border-green-500 focus:ring-green-500 rounded-lg text-stone-800" 
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              onClick={() => setIsEditing(false)} 
              disabled={isSaving}
              className="bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {useAuthStore().isAdmin && !isEditing && (
        <div className="mt-8 pt-6 border-t border-stone-200">
          <h3 className="text-lg font-bold text-stone-800 mb-4">Administration</h3>
          <Link to="/admin" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 shadow-sm transition-colors w-full sm:w-auto">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Go to Admin Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}


export default function AccountDashboard() {
  const { user, profile, logout, isAdmin } = useAuthStore();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
  };

  const navItems = [
    ...(isAdmin ? [{ name: 'Admin Panel', path: '/admin', icon: LayoutDashboard }] : []),
    { name: 'Profile', path: '/account', icon: User },
    { name: 'Orders', path: '/account/orders', icon: Package },
    { name: 'Addresses', path: '/account/addresses', icon: MapPin },
  ];

  return (
    <div className="bg-stone-50 min-h-[calc(100vh-200px)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="p-6 bg-stone-50 border-b border-stone-200">
                <p className="font-bold text-stone-800 truncate">{profile?.full_name || 'Customer'}</p>
                <p className="text-sm text-stone-500 truncate">{user?.email}</p>
              </div>
              <nav className="p-2 space-y-1">
                {navItems.map((item) => {
                  // For root account path, match exactly, otherwise check if starts with
                  const isActive = item.path === '/account' 
                    ? location.pathname === '/account' 
                    : location.pathname.startsWith(item.path);
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive ? 'bg-green-50 text-green-700' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left mt-4"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <Routes>
              <Route index element={<ProfileView />} />
              <Route path="orders" element={
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
                  <h2 className="text-xl font-bold text-stone-800 mb-6">Order History</h2>
                  <div className="text-center py-12 text-stone-500">
                    <Package className="h-12 w-12 mx-auto text-stone-300 mb-4" />
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/shop" className="mt-4 inline-block text-green-600 font-medium hover:underline">Start Shopping</Link>
                  </div>
                </div>
              } />
               <Route path="addresses" element={
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
                  <h2 className="text-xl font-bold text-stone-800 mb-6">Saved Addresses</h2>
                  <div className="text-center py-12 text-stone-500">
                    <MapPin className="h-12 w-12 mx-auto text-stone-300 mb-4" />
                    <p>You haven't saved any addresses yet.</p>
                    <button className="mt-4 inline-block text-green-600 font-medium hover:underline">Add New Address</button>
                  </div>
                </div>
              } />
            </Routes>
          </main>

        </div>
      </div>
    </div>
  );
}
