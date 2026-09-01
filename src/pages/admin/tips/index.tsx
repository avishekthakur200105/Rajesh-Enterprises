import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Edit, Trash2, X, Lightbulb } from 'lucide-react';

export default function AdminTips() {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    title_np: '',
    content: '',
    content_np: '',
    image_url: ''
  });

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) return;
      const { data } = await supabase.from('categories').select('*').eq('slug', '_farmer_tips_').single();
      
      if (data && data.description) {
        try {
          const parsed = JSON.parse(data.description);
          setTips(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setTips([]);
        }
      } else {
        setTips([]);
      }
    } catch (error) {
      console.error("Error fetching tips", error);
    } finally {
      setLoading(false);
    }
  };

  const saveTipsToDb = async (newTips: any[]) => {
    try {
      const payload = {
        name: 'Farmer Tips',
        slug: '_farmer_tips_',
        description: JSON.stringify(newTips),
        is_active: false
      };
      
      const { data } = await supabase.from('categories').select('id').eq('slug', '_farmer_tips_').single();
      
      if (data && data.id) {
        await supabase.from('categories').update(payload).eq('id', data.id);
      } else {
        await supabase.from('categories').insert([payload]);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openEditModal = (tip: any, index: number) => {
    setFormData({
      title: tip.title || '',
      title_np: tip.title_np || '',
      content: tip.content || '',
      content_np: tip.content_np || '',
      image_url: tip.image_url || ''
    });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let newTips = [...tips];
    const tipData = {
      id: Date.now().toString(),
      title: formData.title,
      title_np: formData.title_np,
      content: formData.content,
      content_np: formData.content_np,
      image_url: formData.image_url
    };
    
    if (editingIndex !== null) {
      newTips[editingIndex] = { ...newTips[editingIndex], ...tipData };
    } else {
      newTips.push(tipData);
    }
    
    const success = await saveTipsToDb(newTips);
    
    if (success) {
      setTips(newTips);
      setIsModalOpen(false);
      setEditingIndex(null);
      setFormData({ title: '', title_np: '', content: '', content_np: '', image_url: '' });
    } else {
      alert("Failed to save. Check console.");
    }
    
    setIsSubmitting(false);
  };

  const deleteTip = async (index: number) => {
    
    
    const newTips = [...tips];
    newTips.splice(index, 1);
    
    const success = await saveTipsToDb(newTips);
    if (success) {
      setTips(newTips);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800 flex items-center">
          <Lightbulb className="mr-2 text-green-600" />
          Farmer Tips
        </h2>
        <button 
          onClick={() => {
            setEditingIndex(null);
            setFormData({ title: '', title_np: '', content: '', content_np: '', image_url: '' });
            setIsModalOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Tip
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Content</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-stone-500">Loading tips...</td></tr>
              ) : tips.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-stone-500">No tips found.</td></tr>
              ) : (
                tips.map((tip, index) => (
                  <tr key={index} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tip.image_url ? (
                        <img src={tip.image_url} alt="" className="h-10 w-10 rounded-md object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-stone-100 flex items-center justify-center text-stone-400">
                          <Lightbulb className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{tip.title}</td>
                    <td className="px-6 py-4 text-sm text-stone-500 max-w-xs truncate">{tip.content || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(tip, index)} className="text-blue-600 hover:text-blue-900 p-1 mr-2"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => setItemToDelete(index)} className="text-red-600 hover:text-red-900 p-1"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden m-4">
            <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-white">
              <h3 className="text-lg font-bold text-stone-900">{editingIndex !== null ? 'Edit Tip' : 'Add New Tip'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title (English)*</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title (Nepali)</label>
                <input type="text" name="title_np" value={formData.title_np || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
                <input type="text" name="image_url" value={formData.image_url || ''} onChange={handleInputChange} placeholder="https://..." className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Tip Content (English)*</label>
                <textarea required name="content" rows={2} value={formData.content || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Tip Content (Nepali)</label>
                <textarea name="content_np" rows={2} value={formData.content_np || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-stone-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Tip'}
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
            <p className="text-stone-600 mb-6 text-sm">Are you sure you want to delete this tip? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md font-medium transition-colors text-sm">Cancel</button>
              <button onClick={() => { deleteTip(itemToDelete); setItemToDelete(null); }} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
</div>
  );
}
