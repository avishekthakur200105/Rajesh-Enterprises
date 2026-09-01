const fs = require('fs');
let code = fs.readFileSync('src/layouts/StorefrontLayout.tsx', 'utf8');

const importSearch = "import { useEffect, useState } from 'react';";
const importReplace = "import { useEffect, useState } from 'react';"; // already there

// Add state
const stateSearch = `  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');`;
const stateReplace = `  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);`;

code = code.replace(stateSearch, stateReplace);

// Update button
const btnSearch = `              <button className="md:hidden text-stone-600 hover:text-green-700">
                <Menu className="h-6 w-6" />
              </button>`;
const btnReplace = `              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-stone-600 hover:text-green-700"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>`;

code = code.replace(btnSearch, btnReplace);

// Add mobile menu content
const menuSearch = `          {isSearchOpen && (`;
const menuReplace = `          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-stone-100 bg-white absolute w-full z-40 shadow-md">
              <div className="px-4 pt-2 pb-4 space-y-1">
                <Link 
                  to="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-green-700 hover:bg-green-50"
                >
                  Home
                </Link>
                <Link 
                  to="/shop" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-green-700 hover:bg-green-50"
                >
                  Shop
                </Link>
                {user ? (
                  <Link 
                    to="/account" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-green-700 hover:bg-green-50"
                  >
                    My Account
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-green-700 hover:bg-green-50"
                  >
                    Login
                  </Link>
                )}
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-green-700 hover:bg-green-50"
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>
          )}

          {isSearchOpen && (`;

code = code.replace(menuSearch, menuReplace);

fs.writeFileSync('src/layouts/StorefrontLayout.tsx', code);
