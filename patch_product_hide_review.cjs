const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductDetail.tsx', 'utf8');

// We just want to hide the "Write a Review" form.
// In our previous patch, we added a form with \`<h3 className="text-lg font-bold text-stone-800 mb-4">Write a Review</h3>\`
const searchForm = `            <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-stone-200 pb-8 lg:pb-0 lg:pr-8">
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
            
            <div className="lg:col-span-2 space-y-6">`;

const replaceForm = `            <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-stone-200 pb-8 lg:pb-0 lg:pr-8">
              <h3 className="text-lg font-bold text-stone-800 mb-4">Write a Review</h3>
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 text-center">
                <Star className="h-10 w-10 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-600 text-sm">
                  You can review this product by placing an order. A review form will appear after checkout!
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6">`;

code = code.replace(searchForm, replaceForm);
fs.writeFileSync('src/pages/storefront/ProductDetail.tsx', code);
