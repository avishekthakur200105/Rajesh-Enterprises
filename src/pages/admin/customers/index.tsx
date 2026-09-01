import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Search } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) return;
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Customers</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </div>
            <input type="text" placeholder="Search customers..." className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Password</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Joined</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Last Login</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-stone-500">Loading customers...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-stone-500">No customers found.</td></tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{customer.full_name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{customer.email || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-400 font-mono">••••••••</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {customer.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{customer.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{new Date(customer.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{customer.last_login ? new Date(customer.last_login).toLocaleString() : 'Never'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
