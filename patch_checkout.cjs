const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Checkout.tsx', 'utf8');

code = code.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");

const search = `  if (items.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }`;

const replace = `  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, orderComplete, navigate]);

  if (items.length === 0 && !orderComplete) {
    return null;
  }`;

code = code.replace(search, replace);
fs.writeFileSync('src/pages/storefront/Checkout.tsx', code);
