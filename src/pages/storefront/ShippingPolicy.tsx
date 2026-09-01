import { useSettingsStore } from '../../store/settings';
export default function ShippingPolicy() {
  const { settings } = useSettingsStore();
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-stone-900 tracking-tight mb-8">Shipping & Delivery Policy</h1>
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 prose prose-stone max-w-none">
          <p>At {settings.shopName}, we aim to deliver your agricultural supplies safely and promptly across Nepal.</p>
          
          <h2>1. Delivery Areas</h2>
          <p>We deliver to all major cities and districts within Nepal. Delivery to remote rural areas might take additional time or require pickup from the nearest major transport hub.</p>
          
          <h2>2. Processing Time</h2>
          <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or public holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.</p>
          
          <h2>3. Shipping Rates</h2>
          <p>Shipping charges for your order will be calculated and displayed at checkout. Rates depend on the weight of the products and the delivery destination. Standard delivery within Kathmandu Valley typically costs Rs. 150.</p>
          
          <h2>4. Delivery Time</h2>
          <ul>
            <li><strong>Inside Kathmandu Valley:</strong> 1-3 business days</li>
            <li><strong>Major Cities (Pokhara, Chitwan, etc.):</strong> 3-5 business days</li>
            <li><strong>Other Districts:</strong> 5-7 business days</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
