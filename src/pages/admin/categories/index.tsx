import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) return;
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      setCategories((data || []).filter((c: any) => !['_owner_profile_', '_farmer_tips_', '_store_settings_', '_contact_messages_'].includes(c.slug)));
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openEditModal = (category: any) => {
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || ''
    });
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newCategory = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description || null
      };
      
      if (editingId) {
        const { error } = await supabase.from('categories').update(newCategory).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert([newCategory]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', slug: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCategory = async (id: string) => {

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Categories</h2>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', slug: '', description: '' });
            setIsModalOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </div>
            <input type="text" placeholder="Search categories..." className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-stone-500">Loading categories...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-stone-500">No categories found.</td></tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-stone-500">{category.description || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(category)} className="text-blue-600 hover:text-blue-900 p-1 mr-2"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => setItemToDelete(category.id)} className="text-red-600 hover:text-red-900 p-1"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-white">
              <h3 className="text-lg font-bold text-stone-900">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Name*</label>
                <input required type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Slug (optional)</label>
                <input type="text" name="slug" value={formData.slug || ''} onChange={handleInputChange} placeholder="leave blank to auto-generate" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea name="description" rows={3} value={formData.description || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-stone-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Category'}
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
            <p className="text-stone-600 mb-6 text-sm">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md font-medium transition-colors text-sm">Cancel</button>
              <button onClick={() => { deleteCategory(itemToDelete); setItemToDelete(null); }} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
</div>
  );
}
