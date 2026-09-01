const fs = require('fs');
let code = fs.readFileSync('src/layouts/StorefrontLayout.tsx', 'utf8');

// 1. imports
code = code.replace(
  "import { useEffect } from 'react';",
  "import { useEffect, useState } from 'react';\nimport { useNavigate } from 'react-router-dom';"
);
code = code.replace(
  "import { ShoppingCart, User, Search, Menu, Sprout } from 'lucide-react';",
  "import { ShoppingCart, User, Search, Menu, Sprout, X } from 'lucide-react';"
);

// 2. state
code = code.replace(
  "const { settings, fetchSettings } = useSettingsStore();",
  "const { settings, fetchSettings } = useSettingsStore();\n  const [isSearchOpen, setIsSearchOpen] = useState(false);\n  const [searchQuery, setSearchQuery] = useState('');\n  const navigate = useNavigate();\n\n  const handleSearchSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    if (searchQuery.trim()) {\n      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);\n      setIsSearchOpen(false);\n    }\n  };"
);

// 3. Update the search button onClick
code = code.replace(
  "<button className=\"text-stone-600 hover:text-green-700\">",
  "<button onClick={() => setIsSearchOpen(!isSearchOpen)} className=\"text-stone-600 hover:text-green-700\">"
);

// 4. Add the search bar below the header row
const searchBarHtml = `
          {isSearchOpen && (
            <div className="border-t border-stone-100 py-3 px-4 md:px-0 animate-in fade-in slide-in-from-top-2">
              <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto flex items-center">
                <Search className="absolute left-3 text-stone-400 h-5 w-5" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 text-stone-400 hover:text-stone-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>
            </div>
          )}
`;

code = code.replace(
  /<\/div>\s*<\/div>\s*<\/header>/,
  "</div>\n" + searchBarHtml + "        </div>\n      </header>"
);

fs.writeFileSync('src/layouts/StorefrontLayout.tsx', code);
