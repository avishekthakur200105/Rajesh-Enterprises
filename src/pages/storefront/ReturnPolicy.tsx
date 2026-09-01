import { useSettingsStore } from '../../store/settings';
export default function ReturnPolicy() {
  const { settings } = useSettingsStore();
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-stone-900 tracking-tight mb-8">Returns & Refunds Policy</h1>
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 prose prose-stone max-w-none">
          <p>We want you to be completely satisfied with your purchase from {settings.shopName}.</p>
          
          <h2>1. Return Window</h2>
          <p>You have 7 days to return an item from the date you received it. To be eligible for a return, your item must be unused, in the same condition that you received it, and in the original packaging.</p>
          
          <h2>2. Non-Returnable Items</h2>
          <p>Certain types of items cannot be returned due to the nature of the products:</p>
          <ul>
            <li>Opened seed packets</li>
            <li>Unsealed liquid fertilizers or pesticides</li>
            <li>Products that require special temperature storage</li>
            <li>Items marked as final sale</li>
          </ul>
          
          <h2>3. Refunds</h2>
          <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days, depending on your card issuer's policies.</p>
          
          <h2>4. Return Shipping</h2>
          <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>
        </div>
      </div>
    </div>
  );
}
