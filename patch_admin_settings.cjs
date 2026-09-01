const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/settings/index.tsx', 'utf8');

// 1. Update states
code = code.replace(
  "const [saving, setSaving] = useState(false);",
  "const [savingStore, setSavingStore] = useState(false);\n  const [savingOwner, setSavingOwner] = useState(false);"
);

// 2. Split handleSave
const searchHandleSave = `  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Save Owner Profile
      const { data: existingOwner } = await supabase.from('categories').select('id').eq('slug', '_owner_profile_').single();
      const ownerPayload = {
        name: ownerData.name,
        slug: '_owner_profile_',
        image_url: ownerData.image_url,
        description: ownerData.description,
        is_active: false
      };
      
      if (existingOwner && existingOwner.id) {
        await supabase.from('categories').update(ownerPayload).eq('id', existingOwner.id);
      } else {
        await supabase.from('categories').insert([ownerPayload]);
      }

      // 2. Save Store Settings
      const { data: existingStore } = await supabase.from('categories').select('id').eq('slug', '_store_settings_').single();
      const storePayload = {
        name: 'Store Settings',
        slug: '_store_settings_',
        description: JSON.stringify(storeData),
        is_active: false
      };

      if (existingStore && existingStore.id) {
        await supabase.from('categories').update(storePayload).eq('id', existingStore.id);
      } else {
        await supabase.from('categories').insert([storePayload]);
      }

      // Refresh global store settings
      await fetchSettings();

      alert("Settings saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save. Make sure your database is connected.");
    } finally {
      setSaving(false);
    }
  };`;

const newHandles = `  const handleSaveStore = async () => {
    setSavingStore(true);
    try {
      const { data: existingStore } = await supabase.from('categories').select('id').eq('slug', '_store_settings_').single();
      const storePayload = {
        name: 'Store Settings',
        slug: '_store_settings_',
        description: JSON.stringify(storeData),
        is_active: false
      };

      if (existingStore && existingStore.id) {
        await supabase.from('categories').update(storePayload).eq('id', existingStore.id);
      } else {
        await supabase.from('categories').insert([storePayload]);
      }

      await fetchSettings();
      alert("Settings saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save. Make sure your database is connected.");
    } finally {
      setSavingStore(false);
    }
  };

  const handleSaveOwner = async () => {
    setSavingOwner(true);
    try {
      const { data: existingOwner } = await supabase.from('categories').select('id').eq('slug', '_owner_profile_').single();
      const ownerPayload = {
        name: ownerData.name,
        slug: '_owner_profile_',
        image_url: ownerData.image_url,
        description: ownerData.description,
        is_active: false
      };
      
      if (existingOwner && existingOwner.id) {
        await supabase.from('categories').update(ownerPayload).eq('id', existingOwner.id);
      } else {
        await supabase.from('categories').insert([ownerPayload]);
      }
      
      alert("Owner profile saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save. Make sure your database is connected.");
    } finally {
      setSavingOwner(false);
    }
  };`;

code = code.replace(searchHandleSave, newHandles);

// 3. Remove main save button
const mainHeaderSearch = `      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Store Settings</h2>
        <button 
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>`;
const mainHeaderReplace = `      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Store Settings</h2>
      </div>`;
code = code.replace(mainHeaderSearch, mainHeaderReplace);

// 4. Update General Information Header
const generalHeaderSearch = `          <div className="flex items-center gap-2 mb-4">
            <Store className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium text-stone-900">General Information</h3>
          </div>`;
const generalHeaderReplace = `          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium text-stone-900">General Information</h3>
            </div>
            <button 
              onClick={handleSaveStore}
              disabled={savingStore || loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" /> {savingStore ? 'Saving...' : 'Save Changes'}
            </button>
          </div>`;
code = code.replace(generalHeaderSearch, generalHeaderReplace);

// 5. Update Delivery Settings Header
const deliveryHeaderSearch = `          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium text-stone-900">Delivery Settings</h3>
          </div>`;
const deliveryHeaderReplace = `          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium text-stone-900">Delivery Settings</h3>
            </div>
            <button 
              onClick={handleSaveStore}
              disabled={savingStore || loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" /> {savingStore ? 'Saving...' : 'Save Changes'}
            </button>
          </div>`;
code = code.replace(deliveryHeaderSearch, deliveryHeaderReplace);

// 6. Update Owner Profile Header
const ownerHeaderSearch = `          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium text-stone-900">Owner Profile (Home Page)</h3>
          </div>`;
const ownerHeaderReplace = `          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium text-stone-900">Owner Profile (Home Page)</h3>
            </div>
            <button 
              onClick={handleSaveOwner}
              disabled={savingOwner || loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" /> {savingOwner ? 'Saving...' : 'Save Changes'}
            </button>
          </div>`;
code = code.replace(ownerHeaderSearch, ownerHeaderReplace);

fs.writeFileSync('src/pages/admin/settings/index.tsx', code);
