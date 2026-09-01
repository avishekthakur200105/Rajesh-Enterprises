import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface StoreSettings {
  shopName: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  topBarText: string;
  deliveryCharge: number;
  discountedDeliveryCharge?: number;
  deliveryDiscountThreshold?: number;
}

const defaultSettings: StoreSettings = {
  shopName: "Rajesh Enterprises",
  phone: "+977 1-2345678",
  email: "info@rajeshenterprises.com",
  address: "Kathmandu, Nepal",
  description: "Your trusted partner in agriculture. Supplying top quality seeds, fertilizers, and farming equipment across Nepal.",
  topBarText: "Welcome to Rajesh Enterprises - Your Trusted Nepal Agro Pharmacy",
  deliveryCharge: 150,
  discountedDeliveryCharge: 100,
  deliveryDiscountThreshold: 5000,
};

interface SettingsState {
  settings: StoreSettings;
  loading: boolean;
  fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  loading: true,
  fetchSettings: async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        set({ loading: false });
        return;
      }
      const { data } = await supabase.from('categories').select('*').eq('slug', '_store_settings_').single();
      if (data && data.description) {
        set({ settings: { ...defaultSettings, ...JSON.parse(data.description) }, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (e) {
      set({ loading: false });
    }
  }
}));
