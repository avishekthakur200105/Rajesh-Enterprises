import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  profile: any | null;
  isAdmin: boolean;
  setUser: (user: User | null, profile?: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  isAdmin: false,
  setUser: (user, profile) => set({ 
    user, 
    profile, 
    isAdmin: profile?.role?.toLowerCase() === 'admin' || profile?.role?.toLowerCase() === 'super_admin' || profile?.role?.toLowerCase() === 'manager' || user?.email === 'abhishek20010531@gmail.com'
  }),
  logout: () => set({ user: null, profile: null, isAdmin: false }),
}));
