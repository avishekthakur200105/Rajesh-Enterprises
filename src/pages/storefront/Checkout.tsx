import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cart';
import { useAuthStore } from '../../store/auth';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, CreditCard, Banknote } from 'lucide-react';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  municipality: z.string().min(1, 'Municipality is required'),
  streetTole: z.string().min(1, 'Street/Tole is required'),
  landmark: z.string().optional(),
  paymentMethod: z.enum(['cod', 'bank_transfer', 'esewa']),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, getSummary, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { subtotal } = getSummary();
  const [deliveryCharge] = useState(150); // Hardcoded for demo
  const total = subtotal + deliveryCharge;
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cod'
    }
  });

  const paymentMethod = watch('paymentMethod');

  if (items.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight mb-4">Order Confirmed!</h1>
        <p className="text-xl text-stone-600 mb-2">Thank you for your purchase.</p>
        <p className="text-stone-500 mb-8">Your order number is <strong className="text-stone-800">{orderComplete}</strong></p>
        <button onClick={() => navigate('/shop')} className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full transition-colors">
          Continue Shopping
        </button>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    setPlacingOrder(true);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        // Mock successful order if no DB configured
        setTimeout(() => {
          setOrderComplete('RE-MOCK-000001');
          clearCart();
        }, 1500);
        return;
      }

      // Prepare order data
      const orderData = {
        user_id: user?.id || null,
        status: 'pending',
        subtotal: subtotal,
        delivery_charge: deliveryCharge,
        total: total,
        payment_method: data.paymentMethod,
        shipping_address: {
          fullName: data.fullName,
          phone: data.phone,
          province: data.province,
          district: data.district,
          municipality: data.municipality,
          streetTole: data.streetTole,
          landmark: data.landmark
        }
      };

      const { data: orderResponse, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert Order Items
      const orderItems = items.map(item => ({
        order_id: orderResponse.id,
        product_id: item.productId,
        variant_id: item.id !== item.productId ? item.id : null,
        product_name: item.name,
        variant_name: item.variantName,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderComplete(orderResponse.order_number || orderResponse.id);
      clearCart();

    } catch (e) {
      console.error('Error placing order:', e);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-2/3 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-stone-800 mb-6 border-b border-stone-100 pb-4">Delivery Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                  <input {...register('fullName')} className="w-full border-stone-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" />
                  {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                  <input {...register('phone')} className="w-full border-stone-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Province</label>
                  <input {...register('province')} className="w-full border-stone-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" placeholder="e.g., Bagmati" />
                  {errors.province && <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">District</label>
                  <input {...register('district')} className="w-full border-stone-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" placeholder="e.g., Kathmandu" />
                  {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Municipality/VDC</label>
                  <input {...register('municipality')} className="w-full border-stone-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" />
                  {errors.municipality && <p className="mt-1 text-sm text-red-600">{errors.municipality.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Street / Tole</label>
                  <input {...register('streetTole')} className="w-full border-stone-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" />
                  {errors.streetTole && <p className="mt-1 text-sm text-red-600">{errors.streetTole.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Landmark (Optional)</label>
                  <input {...register('landmark')} className="w-full border-stone-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" placeholder="Near something prominent" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-stone-800 mb-6 border-b border-stone-100 pb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-green-600 bg-green-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                  <input type="radio" value="cod" {...register('paymentMethod')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300" />
                  <div className="ml-4 flex items-center">
                    <Banknote className="h-6 w-6 text-stone-500 mr-3" />
                    <span className="font-medium text-stone-800">Cash on Delivery</span>
                  </div>
                </label>
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'bank_transfer' ? 'border-green-600 bg-green-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                  <input type="radio" value="bank_transfer" {...register('paymentMethod')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300" />
                  <div className="ml-4 flex items-center">
                    <CreditCard className="h-6 w-6 text-stone-500 mr-3" />
                    <span className="font-medium text-stone-800">Bank Transfer</span>
                  </div>
                </label>
                 <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'esewa' ? 'border-green-600 bg-green-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                  <input type="radio" value="esewa" {...register('paymentMethod')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300" />
                  <div className="ml-4 flex items-center">
                    <div className="h-6 w-6 bg-green-600 text-white rounded flex items-center justify-center font-bold text-xs mr-3">e</div>
                    <span className="font-medium text-stone-800">eSewa / Online Wallet</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4 mb-4">Your Order</h2>
              
              <ul className="divide-y divide-stone-100 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between text-sm">
                    <div className="flex-1 pr-4">
                      <span className="font-medium text-stone-800 line-clamp-1">{item.name}</span>
                      <span className="text-stone-500 text-xs">Qty: {item.quantity} {item.variantName && `| ${item.variantName}`}</span>
                    </div>
                    <span className="font-medium text-stone-900 whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              
              <div className="space-y-3 text-sm mb-6 border-t border-stone-100 pt-4">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge</span>
                  <span className="font-medium text-stone-900">{formatCurrency(deliveryCharge)}</span>
                </div>
              </div>
              
              <div className="border-t border-stone-200 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-900 text-lg">Total to Pay</span>
                  <span className="font-bold text-green-700 text-xl">{formatCurrency(total)}</span>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={placingOrder}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {placingOrder ? 'Processing...' : 'Place Order'}
              </button>
              <p className="text-xs text-stone-500 text-center mt-4">
                By placing your order, you agree to our Terms and Conditions.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
