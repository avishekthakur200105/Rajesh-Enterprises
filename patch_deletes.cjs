const fs = require('fs');

function patchFile(file, entityName, deleteFunc) {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  
  if (code.includes('itemToDelete')) return;

  // 1. Add state
  code = code.replace(
    'const [isModalOpen, setIsModalOpen] = useState(false);',
    'const [isModalOpen, setIsModalOpen] = useState(false);\n  const [itemToDelete, setItemToDelete] = useState<any>(null);'
  );

  // 2. Remove confirm
  code = code.replace(
    /if \(!confirm\([^)]+\)\) return;/g,
    ''
  );

  // 3. Replace delete click handler
  const clickRegex = new RegExp(`onClick=\\{\\(\\) => ${deleteFunc}\\(([^)]+)\\)\\}`, 'g');
  code = code.replace(clickRegex, `onClick={() => setItemToDelete($1)}`);

  // 4. Add the modal before the final </div>
  const modalCode = `
      {/* Delete Confirmation Modal */}
      {itemToDelete !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 m-4">
            <h3 className="text-lg font-bold text-stone-900 mb-2">Confirm Deletion</h3>
            <p className="text-stone-600 mb-6 text-sm">Are you sure you want to delete this ${entityName}? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md font-medium transition-colors text-sm">Cancel</button>
              <button onClick={() => { ${deleteFunc}(itemToDelete); setItemToDelete(null); }} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
`;
  
  const lastDivIndex = code.lastIndexOf('</div>');
  if (lastDivIndex !== -1) {
    code = code.substring(0, lastDivIndex) + modalCode + code.substring(lastDivIndex);
  }

  fs.writeFileSync(file, code);
  console.log(`Patched ${file}`);
}

patchFile('src/pages/admin/categories/index.tsx', 'category', 'deleteCategory');
patchFile('src/pages/admin/Products.tsx', 'product', 'deleteProduct');
patchFile('src/pages/admin/banners/index.tsx', 'banner', 'deleteBanner');
patchFile('src/pages/admin/tips/index.tsx', 'tip', 'deleteTip');
