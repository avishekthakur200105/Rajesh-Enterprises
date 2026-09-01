const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/tips/index.tsx', 'utf8');

// Modal container
code = code.replace(
  '<div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">',
  '<div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden m-4">'
);

// We need the form to be scrollable if it exceeds max height.
// Currently: <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
code = code.replace(
  '<form onSubmit={handleAddSubmit} className="p-6 space-y-4">',
  '<form onSubmit={handleAddSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">'
);

// Reduce textarea rows from 3 to 2 to save vertical space
code = code.replace(/rows=\{3\}/g, 'rows={2}');

fs.writeFileSync('src/pages/admin/tips/index.tsx', code);
