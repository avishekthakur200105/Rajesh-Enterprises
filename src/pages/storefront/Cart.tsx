import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useCartStore } from '../../store/cart';
import { useSettingsStore } from '../../store/settings';
import { formatCurrency } from '../../lib/utils';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getSummary } = useCartStore();
  const { subtotal, discount } = getSummary();
  const navigate = useNavigate();
  const { settings } = useSettingsStore();
  const { isAdmin } = useAuthStore();



  let deliveryCharge = settings?.deliveryCharge || 150;
  if (settings?.deliveryDiscountThreshold && subtotal >= settings.deliveryDiscountThreshold && settings.discountedDeliveryCharge !== undefined) {
    deliveryCharge = settings.discountedDeliveryCharge;
  }
  const total = subtotal - discount + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-stone-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-stone-300" />
        </div>
        <h2 className="text-3xl font-bold text-stone-800 mb-4 tracking-tight">Your cart is empty</h2>
        <p className="text-stone-500 mb-8 max-w-md mx-auto">Looks like you haven't added any products to your cart yet. Let's find something for your farm.</p>
        <Link to="/shop" className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full transition-colors inline-flex items-center">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-[calc(100vh-200px)] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <ul className="divide-y divide-stone-200">
                {items.map((item) => (
                  <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                    <Link to={`/products/${item.slug || item.productId}`} className="w-full sm:w-24 h-24 bg-stone-50 rounded-lg flex items-center justify-center border border-stone-100 flex-shrink-0">
                       {item.image ? (
                         <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-2" />
                       ) : (
                         <ShoppingBag className="h-8 w-8 text-stone-300" />
                       )}
                    </Link>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-stone-800 text-lg">
                            <Link to={`/products/${item.slug || item.productId}`} className="hover:text-green-700">{item.name}</Link>
                          </h3>
                          {item.variantName && (
                            <p className="text-sm text-stone-500 mt-1">Option: {item.variantName}</p>
                          )}
                        </div>
                        <p className="font-bold text-green-700 text-lg">{formatCurrency(item.price)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-stone-300 rounded-md bg-white overflow-hidden h-10 w-28">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-full flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <div className="flex-1 text-center font-medium text-sm text-stone-800">{item.quantity}</div>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="w-8 h-full flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-stone-900">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge</span>
                  <span className="font-medium text-stone-900">{formatCurrency(deliveryCharge)}</span>
                </div>
              </div>
              
              <div className="border-t border-stone-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-900 text-lg">Estimated Total</span>
                  <span className="font-bold text-green-700 text-xl">{formatCurrency(total)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              <div className="mt-4 text-center">
                <Link to="/shop" className="text-sm font-medium text-green-700 hover:underline">
                  or Continue Shopping
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
