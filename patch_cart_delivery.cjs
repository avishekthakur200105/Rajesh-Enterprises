const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Cart.tsx', 'utf8');

// Add import
code = code.replace(
  "import { useCartStore } from '../../store/cart';",
  "import { useCartStore } from '../../store/cart';\nimport { useSettingsStore } from '../../store/settings';"
);

// Get settings
const searchStr = `  const { subtotal, discount, total } = getSummary();
  const navigate = useNavigate();`;

const replacementStr = `  const { subtotal, discount } = getSummary();
  const navigate = useNavigate();
  const { settings } = useSettingsStore();

  let deliveryCharge = settings?.deliveryCharge || 150;
  if (settings?.deliveryDiscountThreshold && subtotal >= settings.deliveryDiscountThreshold && settings.discountedDeliveryCharge !== undefined) {
    deliveryCharge = settings.discountedDeliveryCharge;
  }
  const total = subtotal + deliveryCharge;`;

code = code.replace(searchStr, replacementStr);

// UI Update
const uiSearch = `                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge</span>
                  <span className="text-stone-400">Calculated at checkout</span>
                </div>`;
const uiReplacement = `                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge</span>
                  <span className="font-medium text-stone-900">{formatCurrency(deliveryCharge)}</span>
                </div>`;

code = code.replace(uiSearch, uiReplacement);

fs.writeFileSync('src/pages/storefront/Cart.tsx', code);
