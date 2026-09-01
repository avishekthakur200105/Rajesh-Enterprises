const fs = require('fs');

// 1. Patch Admin Tips
let adminCode = fs.readFileSync('src/pages/admin/tips/index.tsx', 'utf8');

adminCode = adminCode.replace(
  "title: '',\n    content: '',\n    image_url: ''",
  "title: '',\n    title_np: '',\n    content: '',\n    content_np: '',\n    image_url: ''"
);

adminCode = adminCode.replace(
  "title: tip.title || '',\n      content: tip.content || '',\n      image_url: tip.image_url || ''",
  "title: tip.title || '',\n      title_np: tip.title_np || '',\n      content: tip.content || '',\n      content_np: tip.content_np || '',\n      image_url: tip.image_url || ''"
);

adminCode = adminCode.replace(
  "title: formData.title,\n      content: formData.content,\n      image_url: formData.image_url",
  "title: formData.title,\n      title_np: formData.title_np,\n      content: formData.content,\n      content_np: formData.content_np,\n      image_url: formData.image_url"
);

adminCode = adminCode.replace(
  "setFormData({ title: '', content: '', image_url: '' });",
  "setFormData({ title: '', title_np: '', content: '', content_np: '', image_url: '' });"
);

// Add fields to form
const newFormFields = `              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title (English)*</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title (Nepali)</label>
                <input type="text" name="title_np" value={formData.title_np} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
                <input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://..." className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Tip Content (English)*</label>
                <textarea required name="content" rows={3} value={formData.content} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Tip Content (Nepali)</label>
                <textarea name="content_np" rows={3} value={formData.content_np} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
              </div>`;

adminCode = adminCode.replace(
  /<form onSubmit=\{handleAddSubmit\} className="p-6 space-y-4">[\s\S]*?<div className="pt-4 flex justify-end gap-3 border-t border-stone-200">/,
  '<form onSubmit={handleAddSubmit} className="p-6 space-y-4">\n' + newFormFields + '\n              <div className="pt-4 flex justify-end gap-3 border-t border-stone-200">'
);

fs.writeFileSync('src/pages/admin/tips/index.tsx', adminCode);

// 2. Patch Home Tips Rendering
let homeCode = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

homeCode = homeCode.replace(
  /<h3 className="text-lg font-bold text-stone-900 mb-2">\{tip\.title\}<\/h3>/g,
  '<h3 className="text-lg font-bold text-stone-900 mb-2">{lang === \'np\' && tip.title_np ? tip.title_np : tip.title}</h3>'
);

homeCode = homeCode.replace(
  /<p className="text-stone-600 text-sm flex-1">\{tip\.content\}<\/p>/g,
  '<p className="text-stone-600 text-sm flex-1">{lang === \'np\' && tip.content_np ? tip.content_np : tip.content}</p>'
);

fs.writeFileSync('src/pages/storefront/Home.tsx', homeCode);

console.log("Translation logic added to Farmer Tips.");
