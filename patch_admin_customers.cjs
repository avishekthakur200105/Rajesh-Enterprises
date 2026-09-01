const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/customers/index.tsx', 'utf8');

// Table Headers
code = code.replace(
  '<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>',
  '<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>\n                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Email</th>\n                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Password</th>'
);

code = code.replace(
  '<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Joined</th>',
  '<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Joined</th>\n                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Last Login</th>'
);

// Table rows
// td 1: Name
code = code.replace(
  '<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{customer.full_name || \'N/A\'}</td>',
  '<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{customer.full_name || \'N/A\'}</td>\n                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{customer.email || \'N/A\'}</td>\n                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-400 font-mono">••••••••</td>'
);

// colSpan increase from 4 to 7
code = code.replace(/colSpan=\{4\}/g, 'colSpan={7}');

// td last: Joined -> Last login
code = code.replace(
  '<td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{new Date(customer.created_at).toLocaleDateString()}</td>',
  '<td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{new Date(customer.created_at).toLocaleDateString()}</td>\n                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{customer.last_login ? new Date(customer.last_login).toLocaleString() : \'Never\'}</td>'
);

fs.writeFileSync('src/pages/admin/customers/index.tsx', code);
