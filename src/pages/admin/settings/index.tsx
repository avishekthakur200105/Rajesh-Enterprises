import { useState, useEffect } from 'react';
import { Save, Store, User, Upload, Trash2, Truck } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { StoreSettings, useSettingsStore } from '../../../store/settings';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [savingStore, setSavingStore] = useState(false);
  const [savingOwner, setSavingOwner] = useState(false);
  
  const [ownerData, setOwnerData] = useState({
    name: 'Rajesh Sharma',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    description: 'Welcome to our store! We provide the best quality products for our local farmers.'
  });

  const [storeData, setStoreData] = useState<StoreSettings>({
    shopName: "Rajesh Enterprises",
    phone: "+977 1-2345678",
    email: "info@rajeshenterprises.com",
    address: "Kathmandu, Nepal",
    description: "Your trusted partner in agriculture.",
    topBarText: "Welcome to Rajesh Enterprises"
  });

  const { fetchSettings } = useSettingsStore();

  useEffect(() => {
    async function fetchData() {
      try {
        if (!import.meta.env.VITE_SUPABASE_URL) return;
        
        // Fetch owner
        const { data: owner } = await supabase.from('categories').select('*').eq('slug', '_owner_profile_').single();
        if (owner) {
          setOwnerData({
            name: owner.name || '',
            image_url: owner.image_url || '',
            description: owner.description || ''
          });
        }

        // Fetch store settings
        const { data: store } = await supabase.from('categories').select('*').eq('slug', '_store_settings_').single();
        if (store && store.description) {
          setStoreData(prev => ({ ...prev, ...JSON.parse(store.description) }));
        }

      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSaveStore = async () => {
    setSavingStore(true);
    try {
      const { data: existingStore } = await supabase.from('categories').select('id').eq('slug', '_store_settings_').single();
      const storePayload = {
        name: 'Store Settings',
        slug: '_store_settings_',
        description: JSON.stringify(storeData),
        is_active: true
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
        is_active: true
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
  };

  
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


  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Store Settings</h2>
      </div>

      {/* Store Identity Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-200">
          <div className="flex justify-between items-center mb-4">
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
          </div>
          <p className="text-sm text-stone-500 mb-6">Update your store's name, contact details, and footer text.</p>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Shop Name</label>
              <input 
                type="text" 
                name="shopName"
                value={storeData.shopName || ''} 
                onChange={handleStoreChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Top Bar Announcement Text</label>
              <input 
                type="text" 
                name="topBarText"
                value={storeData.topBarText || ''} 
                onChange={handleStoreChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
              <input 
                type="text" 
                name="phone"
                value={storeData.phone || ''} 
                onChange={handleStoreChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={storeData.email || ''} 
                onChange={handleStoreChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Physical Address</label>
              <input 
                type="text" 
                name="address"
                value={storeData.address || ''} 
                onChange={handleStoreChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Footer Description</label>
              <textarea 
                rows={3} 
                name="description"
                value={storeData.description || ''}
                onChange={handleStoreChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-200">
          <div className="flex justify-between items-center mb-4">
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
          </div>
          <p className="text-sm text-stone-500 mb-6">Configure base delivery charges and optional discounted rates.</p>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Standard Delivery Charge (Rs.)</label>
              <input 
                type="number" 
                name="deliveryCharge"
                value={storeData.deliveryCharge || 0} 
                onChange={(e) => setStoreData(prev => ({ ...prev, deliveryCharge: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Discounted Delivery Charge (Rs.)</label>
              <input 
                type="number" 
                name="discountedDeliveryCharge"
                value={storeData.discountedDeliveryCharge || 0} 
                onChange={(e) => setStoreData(prev => ({ ...prev, discountedDeliveryCharge: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Subtotal Threshold for Discounted Delivery (Rs.)</label>
              <input 
                type="number" 
                name="deliveryDiscountThreshold"
                value={storeData.deliveryDiscountThreshold || 0} 
                onChange={(e) => setStoreData(prev => ({ ...prev, deliveryDiscountThreshold: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
              <p className="text-xs text-stone-500 mt-1">If the subtotal exceeds this amount, the discounted delivery charge will be applied.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-200">
          <div className="flex justify-between items-center mb-4">
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
          </div>
          <p className="text-sm text-stone-500 mb-6">This information will be displayed at the top of the home page.</p>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Owner Name</label>
              <input 
                type="text" 
                value={ownerData.name || ''} 
                onChange={(e) => setOwnerData({...ownerData, name: e.target.value})}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>
            
            <div className="sm:col-span-2">
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

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Short Description</label>
              <textarea 
                rows={3} 
                value={ownerData.description || ''}
                onChange={(e) => setOwnerData({...ownerData, description: e.target.value})}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
