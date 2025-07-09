import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';

interface StockItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  current_stock: number;
  min_stock_level: number;
  max_stock_level: number;
  supplier_name: string;
  cost_price: number;
  last_restocked: string;
}

const AdminStock: React.FC = () => {
  const { isAdmin } = useAuth();
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'low' | 'out' | 'normal'>('all');

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stock');
      setStock(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stock data');
      toast.error('Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (itemId: number, quantity: number, reason: string) => {
    try {
      await api.post(`/admin/stock/${itemId}/update`, {
        quantity,
        reason
      });
      toast.success('Stock updated successfully');
      fetchStock();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update stock');
    }
  };

  const getStockStatus = (item: StockItem) => {
    if (item.current_stock === 0) return 'out';
    if (item.current_stock <= item.min_stock_level) return 'low';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'out': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStock = stock.filter(item => {
    const matchesSearch = 
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    const itemStatus = getStockStatus(item);
    const matchesStatus = selectedStatus === 'all' || itemStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const lowStockItems = stock.filter(item => getStockStatus(item) === 'low');
  const outOfStockItems = stock.filter(item => getStockStatus(item) === 'out');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <Icons.AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Error</h2>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Stock Management</h1>
              <p className="text-gray-600 mt-2">Monitor and manage product stock levels</p>
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
          <div className="mb-8 space-y-4">
            {outOfStockItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <Icons.AlertCircle className="text-red-500" size={24} />
                  <div>
                    <h3 className="text-red-800 font-semibold">Out of Stock Items</h3>
                    <p className="text-red-600 text-sm">
                      {outOfStockItems.length} products are currently out of stock
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {lowStockItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <Icons.AlertCircle className="text-yellow-500" size={24} />
                  <div>
                    <h3 className="text-yellow-800 font-semibold">Low Stock Alerts</h3>
                    <p className="text-yellow-600 text-sm">
                      {lowStockItems.length} products are running low on stock
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="normal">Normal Stock</option>
            </select>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredStock.length} items found
              </span>
            </div>
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Restocked</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStock.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={item.product_image || '/images/default-cake.jpg'}
                            alt={item.product_name}
                            className="h-12 w-12 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                            <div className="text-sm text-gray-500">ID: {item.product_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.current_stock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.min_stock_level}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)}`}>
                          {status === 'low' ? 'Low Stock' : status === 'out' ? 'Out of Stock' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.supplier_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(item.last_restocked).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            const quantity = prompt('Enter quantity to add:');
                            const reason = prompt('Enter reason:');
                            if (quantity && reason) {
                              handleStockUpdate(item.id, parseInt(quantity), reason);
                            }
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Update Stock
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStock; 