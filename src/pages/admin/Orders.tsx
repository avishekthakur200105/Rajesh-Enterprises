import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { Search, Eye, Filter, X, Truck, CheckCircle, Clock } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = async (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setLoadingDetails(true);
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*, product:products(title, image_url:product_images(url))')
        .eq('order_id', order.id);
      if (error) throw error;
      setOrderDetails(data || []);
    } catch (error) {
      console.error("Error fetching order details", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder || selectedOrder.status !== 'cancelled') return;
    if (!confirm('Are you sure you want to permanently delete this cancelled order?')) return;
    
    setUpdatingStatus(true);
    try {
      // Delete order items first due to foreign key constraints if no cascade
      await supabase.from('order_items').delete().eq('order_id', selectedOrder.id);
      
      const { error } = await supabase.from('orders').delete().eq('id', selectedOrder.id);
      if (error) throw error;
      
      setIsModalOpen(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order", error);
      alert("Failed to delete order");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', selectedOrder.id);
      if (error) throw error;
      setSelectedOrder({ ...selectedOrder, status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status", error);
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const fetchOrders = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) return;
      
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shipping_address?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'shipped': 
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'processing': 
      case 'packed': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Orders</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Search by order ID or name..."
              className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md leading-5 bg-white placeholder-stone-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 border border-stone-300 shadow-sm text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50">
              <Filter className="h-4 w-4 mr-2 text-stone-400" />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Payment</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-stone-500">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-stone-500">No orders found.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{order.order_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">
                      <div>{order.shipping_address?.fullName || order.profiles?.full_name}</div>
                      <div className="text-xs text-stone-500">{order.shipping_address?.municipality}, {order.shipping_address?.district}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                        order.payment_status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-stone-100 text-stone-800'
                       }`}>
                         {order.payment_status?.toUpperCase() || 'PENDING'}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleViewOrder(order)} className="text-blue-600 hover:text-blue-900 p-1 flex items-center justify-end w-full">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
      </div>
      
      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
              <h3 className="text-lg font-bold text-stone-800">Order Details - {selectedOrder.order_number}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-semibold text-stone-800 mb-2">Customer Info</h4>
                  <p className="text-sm text-stone-600">{selectedOrder.profiles?.full_name || 'N/A'}</p>
                  <p className="text-sm text-stone-600">{selectedOrder.profiles?.email || 'N/A'}</p>
                  <p className="text-sm text-stone-600 mt-2 font-medium">Shipping Address:</p>
                  <p className="text-sm text-stone-600">{selectedOrder.shipping_address?.fullName}</p>
                  <p className="text-sm text-stone-600">{selectedOrder.shipping_address?.addressLine1}</p>
                  <p className="text-sm text-stone-600">{selectedOrder.shipping_address?.addressLine2}</p>
                  <p className="text-sm text-stone-600">{selectedOrder.shipping_address?.municipality}, {selectedOrder.shipping_address?.district}</p>
                  <p className="text-sm text-stone-600">{selectedOrder.shipping_address?.phone}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-800 mb-2">Order Summary</h4>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">Status:</span>
                    <span className={`font-semibold ${getStatusColor(selectedOrder.status)} px-2 py-0.5 rounded-full text-xs`}>
                      {selectedOrder.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">Payment:</span>
                    <span className="font-medium">{selectedOrder.payment_status?.toUpperCase()} ({selectedOrder.payment_method})</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1 mt-4">
                    <span className="text-stone-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">Shipping:</span>
                    <span className="font-medium">{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-stone-200">
                    <span className="text-stone-800">Total:</span>
                    <span className="text-green-700">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-stone-800 mb-4">Items</h4>
              {loadingDetails ? (
                <div className="text-center py-4 text-stone-500 text-sm">Loading items...</div>
              ) : (
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-stone-200">
                    <thead className="bg-stone-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-stone-500 uppercase">Product</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-stone-500 uppercase">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-stone-500 uppercase">Price</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-stone-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-stone-200">
                      {orderDetails.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-900 flex items-center gap-3">
                            <div className="h-10 w-10 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                              {item.product?.image_url?.[0]?.url ? (
                                <img src={item.product.image_url[0].url} alt="" className="h-full w-full object-cover" />
                              ) : null}
                            </div>
                            <div>
                              <p className="font-medium">{item.product?.title || 'Unknown Product'}</p>
                              {item.variant_name && <p className="text-xs text-stone-500">{item.variant_name}</p>}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-500 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-900 text-right">{formatCurrency(item.unit_price)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-stone-900 text-right">{formatCurrency(item.total_price || (item.unit_price * item.quantity))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-stone-700">Update Status:</span>
                <select 
                  className="text-sm border border-stone-300 rounded-md py-1.5 px-3 bg-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  disabled={updatingStatus}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {updatingStatus && <span className="text-xs text-stone-500 ml-2">Saving...</span>}
              </div>
              <div className="flex space-x-2">
                {selectedOrder.status === 'cancelled' && (
                  <button 
                    onClick={handleDeleteOrder} 
                    disabled={updatingStatus}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    Delete Order
                  </button>
                )}
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-stone-200 text-stone-800 rounded-md text-sm font-medium hover:bg-stone-300 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
