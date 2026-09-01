import { useSettingsStore } from '../../store/settings';
export default function Terms() {
  const { settings } = useSettingsStore();
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-stone-900 tracking-tight mb-8">Terms and Conditions</h1>
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 prose prose-stone max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to {settings.shopName}. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h2>2. Use of the Site</h2>
          <p>You may use our site for lawful purposes only. You must not use our site in any way that breaches any applicable local, national, or international law or regulation.</p>
          
          <h2>3. Products and Pricing</h2>
          <p>All products listed on the website are subject to availability. We reserve the right to modify or discontinue any product at any time. Prices for our products are subject to change without notice.</p>
          
          <h2>4. Payment</h2>
          <p>We accept various forms of payment including Cash on Delivery (COD), Bank Transfer, and eSewa. Payment must be completed prior to the dispatch of goods unless COD is selected.</p>
          
          <h2>5. Limitation of Liability</h2>
          <p>{settings.shopName} shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products.</p>
        </div>
      </div>
    </div>
  );
}
