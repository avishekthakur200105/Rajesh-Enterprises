const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/tips/index.tsx', 'utf8');

code = code.replace(/value=\{formData\.title\}/g, 'value={formData.title || \'\'}');
code = code.replace(/value=\{formData\.title_np\}/g, 'value={formData.title_np || \'\'}');
code = code.replace(/value=\{formData\.content\}/g, 'value={formData.content || \'\'}');
code = code.replace(/value=\{formData\.content_np\}/g, 'value={formData.content_np || \'\'}');
code = code.replace(/value=\{formData\.image_url\}/g, 'value={formData.image_url || \'\'}');

fs.writeFileSync('src/pages/admin/tips/index.tsx', code);
console.log("Inputs fixed.");
