import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Package
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        if (!import.meta.env.VITE_SUPABASE_URL) return;
        
        // Fetch stats (simplified for demo)
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          supabase.from('orders').select('total, id'),
          supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
          supabase.from('products').select('id', { count: 'exact' })
        ]);

        const totalSales = ordersRes.data?.reduce((acc, curr) => acc + Number(curr.total), 0) || 0;
        const totalOrders = ordersRes.data?.length || 0;
        
        setStats({
          totalSales,
          totalOrders,
          totalCustomers: usersRes.count || 0,
          totalProducts: productsRes.count || 0
        });

        // Fetch recent orders
        const { data: recent } = await supabase
          .from('orders')
          .select('*, profiles(full_name)')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recent) setRecentOrders(recent);

      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  const statCards = [
    { name: 'Total Sales', value: formatCurrency(stats.totalSales), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Customers', value: stats.totalCustomers.toString(), icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Total Products', value: stats.totalProducts.toString(), icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 flex items-center">
            <div className={`p-4 rounded-lg ${stat.bg} ${stat.color} mr-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">{stat.name}</p>
              <h3 className="text-2xl font-bold text-stone-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-stone-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-stone-800">Recent Orders</h3>
            <a href="/admin/orders" className="text-sm text-green-600 hover:text-green-800 font-medium">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-200">
                {recentOrders.length === 0 ? (
                   <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-stone-500">No orders found.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{order.order_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{order.profiles?.full_name || 'Guest'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{formatCurrency(order.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Overview Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 flex flex-col">
           <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-4">Sales Overview</h3>
           <div className="flex-1 flex flex-col items-center justify-center text-stone-400 bg-stone-50 rounded-lg border border-dashed border-stone-200">
              <TrendingUp className="h-12 w-12 mb-2 text-stone-300" />
              <p className="text-sm">Chart Data Pending</p>
           </div>
        </div>
      </div>
      
    </div>
  );
}
