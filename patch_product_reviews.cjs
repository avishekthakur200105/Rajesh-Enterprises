const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductDetail.tsx', 'utf8');

// Add Star import
code = code.replace(
  "import { Leaf, Minus, Plus, ShoppingCart, CheckCircle2 } from 'lucide-react';",
  "import { Leaf, Minus, Plus, ShoppingCart, CheckCircle2, Star } from 'lucide-react';"
);

// Add review states
const statesSearch = `  const [addingToCart, setAddingToCart] = useState(false);`;
const statesReplace = `  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Load reviews from local storage or mock data
  useEffect(() => {
    if (product) {
      const storedReviews = localStorage.getItem(\`reviews_\${product.id}\`);
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      } else {
        // Mock default review
        setReviews([
          {
            id: 1,
            name: "Ram Bahadur",
            rating: 5,
            comment: "Very good product. Helped my crops grow better this season.",
            date: new Date().toLocaleDateString()
          }
        ]);
      }
    }
  }, [product]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    
    setIsSubmittingReview(true);
    
    const review = {
      id: Date.now(),
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString()
    };
    
    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(\`reviews_\${product?.id}\`, JSON.stringify(updatedReviews));
    
    setNewReview({ rating: 5, comment: '', name: '' });
    setIsSubmittingReview(false);
  };`;

code = code.replace(statesSearch, statesReplace);

// Add review UI
const uiSearch = `        {/* Long Description & Specs tabs could go here */}
      </div>
    </div>
  );
}`;
const uiReplace = `        {/* Long Description & Reviews */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="border-b border-stone-200">
            <h2 className="text-xl font-bold text-stone-800 px-6 py-4">Customer Reviews & Ratings</h2>
          </div>
          
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-stone-200 pb-8 lg:pb-0 lg:pr-8">
              <h3 className="text-lg font-bold text-stone-800 mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="focus:outline-none"
                      >
                        <Star className={\`h-6 w-6 \${newReview.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300'}\`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Your Review</label>
                  <textarea 
                    required
                    rows={4}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Tell us what you think about this product..."
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-bold text-stone-800 flex items-center justify-between">
                Reviews ({reviews.length})
                <div className="flex items-center text-sm font-normal text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-bold text-stone-800 mr-1">
                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                  </span>
                  out of 5
                </div>
              </h3>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                  <p className="text-stone-500 italic text-center py-8">No reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-stone-800">{review.name}</span>
                        <span className="text-xs text-stone-500">{review.date}</span>
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={\`h-4 w-4 \${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300'}\`} 
                          />
                        ))}
                      </div>
                      <p className="text-stone-600 text-sm whitespace-pre-line">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

code = code.replace(uiSearch, uiReplace);

fs.writeFileSync('src/pages/storefront/ProductDetail.tsx', code);
