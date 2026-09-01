const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Checkout.tsx', 'utf8');

// 1. Update schema
code = code.replace(
  "paymentMethod: z.enum(['cod', 'bank_transfer', 'esewa']),",
  ""
);

// 2. Remove defaultValues paymentMethod
code = code.replace(
  "defaultValues: {\n      paymentMethod: 'cod'\n    }",
  "defaultValues: {}"
);

// 3. Remove paymentMethod watch
code = code.replace(
  "const paymentMethod = watch('paymentMethod');",
  ""
);

// 4. Hardcode payment_method in submission
code = code.replace(
  "payment_method: data.paymentMethod,",
  "payment_method: 'cod',"
);

// 5. Remove the UI section
const uiTarget = `            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-stone-800 mb-6 border-b border-stone-100 pb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className={\`flex items-center p-4 border rounded-lg cursor-pointer transition-colors \${paymentMethod === 'cod' ? 'border-green-600 bg-green-50' : 'border-stone-200 hover:bg-stone-50'}\`}>
                  <input type="radio" value="cod" {...register('paymentMethod')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300" />
                  <div className="ml-4 flex items-center">
                    <Banknote className="h-6 w-6 text-stone-500 mr-3" />
                    <span className="font-medium text-stone-800">Cash on Delivery</span>
                  </div>
                </label>
                <label className={\`flex items-center p-4 border rounded-lg cursor-pointer transition-colors \${paymentMethod === 'bank_transfer' ? 'border-green-600 bg-green-50' : 'border-stone-200 hover:bg-stone-50'}\`}>
                  <input type="radio" value="bank_transfer" {...register('paymentMethod')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300" />
                  <div className="ml-4 flex items-center">
                    <CreditCard className="h-6 w-6 text-stone-500 mr-3" />
                    <span className="font-medium text-stone-800">Bank Transfer</span>
                  </div>
                </label>
                 <label className={\`flex items-center p-4 border rounded-lg cursor-pointer transition-colors \${paymentMethod === 'esewa' ? 'border-green-600 bg-green-50' : 'border-stone-200 hover:bg-stone-50'}\`}>
                  <input type="radio" value="esewa" {...register('paymentMethod')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300" />
                  <div className="ml-4 flex items-center">
                    <div className="h-6 w-6 bg-green-600 text-white rounded flex items-center justify-center font-bold text-xs mr-3">e</div>
                    <span className="font-medium text-stone-800">eSewa / Online Wallet</span>
                  </div>
                </label>
              </div>
            </div>`;

code = code.replace(uiTarget, `            {/* Payment Method - Fixed to COD */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-stone-800 mb-6 border-b border-stone-100 pb-4">Payment Method</h2>
              <div className="bg-green-50 border border-green-600 rounded-lg p-4 flex items-center">
                <Banknote className="h-6 w-6 text-green-700 mr-3" />
                <div>
                  <span className="font-bold text-green-900 block">Cash on Delivery</span>
                  <span className="text-green-700 text-sm">Pay when you receive your order</span>
                </div>
              </div>
            </div>`);

fs.writeFileSync('src/pages/storefront/Checkout.tsx', code);
