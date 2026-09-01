const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/Orders.tsx', 'utf8');

// Add states
code = code.replace(
  "const [searchTerm, setSearchTerm] = useState('');",
  `const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);`
);

// Add fetchOrderDetails and updateOrderStatus
code = code.replace(
  "const fetchOrders = async () => {",
  `const handleViewOrder = async (order: any) => {
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

  const fetchOrders = async () => {`
);

// Replace Eye button
code = code.replace(
  '<button className="text-blue-600 hover:text-blue-900 p-1 flex items-center justify-end w-full">',
  '<button onClick={() => handleViewOrder(order)} className="text-blue-600 hover:text-blue-900 p-1 flex items-center justify-end w-full">'
);

// Add imports for Modal icons
code = code.replace(
  "import { Search, Eye, Filter } from 'lucide-react';",
  "import { Search, Eye, Filter, X, Truck, CheckCircle, Clock } from 'lucide-react';"
);

// Add Modal at the end
code = code.replace(
  "    </div>\n  );\n}",
  `      
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
                    <span className={\`font-semibold \${getStatusColor(selectedOrder.status)} px-2 py-0.5 rounded-full text-xs\`}>
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
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-900 text-right">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-stone-900 text-right">{formatCurrency(item.price * item.quantity)}</td>
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
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-stone-200 text-stone-800 rounded-md text-sm font-medium hover:bg-stone-300 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`
);

fs.writeFileSync('src/pages/admin/Orders.tsx', code);
