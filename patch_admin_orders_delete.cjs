const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/Orders.tsx', 'utf8');

// 1. Add handleDeleteOrder function
const handleDeleteFunction = `  const handleDeleteOrder = async () => {
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

  const handleUpdateStatus = async (status: string) => {`;

code = code.replace("  const handleUpdateStatus = async (status: string) => {", handleDeleteFunction);

// 2. Add Delete button in the modal next to Close button
const closeButtonSearch = `              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-stone-200 text-stone-800 rounded-md text-sm font-medium hover:bg-stone-300 transition-colors">
                Close
              </button>`;

const closeButtonReplace = `              <div className="flex space-x-2">
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
              </div>`;

code = code.replace(closeButtonSearch, closeButtonReplace);

fs.writeFileSync('src/pages/admin/Orders.tsx', code);
