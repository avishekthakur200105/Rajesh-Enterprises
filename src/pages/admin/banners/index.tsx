import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Image as ImageIcon, Edit, Trash2, X } from 'lucide-react';

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) return;
      const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
      
      // If table doesn't exist yet, we'll just handle the error gracefully
      if (error && error.code !== '42P01') throw error; 
      
      setBanners(data || []);
    } catch (error) {
      console.error("Error fetching banners (Table might not exist yet)", error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const openEditModal = (banner: any) => {
    setFormData({
      title: banner.title || '',
      image_url: banner.image_url || '',
      link_url: banner.link_url || '',
      is_active: banner.is_active ?? true
    });
    setEditingId(banner.id);
    setIsModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newBanner = {
        title: formData.title,
        image_url: formData.image_url,
        link_url: formData.link_url || null,
        is_active: formData.is_active
      };
      
      if (editingId) {
        const { error } = await supabase.from('banners').update(newBanner).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('banners').insert([newBanner]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: '', image_url: '', link_url: '', is_active: true });
      fetchBanners();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Failed to save banner. Please ensure a 'banners' table exists in your Supabase database with columns: id, title, image_url, link_url, is_active.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBanner = async (id: string) => {
    
    try {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (error) throw error;
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Banners</h2>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', image_url: '', link_url: '', is_active: true });
            setIsModalOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Banner
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {loading ? (
           <div className="p-12 text-center text-stone-500">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="bg-stone-100 p-4 rounded-full mb-4">
              <ImageIcon className="h-8 w-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-1">No banners created yet</h3>
            <p className="text-stone-500 mb-6">Create promotional banners to display on the storefront homepage.</p>
            <button 
              onClick={() => {
                setEditingId(null);
                setFormData({ title: '', image_url: '', link_url: '', is_active: true });
                setIsModalOpen(true);
              }}
              className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 px-4 py-2 rounded-md font-medium flex items-center transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" /> Create First Banner
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-200">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-32 bg-stone-100 rounded overflow-hidden border border-stone-200">
                        {banner.image_url ? (
                          <img src={banner.image_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-stone-300" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{banner.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        banner.is_active ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-800'
                      }`}>
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(banner)} className="text-blue-600 hover:text-blue-900 p-1 mr-2"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => setItemToDelete(banner.id)} className="text-red-600 hover:text-red-900 p-1"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-white">
              <h3 className="text-lg font-bold text-stone-900">{editingId ? 'Edit Banner' : 'Add New Banner'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Banner Title*</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Image URL* (Wide image recommended)</label>
                <input required type="url" name="image_url" value={formData.image_url || ''} onChange={handleInputChange} placeholder="https://example.com/banner.jpg" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Target Link URL (optional)</label>
                <input type="text" name="link_url" value={formData.link_url || ''} onChange={handleInputChange} placeholder="/shop?category=seeds" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="is_active_banner" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300 rounded" />
                <label htmlFor="is_active_banner" className="ml-2 block text-sm text-stone-900">Active (Visible on home page)</label>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-stone-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    
      {/* Delete Confirmation Modal */}
      {itemToDelete !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 m-4">
            <h3 className="text-lg font-bold text-stone-900 mb-2">Confirm Deletion</h3>
            <p className="text-stone-600 mb-6 text-sm">Are you sure you want to delete this banner? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md font-medium transition-colors text-sm">Cancel</button>
              <button onClick={() => { deleteBanner(itemToDelete); setItemToDelete(null); }} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
</div>
  );
}
