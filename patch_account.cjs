const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/account/index.tsx', 'utf8');

const profileViewLogic = `
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
`;

code = code.replace(
  "import { User, Package, MapPin, LogOut, LayoutDashboard } from 'lucide-react';",
  "import { User, Package, MapPin, LogOut, LayoutDashboard } from 'lucide-react';\nimport { useState } from 'react';\n\n" + profileViewLogic
);

const indexRouteRegex = /<Route index element=\{[\s\S]*?(?=<Route path="orders")/m;

code = code.replace(
  indexRouteRegex,
  `<Route index element={<ProfileView />} />\n              `
);

fs.writeFileSync('src/pages/storefront/account/index.tsx', code);
console.log('Patched account index');
