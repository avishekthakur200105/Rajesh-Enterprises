const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

const targetSection = `{/* Categories Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Seeds', 'Fertilizers', 'Tools', 'Pesticides'].map((cat, i) => (
              <Link key={i} to={\`/shop?category=\${cat.toLowerCase()}\`} className="bg-green-50 rounded-xl p-8 text-center hover:bg-green-100 transition-colors group">
                <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <Sprout className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-stone-800">{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>`;

code = code.replace(targetSection, '');
fs.writeFileSync('src/pages/storefront/Home.tsx', code);
