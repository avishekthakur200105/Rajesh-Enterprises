const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductDetail.tsx', 'utf8');

if (!code.includes("useAuthStore")) {
  code = code.replace(
    "import { useCartStore } from '../../store/cart';",
    "import { useCartStore } from '../../store/cart';\nimport { useAuthStore } from '../../store/auth';"
  );
  
  code = code.replace(
    "const { addItem } = useCartStore();",
    "const { addItem } = useCartStore();\n  const { isAdmin } = useAuthStore();"
  );
}

const actionsSearch = `{/* Actions */}
            <div className="bg-stone-50 p-4 sm:p-5 rounded-xl border border-stone-100 mb-6 max-w-lg">`;

const actionsReplace = `{/* Actions */}
            {!isAdmin ? (
              <div className="bg-orange-50 p-4 sm:p-5 rounded-xl border border-orange-100 mb-6 max-w-lg">
                <p className="text-orange-800 text-sm font-medium">Purchasing is currently restricted to administrators only.</p>
              </div>
            ) : (
            <div className="bg-stone-50 p-4 sm:p-5 rounded-xl border border-stone-100 mb-6 max-w-lg">`;

const actionsEndSearch = `              </div>
            </div>

            {/* Description */}`;

const actionsEndReplace = `              </div>
            </div>
            )}

            {/* Description */}`;

code = code.replace(actionsSearch, actionsReplace);
code = code.replace(actionsEndSearch, actionsEndReplace);

fs.writeFileSync('src/pages/storefront/ProductDetail.tsx', code);
