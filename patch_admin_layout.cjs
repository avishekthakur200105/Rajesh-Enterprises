const fs = require('fs');
let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

// 1. Add useState, Menu, X import
code = code.replace(
  "import { useEffect } from 'react';",
  "import { useEffect, useState } from 'react';\nimport { Menu, X } from 'lucide-react';"
);

// 2. Add state
code = code.replace(
  "const location = useLocation();",
  "const location = useLocation();\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);"
);

// 3. Update sidebar classes to handle mobile
// Find: <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
code = code.replace(
  /<aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">/,
  `{/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={\`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 \${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}\`}>`
);

// 4. Update the close behavior on mobile link click
code = code.replace(
  /to=\{item\.path\}/g,
  "to={item.path}\n                  onClick={() => setMobileMenuOpen(false)}"
);

// 5. Update header to include hamburger menu
code = code.replace(
  /<header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8">/,
  `<header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="mr-4 md:hidden text-stone-500 hover:text-stone-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-stone-800 hidden sm:block">`
);

code = code.replace(
  /{navItems\.find\(i => i\.path === location\.pathname\)\?\.name \|\| 'Admin Panel'}/,
  "{navItems.find(i => i.path === location.pathname)?.name || 'Admin Panel'}"
);

code = code.replace(
  /<\/h1>/,
  "</h1>\n          </div>"
);

// We need to remove the extra h1 closing tags if we messed up.
// Let's use a simpler replace strategy for the header:

fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
