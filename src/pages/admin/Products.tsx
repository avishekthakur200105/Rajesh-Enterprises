import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    title_np: '',
    slug: '',
    regular_price: '',
    discount_price: '',
    stock_quantity: '',
    category_id: '',
    description: '',
    image_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) return;
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(name), image_url:product_images(url)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('id, name').order('name');
      if (data) setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleQuickAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-');
      const { data, error } = await supabase.from('categories').insert([{ name: newCategoryName, slug }]).select();
      if (error) throw error;
      if (data && data[0]) {
        setCategories(prev => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
        setFormData(prev => ({ ...prev, category_id: data[0].id }));
      }
      setIsAddingCategory(false);
      setNewCategoryName('');
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const openEditModal = (product: any) => {
    setFormData({
      title: product.title || '',
      title_np: product.title_np || '',
      slug: product.slug || '',
      regular_price: product.regular_price?.toString() || '',
      discount_price: product.discount_price?.toString() || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      category_id: product.category_id || '',
      description: product.description || '',
      image_url: product.image_url?.[0]?.url || '',
      is_active: product.is_active ?? true
    });
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {      const newProduct = {
        title: formData.title,
        title_np: formData.title_np || null,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        regular_price: parseFloat(formData.regular_price) || 0,
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category_id: formData.category_id || null,
        description: formData.description || null,
        is_active: formData.is_active
      };
      
      const imageUrl = formData.image_url || null;
      
      let productId = editingId;
      if (editingId) {
        const { error } = await supabase.from('products').update(newProduct).eq('id', editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('products').insert([newProduct]).select();
        if (error) throw error;
        productId = data[0].id;
      }
      
      if (imageUrl && productId) {
        // Upsert into product_images
        const { data: existingImages } = await supabase.from('product_images').select('id').eq('product_id', productId);
        if (existingImages && existingImages.length > 0) {
          await supabase.from('product_images').update({ url: imageUrl }).eq('id', existingImages[0].id);
        } else {
          await supabase.from('product_images').insert([{ product_id: productId, url: imageUrl }]);
        }
      }

      
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        title: '', title_np: '', slug: '', regular_price: '', discount_price: '',
        stock_quantity: '', category_id: '', description: '', image_url: '', is_active: true
      });
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Products</h2>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: '', title_np: '', slug: '', regular_price: '', discount_price: '',
              stock_quantity: '', category_id: '', description: '', image_url: '', is_active: true
            });
            setIsModalOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md leading-5 bg-white placeholder-stone-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-stone-500">
            Total {filteredProducts.length} products
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-stone-500">Loading products...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-stone-500">No products found.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-stone-100 rounded flex items-center justify-center border border-stone-200 overflow-hidden">
                          {product.image_url?.[0]?.url ? (
                            <img src={product.image_url[0].url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-stone-400 text-xs">No img</span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-stone-900">{product.title}</div>
                          {product.title_np && <div className="text-xs text-stone-500">{product.title_np}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{product.category?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900 font-medium">
                      {product.discount_price ? (
                         <div className="flex flex-col">
                           <span className="text-green-600">{formatCurrency(product.discount_price)}</span>
                           <span className="text-xs text-stone-400 line-through">{formatCurrency(product.regular_price)}</span>
                         </div>
                      ) : (
                        formatCurrency(product.regular_price)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock_quantity > 10 ? 'bg-green-100 text-green-800' :
                        product.stock_quantity > 0 ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.is_active ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-800'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-900 p-1 mr-2"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => setItemToDelete(product.id)} className="text-red-600 hover:text-red-900 p-1"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-stone-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-stone-900">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Title (English)*</label>
                  <input required type="text" name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Title (Nepali)</label>
                  <input type="text" name="title_np" value={formData.title_np || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Regular Price*</label>
                  <input required type="number" step="0.01" name="regular_price" value={formData.regular_price || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Discount Price</label>
                  <input type="number" step="0.01" name="discount_price" value={formData.discount_price || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Stock Quantity*</label>
                  <input required type="number" name="stock_quantity" value={formData.stock_quantity || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                  {isAddingCategory ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="New category name" 
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
                      />
                      <button type="button" onClick={handleQuickAddCategory} className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 whitespace-nowrap">Save</button>
                      <button type="button" onClick={() => setIsAddingCategory(false)} className="bg-stone-100 text-stone-600 px-3 py-2 rounded-md hover:bg-stone-200"><X className="h-4 w-4"/></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select name="category_id" value={formData.category_id || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500">
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setIsAddingCategory(true)} className="bg-stone-100 text-stone-600 px-3 py-2 rounded-md hover:bg-stone-200 whitespace-nowrap flex items-center" title="Add new category">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
                <input type="url" name="image_url" value={formData.image_url || ''} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea name="description" rows={3} value={formData.description || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300 rounded" />
                <label htmlFor="is_active" className="ml-2 block text-sm text-stone-900">Active (Visible in store)</label>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-stone-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Product'}
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
            <p className="text-stone-600 mb-6 text-sm">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md font-medium transition-colors text-sm">Cancel</button>
              <button onClick={() => { deleteProduct(itemToDelete); setItemToDelete(null); }} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
</div>
  );
}
