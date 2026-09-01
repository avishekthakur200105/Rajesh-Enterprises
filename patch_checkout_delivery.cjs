const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Checkout.tsx', 'utf8');

// Add import
code = code.replace(
  "import { useAuthStore } from '../../store/auth';",
  "import { useAuthStore } from '../../store/auth';\nimport { useSettingsStore } from '../../store/settings';"
);

// Get settings
const searchStr = `  const navigate = useNavigate();
  const { subtotal } = getSummary();
  const [deliveryCharge] = useState(150); // Hardcoded for demo`;

const replacementStr = `  const navigate = useNavigate();
  const { subtotal } = getSummary();
  
  const { settings } = useSettingsStore();
  let deliveryCharge = settings?.deliveryCharge || 150;
  
  if (settings?.deliveryDiscountThreshold && subtotal >= settings.deliveryDiscountThreshold && settings.discountedDeliveryCharge !== undefined) {
    deliveryCharge = settings.discountedDeliveryCharge;
  }
`;

code = code.replace(searchStr, replacementStr);

fs.writeFileSync('src/pages/storefront/Checkout.tsx', code);
