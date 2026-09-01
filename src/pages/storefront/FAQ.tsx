export default function FAQ() {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-stone-900 tracking-tight mb-8">Frequently Asked Questions</h1>
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">Do you deliver outside Kathmandu valley?</h3>
            <p className="text-stone-600">Yes, we deliver to all major districts in Nepal. Delivery charges vary based on location.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">Are your seeds certified?</h3>
            <p className="text-stone-600">Yes, all our seeds are sourced from certified producers and undergo quality checks.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">Can I return a product?</h3>
            <p className="text-stone-600">We accept returns within 7 days for unopened and undamaged items. Please check our return policy for details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
