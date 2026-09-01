const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Checkout.tsx', 'utf8');

// 1. Add Star import
code = code.replace(
  "import { CheckCircle2, CreditCard, Banknote } from 'lucide-react';",
  "import { CheckCircle2, CreditCard, Banknote, Star, X } from 'lucide-react';"
);

// 2. Add state for purchased items and reviews
const stateSearch = `  const [orderComplete, setOrderComplete] = useState<string | null>(null);`;
const stateReplace = `  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [reviewForm, setReviewForm] = useState({ productId: '', name: '', rating: 5, comment: '' });`;
code = code.replace(stateSearch, stateReplace);

// 3. Store items before clearCart
const onSubmitSearch1 = `          setOrderComplete('RE-MOCK-000001');
          clearCart();`;
const onSubmitReplace1 = `          setPurchasedItems([...items]);
          setOrderComplete('RE-MOCK-000001');
          setShowReviewPopup(true);
          clearCart();`;
code = code.replace(onSubmitSearch1, onSubmitReplace1);

const onSubmitSearch2 = `      setOrderComplete(orderResponse.order_number || orderResponse.id);
      clearCart();`;
const onSubmitReplace2 = `      setPurchasedItems([...items]);
      setOrderComplete(orderResponse.order_number || orderResponse.id);
      setShowReviewPopup(true);
      clearCart();`;
code = code.replace(onSubmitSearch2, onSubmitReplace2);

// 4. Add submit review handler
const submitReviewHandler = `
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.productId || !reviewForm.name || !reviewForm.comment) return;
    
    const review = {
      id: Date.now(),
      name: reviewForm.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toLocaleDateString(),
      productId: reviewForm.productId
    };
    
    const storageKey = \`reviews_\${reviewForm.productId}\`;
    const existingReviews = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedReviews = [review, ...existingReviews];
    localStorage.setItem(storageKey, JSON.stringify(updatedReviews));
    
    alert('Thank you for your review!');
    setShowReviewPopup(false);
  };
`;
code = code.replace("  const onSubmit = async (data: CheckoutForm) => {", submitReviewHandler + "\n  const onSubmit = async (data: CheckoutForm) => {");

// 5. Update order complete UI to include the review popup
const orderCompleteUI = `  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight mb-4">Order Confirmed!</h1>
        <p className="text-xl text-stone-600 mb-2">Thank you for your purchase.</p>
        <p className="text-stone-500 mb-8">Your order number is <strong className="text-stone-800">{orderComplete}</strong></p>
        <button onClick={() => navigate('/shop')} className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full transition-colors">
          Continue Shopping
        </button>

        {showReviewPopup && purchasedItems.length > 0 && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden text-left relative animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-stone-100 bg-stone-50">
                <button onClick={() => setShowReviewPopup(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  Rate Your Purchase
                </h3>
                <p className="text-stone-500 text-sm mt-1">Share your experience with other farmers.</p>
              </div>
              
              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Select Product</label>
                  <select 
                    required
                    value={reviewForm.productId}
                    onChange={(e) => setReviewForm({...reviewForm, productId: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">-- Choose a product --</option>
                    {purchasedItems.map(item => (
                      <option key={item.productId} value={item.productId}>{item.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className="focus:outline-none"
                      >
                        <Star className={\`h-8 w-8 \${reviewForm.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300'}\`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Your Review</label>
                  <textarea 
                    required
                    rows={3}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Tell us what you think..."
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-md transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }`;
code = code.replace(/  if \(orderComplete\) {[\s\S]*?    \);\n  }/, orderCompleteUI);

fs.writeFileSync('src/pages/storefront/Checkout.tsx', code);
