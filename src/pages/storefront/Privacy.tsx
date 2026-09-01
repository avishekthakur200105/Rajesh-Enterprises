export default function Privacy() {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-stone-900 tracking-tight mb-8">Privacy Policy</h1>
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 prose prose-stone max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Information We Collect</h2>
          <p>We collect information from you when you register on our site, place an order, subscribe to our newsletter, or fill out a form. The collected information includes your name, email address, mailing address, and phone number.</p>
          
          <h2>2. How We Use Your Information</h2>
          <p>Any of the information we collect from you may be used in one of the following ways:</p>
          <ul>
            <li>To personalize your experience</li>
            <li>To improve our website</li>
            <li>To process transactions</li>
            <li>To send periodic emails regarding your order or other products and services</li>
          </ul>
          
          <h2>3. Information Protection</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
          
          <h2>4. Cookies</h2>
          <p>We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits, and compile aggregate data about site traffic and site interaction.</p>
        </div>
      </div>
    </div>
  );
}
