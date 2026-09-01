import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Star, Edit2, Trash2, Search, X, Check } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  productId: string;
  productName?: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit state
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState<{name: string, rating: number, comment: string}>({
    name: '', rating: 5, comment: ''
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      // 1. Gather all reviews from localStorage
      const allReviews: Review[] = [];
      const productIds = new Set<string>();
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('reviews_')) {
          const productId = key.replace('reviews_', '');
          productIds.add(productId);
          
          try {
            const stored = JSON.parse(localStorage.getItem(key) || '[]');
            stored.forEach((rev: any) => {
              allReviews.push({ ...rev, productId });
            });
          } catch (e) {
            console.error('Failed to parse reviews for key', key);
          }
        }
      }

      // 2. Fetch product titles from Supabase if we have IDs
      if (productIds.size > 0 && import.meta.env.VITE_SUPABASE_URL) {
        const { data: products } = await supabase
          .from('products')
          .select('id, title')
          .in('id', Array.from(productIds));
          
        if (products) {
          const titleMap = products.reduce((acc, p) => {
            acc[p.id] = p.title;
            return acc;
          }, {} as Record<string, string>);
          
          allReviews.forEach(r => {
            r.productName = titleMap[r.productId] || 'Unknown Product';
          });
        }
      }

      // Sort by date/id descending
      allReviews.sort((a, b) => b.id - a.id);
      setReviews(allReviews);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      name: review.name,
      rating: review.rating,
      comment: review.comment
    });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleSaveEdit = () => {
    if (!editingReview) return;
    
    // Create the updated review object
    const updatedReview = {
      ...editingReview,
      name: editForm.name,
      rating: editForm.rating,
      comment: editForm.comment
    };
    
    // Update state locally
    const updatedReviews = reviews.map(r => r.id === editingReview.id ? updatedReview : r);
    setReviews(updatedReviews);
    
    // Save to local storage for the specific product
    saveProductReviewsToStorage(updatedReview.productId, updatedReviews);
    
    setEditingReview(null);
  };

  const handleDelete = (reviewToDelete: Review) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    const updatedReviews = reviews.filter(r => r.id !== reviewToDelete.id);
    setReviews(updatedReviews);
    
    // Save to local storage for the specific product
    saveProductReviewsToStorage(reviewToDelete.productId, updatedReviews);
  };

  const saveProductReviewsToStorage = (productId: string, allCurrentReviews: Review[]) => {
    // Filter reviews belonging ONLY to this product
    const productReviews = allCurrentReviews
      .filter(r => r.productId === productId)
      .map(({ productId, productName, ...rest }) => rest); // Strip extra admin fields
      
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(productReviews));
  };

  const filteredReviews = reviews.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.productName && r.productName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Customer Reviews</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-stone-500 animate-pulse">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            {searchQuery ? 'No reviews matched your search.' : 'No customer reviews found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium">Comment</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-sm">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-stone-50">
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-medium text-stone-900">{review.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-stone-700 truncate max-w-[150px]" title={review.productName}>
                        {review.productName || review.productId}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center text-yellow-500">
                        <span className="font-bold mr-1">{review.rating}</span>
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="text-stone-600 line-clamp-2" title={review.comment}>
                        {review.comment}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-stone-500">
                      {review.date}
                    </td>
                    <td className="p-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEditClick(review)}
                          className="text-stone-400 hover:text-green-600 transition-colors p-1"
                          title="Edit Review"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(review)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                          title="Delete Review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
              <h3 className="font-bold text-stone-800 text-lg">Edit Review</h3>
              <button onClick={handleCancelEdit} className="text-stone-400 hover:text-stone-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
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
                      onClick={() => setEditForm({...editForm, rating: star})}
                      className="focus:outline-none"
                    >
                      <Star className={`h-8 w-8 ${editForm.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Comment</label>
                <textarea 
                  rows={4}
                  value={editForm.comment}
                  onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end space-x-3">
              <button 
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-md transition-colors border border-stone-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors flex items-center"
              >
                <Check className="h-4 w-4 mr-2" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
