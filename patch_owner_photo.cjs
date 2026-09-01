const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/settings/index.tsx', 'utf8');

// 1. Add ImageUpload component logic and lucide icons
code = code.replace(
  "import { Save, Store, User } from 'lucide-react';",
  "import { Save, Store, User, Upload, Trash2 } from 'lucide-react';"
);

// 2. Add handleImageUpload function inside the component
const imageUploadLogic = `
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setOwnerData({ ...ownerData, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setOwnerData({ ...ownerData, image_url: '' });
  };
`;

code = code.replace(
  "const handleStoreChange =",
  imageUploadLogic + "\n\n  const handleStoreChange ="
);

// 3. Replace the Photo Image URL input section
const imageSectionRegex = /<div className="sm:col-span-2">\s*<label className="block text-sm font-medium text-stone-700 mb-1">Photo Image URL<\/label>[\s\S]*?(?=<div className="sm:col-span-2">\s*<label className="block text-sm font-medium text-stone-700 mb-1">Short Description)/;

const newImageSection = `<div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Owner Photo</label>
              
              <div className="mt-2 flex items-center space-x-6">
                {ownerData.image_url ? (
                  <div className="relative group">
                    <img src={ownerData.image_url} alt="Owner Preview" className="h-24 w-24 rounded-full object-cover border-2 border-green-500 shadow-sm" />
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-6 w-6 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-400 shadow-sm">
                    <User className="h-10 w-10" />
                  </div>
                )}
                
                <div className="flex flex-col space-y-2">
                  <label className="cursor-pointer bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 px-4 py-2 rounded-md font-medium text-sm flex items-center transition-colors shadow-sm">
                    <Upload className="h-4 w-4 mr-2" /> Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {ownerData.image_url && (
                    <button type="button" onClick={removeImage} className="text-red-600 hover:text-red-800 text-sm font-medium text-left">
                      Remove photo
                    </button>
                  )}
                  <p className="text-xs text-stone-500">JPG, PNG, GIF up to 2MB.</p>
                </div>
              </div>
            </div>

            `;

code = code.replace(imageSectionRegex, newImageSection);

fs.writeFileSync('src/pages/admin/settings/index.tsx', code);
console.log("Patched settings photo upload");
