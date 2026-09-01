const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');

// 1. Add imports
code = code.replace(
  "import { formatCurrency } from '../../lib/utils';",
  "import { formatCurrency } from '../../lib/utils';\nimport { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';\nimport { format, subDays, parseISO } from 'date-fns';"
);

// 2. Add chart data state
code = code.replace(
  "const [recentOrders, setRecentOrders] = useState<any[]>([]);",
  "const [recentOrders, setRecentOrders] = useState<any[]>([]);\n  const [chartData, setChartData] = useState<any[]>([]);"
);

// 3. Update fetch logic
const fetchSearch = `        const [ordersRes, usersRes, productsRes] = await Promise.all([
          supabase.from('orders').select('total, id'),
          supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
          supabase.from('products').select('id', { count: 'exact' })
        ]);

        const totalSales = ordersRes.data?.reduce((acc, curr) => acc + Number(curr.total), 0) || 0;
        const totalOrders = ordersRes.data?.length || 0;`;

const fetchReplace = `        const [ordersRes, usersRes, productsRes] = await Promise.all([
          supabase.from('orders').select('total, id, created_at'),
          supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
          supabase.from('products').select('id', { count: 'exact' })
        ]);

        const totalSales = ordersRes.data?.reduce((acc, curr) => acc + Number(curr.total), 0) || 0;
        const totalOrders = ordersRes.data?.length || 0;

        // Prepare chart data (last 7 days)
        if (ordersRes.data) {
          const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = subDays(new Date(), i);
            return format(d, 'MMM dd');
          }).reverse();

          const grouped = ordersRes.data.reduce((acc, order) => {
            if (!order.created_at) return acc;
            const dateStr = format(parseISO(order.created_at), 'MMM dd');
            acc[dateStr] = (acc[dateStr] || 0) + Number(order.total);
            return acc;
          }, {} as Record<string, number>);

          const chartDataFormatted = last7Days.map(date => ({
            date,
            sales: grouped[date] || 0
          }));
          
          setChartData(chartDataFormatted);
        }`;

code = code.replace(fetchSearch, fetchReplace);

// 4. Update the UI
const uiSearch = `        {/* Sales Overview Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 flex flex-col">
           <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-4">Sales Overview</h3>
           <div className="flex-1 flex flex-col items-center justify-center text-stone-400 bg-stone-50 rounded-lg border border-dashed border-stone-200">
              <TrendingUp className="h-12 w-12 mb-2 text-stone-300" />
              <p className="text-sm">Chart Data Pending</p>
           </div>
        </div>`;

const uiReplace = `        {/* Sales Overview Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 flex flex-col">
           <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-4">Sales Overview (Last 7 Days)</h3>
           <div className="flex-1 min-h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#15803d" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#15803d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#78716c', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#78716c', fontSize: 12 }}
                      tickFormatter={(value) => \`Rs.\${value}\`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [formatCurrency(value), 'Sales']}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#15803d" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-50 rounded-lg border border-dashed border-stone-200">
                  <TrendingUp className="h-12 w-12 mb-2 text-stone-300" />
                  <p className="text-sm">No sales data available</p>
                </div>
              )}
           </div>
        </div>`;

code = code.replace(uiSearch, uiReplace);

fs.writeFileSync('src/pages/admin/Dashboard.tsx', code);
