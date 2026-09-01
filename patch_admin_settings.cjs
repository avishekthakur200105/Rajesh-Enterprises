const fs = require('fs');

const code = `import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ownerData, setOwnerData] = useState({
    name: 'Rajesh Sharma',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    description: 'Welcome to our store! We provide the best quality products for our local farmers.'
  });
  
  useEffect(() => {
    async function fetchOwner() {
      try {
        if (!import.meta.env.VITE_SUPABASE_URL) return;
        const { data } = await supabase.from('categories').select('*').eq('slug', '_owner_profile_').single();
        if (data) {
          setOwnerData({
            name: data.name || '',
            image_url: data.image_url || '',
            description: data.description || ''
          });
        }
      } catch(e) {
        // Might not exist yet
      } finally {
        setLoading(false);
      }
    }
    fetchOwner();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Check if exists
      const { data } = await supabase.from('categories').select('id').eq('slug', '_owner_profile_').single();
      
      const payload = {
        name: ownerData.name,
        slug: '_owner_profile_',
        image_url: ownerData.image_url,
        description: ownerData.description,
        is_active: false // So it doesn't show up in normal category lists
      };
      
      if (data && data.id) {
        await supabase.from('categories').update(payload).eq('id', data.id);
      } else {
        await supabase.from('categories').insert([payload]);
      }
      
      alert("Settings saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save. Make sure your database is connected.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Store Settings</h2>
        <button 
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-200">
          <h3 className="text-lg font-medium text-stone-900 mb-4">Owner Profile (Home Page)</h3>
          <p className="text-sm text-stone-500 mb-6">This information will be displayed at the top of the home page.</p>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Owner Name</label>
              <input 
                type="text" 
                value={ownerData.name} 
                onChange={(e) => setOwnerData({...ownerData, name: e.target.value})}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Photo Image URL</label>
              <input 
                type="text" 
                value={ownerData.image_url} 
                onChange={(e) => setOwnerData({...ownerData, image_url: e.target.value})}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
              {ownerData.image_url && (
                <div className="mt-2 flex items-center space-x-4">
                  <img src={ownerData.image_url} alt="Preview" className="h-16 w-16 rounded-full object-cover border border-stone-200" />
                  <span className="text-xs text-stone-500">Preview</span>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Short Description</label>
              <textarea 
                rows={3} 
                value={ownerData.description}
                onChange={(e) => setOwnerData({...ownerData, description: e.target.value})}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

fs.writeFileSync('src/pages/admin/settings/index.tsx', code);
