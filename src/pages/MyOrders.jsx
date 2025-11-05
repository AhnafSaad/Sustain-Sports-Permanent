import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, Hash, DollarSign, Info, ArrowLeft, Leaf, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem('sustainSportsUserOrders') || '[]');
      // --- MODIFIED LINE: Filter by user.email instead of user.id ---
      const userOrders = allOrders.filter(order => order.userId === user.email);
      setOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date))); // Sort by most recent
    }
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 text-center">
        <Leaf className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">Please log in to view your orders.</p>
        <Button onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
    );
  }

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/my-orders/${orderId}`);
  };
  
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
        >
          {/* --- MODIFIED LINE: Link to /profile instead of /my-account --- */}
          <Link to="/profile">
            <Button variant="outline" className="text-green-700 border-green-700 hover:bg-green-100 w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Account
            </Button>
          </Link>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              type="text"
              placeholder="Search orders by ID or item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-10"
        >
            <ShoppingBag className="w-16 h-16 text-emerald-600 mx-auto mb-4 animate-bounce" />
            <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
            <p className="text-lg text-gray-700 mt-2">Track your sustainable purchases and order history.</p>
        </motion.div>

        {filteredOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-10"
          >
            <div className="w-48 h-48 mx-auto mb-6 text-gray-400">
                <img  alt="No orders found illustration" src="https://images.unsplash.com/photo-1698488005250-6eeb339499f0" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{searchTerm ? "No Orders Match Your Search" : "No Orders Yet!"}</h2>
            <p className="text-gray-500 mb-6">{searchTerm ? "Try a different search term." : "Looks like you haven't placed any orders. Time to explore our eco-friendly gear!"}</p>
            <Link to="/products">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Shop Now
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="leaf-shadow-hover overflow-hidden transition-all duration-300 hover:border-green-400">
                  <CardHeader className="bg-gray-50/50 p-4 border-b">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                      <div className="mb-2 sm:mb-0">
                        <CardTitle className="text-lg font-semibold text-green-700 flex items-center">
                          <Hash className="w-5 h-5 mr-2" /> Order ID: {order.id}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1.5" /> Placed on: {new Date(order.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="text-sm px-3 py-1 self-start sm:self-center">
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                      <span className="font-medium">Total:</span>
                      <span className="ml-1 font-semibold">${order.total.toFixed(2)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1.5">Items:</p>
                      <ul className="list-disc list-inside pl-1 space-y-1 text-sm text-gray-600">
                        {order.items.map((item, idx) => (
                          <li key={idx}>{item.name} (x{item.quantity})</li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(order.id)} className="text-green-600 border-green-600 hover:bg-green-50">
                        <Info className="w-4 h-4 mr-1.5" /> View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;