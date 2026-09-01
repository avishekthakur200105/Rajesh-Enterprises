const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/Orders.tsx', 'utf8');

code = code.replace(
  "{formatCurrency(item.price)}",
  "{formatCurrency(item.unit_price)}"
);

code = code.replace(
  "{formatCurrency(item.price * item.quantity)}",
  "{formatCurrency(item.total_price || (item.unit_price * item.quantity))}"
);

fs.writeFileSync('src/pages/admin/Orders.tsx', code);
