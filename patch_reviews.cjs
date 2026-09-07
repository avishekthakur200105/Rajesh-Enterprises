const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/reviews/index.tsx', 'utf8');

// 1. Import Plus
code = code.replace(
  "import { Star, Edit2, Trash2, Search, X, Check } from 'lucide-react';",
  "import { Star, Edit2, Trash2, Search, X, Check, Plus } from 'lucide-react';"
);

// 2. Add state
const stateSearch = `  const [editingReview, setEditingReview] = useState<Review | null>(null);`;
const stateReplace = `  const [allProducts, setAllProducts] = useState<{id: string, title: string}[]>([]);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [addForm, setAddForm] = useState<{productId: string, name: string, rating: number, comment: string}>({
    productId: '', name: '', rating: 5, comment: ''
  });
  const [editingReview, setEditingReview] = useState<Review | null>(null);`;
code = code.replace(stateSearch, stateReplace);

// 3. Add loadAllProducts
const effectSearch = `  useEffect(() => {
    loadReviews();
  }, []);`;
const effectReplace = `  useEffect(() => {
    loadReviews();
    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    try {
      const { data } = await supabase.from('products').select('id, title').order('title');
      if (data) setAllProducts(data);
    } catch (e) {
      console.error(e);
    }
  };`;
code = code.replace(effectSearch, effectReplace);

// 4. Add handleAddReview
const handlersSearch = `  const filteredReviews = reviews.filter(r => `;
const handlersReplace = `  const handleAddReview = () => {
    if (!addForm.productId || !addForm.name.trim() || !addForm.comment.trim()) {
      alert('Please fill out all fields.');
      return;
    }
    
    // Get existing reviews for this product
    const existingStr = localStorage.getItem(\`reviews_\${addForm.productId}\`);
    const existing = existingStr ? JSON.parse(existingStr) : [];
    
    const newReview = {
      id: Date.now(),
      name: addForm.name,
      rating: addForm.rating,
      comment: addForm.comment,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    
    const updated = [newReview, ...existing];
    localStorage.setItem(\`reviews_\${addForm.productId}\`, JSON.stringify(updated));
    
    // reset and reload
    setIsAddingReview(false);
    setAddForm({ productId: '', name: '', rating: 5, comment: '' });
    loadReviews();
  };

  const filteredReviews = reviews.filter(r => `;
code = code.replace(handlersSearch, handlersReplace);

// 5. Add button
const titleSearch = `      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Customer Reviews</h2>
      </div>`;
const titleReplace = `      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Customer Reviews</h2>
        <button 
          onClick={() => setIsAddingReview(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Review
        </button>
      </div>`;
code = code.replace(titleSearch, titleReplace);

// 6. Add modal
const modalSearch = `    </div>
  );
}`;
const modalReplace = `
      {/* Add Review Modal */}
      {isAddingReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
              <h3 className="font-bold text-stone-800 text-lg">Add New Review</h3>
              <button onClick={() => setIsAddingReview(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Product</label>
                <select 
                  value={addForm.productId}
                  onChange={(e) => setAddForm({...addForm, productId: e.target.value})}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="">Select a product...</option>
                  {allProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  value={addForm.name}
                  onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setAddForm({...addForm, rating: star})}
                      className="focus:outline-none"
                    >
                      <Star className={\`h-8 w-8 \${addForm.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300'}\`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Comment</label>
                <textarea 
                  rows={4}
                  value={addForm.comment}
                  onChange={(e) => setAddForm({...addForm, comment: e.target.value})}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end space-x-3">
              <button 
                onClick={() => setIsAddingReview(false)}
                className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-md transition-colors border border-stone-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddReview}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors flex items-center"
              >
                <Check className="h-4 w-4 mr-2" /> Add Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;
code = code.replace(modalSearch, modalReplace);

fs.writeFileSync('src/pages/admin/reviews/index.tsx', code);
console.log("Success patching reviews page!");
