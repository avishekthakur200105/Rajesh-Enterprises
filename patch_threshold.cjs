const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/settings/index.tsx', 'utf8');

const searchStr = `            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Discounted Delivery Charge (Rs.)</label>
              <input 
                type="number" 
                name="discountedDeliveryCharge"
                value={storeData.discountedDeliveryCharge || 0} 
                onChange={(e) => setStoreData(prev => ({ ...prev, discountedDeliveryCharge: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
              <p className="text-xs text-stone-500 mt-1">Optional. Will be shown if configured.</p>
            </div>
          </div>
        </div>
      </div>`;

const replaceStr = `            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Discounted Delivery Charge (Rs.)</label>
              <input 
                type="number" 
                name="discountedDeliveryCharge"
                value={storeData.discountedDeliveryCharge || 0} 
                onChange={(e) => setStoreData(prev => ({ ...prev, discountedDeliveryCharge: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Subtotal Threshold for Discounted Delivery (Rs.)</label>
              <input 
                type="number" 
                name="deliveryDiscountThreshold"
                value={storeData.deliveryDiscountThreshold || 0} 
                onChange={(e) => setStoreData(prev => ({ ...prev, deliveryDiscountThreshold: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
              <p className="text-xs text-stone-500 mt-1">If the subtotal exceeds this amount, the discounted delivery charge will be applied.</p>
            </div>
          </div>
        </div>
      </div>`;

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/pages/admin/settings/index.tsx', code);
