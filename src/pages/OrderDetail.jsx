import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// --- 1. 'XCircle' আইকনটি এখানে যোগ করুন ---
import { ArrowLeft, ShoppingCart, MapPin, CreditCard, Package, Calendar, Hash, DollarSign, HelpCircle, Leaf, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const OrderDetail = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  // --- 2. এই নতুন state-টি যোগ করুন ---
  const [isCancellationComplete, setIsCancellationComplete] = useState(false);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Access Denied",
        description: "Please log in to view order details.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const allOrders = JSON.parse(localStorage.getItem('sustainSportsUserOrders') || '[]');
    const foundOrder = allOrders.find(o => o.id === orderId && o.userId === user.email);
    
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      toast({
        title: "Order Not Found",
        description: `Could not find details for order ${orderId} or it does not belong to you.`,
        variant: "destructive",
      });
      navigate('/my-orders');
    }
    setLoading(false);
  }, [orderId, user, navigate, toast]);

  const getStatusBadgeVariant = (status) => {
    // ... (no changes) ...
    switch (status?.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const handleHelpClick = () => {
    // ... (no changes) ...
    toast({
      title: "🚧 Need Help?",
      description: "Customer support for orders isn't implemented yet. You can request this feature! 🚀",
    });
  };

  // --- 3. 'handleCancelOrder' ফাংশনটি আপডেট করুন ---
  const handleCancelOrder = () => {
    if (!order) return;
    
    if (!cancellationReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for the cancellation.",
        variant: "destructive",
      });
      return; 
    }

    try {
      const allOrders = JSON.parse(localStorage.getItem('sustainSportsUserOrders') || '[]');
      
      let updatedOrder = null;
      const updatedOrders = allOrders.map(o => {
        if (o.id === orderId) {
          updatedOrder = { 
            ...o, 
            status: 'Cancelled', 
            cancellationReason: cancellationReason 
          };
          return updatedOrder;
        }
        return o;
      });

      localStorage.setItem('sustainSportsUserOrders', JSON.stringify(updatedOrders));

      if (updatedOrder) {
        setOrder(updatedOrder);
      }
      
      setIsCancelModalOpen(false);
      setCancellationReason("");

      // --- এইখানে পরিবর্তন ---
      // toast না দেখিয়ে, নতুন state-টি true করুন
      setIsCancellationComplete(true);

    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not cancel the order. Please try again."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!order) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 text-center">
        <Leaf className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-semibold mb-2">Order Not Found</h1>
        <p className="text-gray-600 mb-4">We couldn't find the details for this order.</p>
        <Button onClick={() => navigate('/my-orders')}>Back to My Orders</Button>
      </div>
    );
  }

  // --- 4. এই নতুন উইন্ডোটি এখানে যোগ করুন ---
  if (isCancellationComplete) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="max-w-md w-full"
        >
          <Card className="text-center p-8 leaf-shadow">
            <CardHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto"
              >
                <XCircle className="w-12 h-12" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-gray-800 mt-6">Order Cancelled</CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                Your order (ID: {orderId}) has been successfully cancelled.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button onClick={() => navigate('/my-orders')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
              </Button>
              <Button variant="outline" onClick={() => navigate('/products')}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // --- আপনার আগের কোড (Order Details) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          <Link to="/my-orders">
            <Button variant="outline" className="text-green-700 border-green-700 hover:bg-green-100">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
            </Button>
          </Link>
          <Button variant="ghost" onClick={handleHelpClick} className="text-green-600 hover:text-green-700 hover:bg-green-100">
            <HelpCircle className="mr-2 h-4 w-4" /> Need Help?
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="leaf-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <CardTitle className="text-3xl font-bold text-white flex items-center">
                    <Package className="w-8 h-8 mr-3" /> Order Details
                  </CardTitle>
                  <CardDescription className="text-green-100 text-lg mt-1">
                    Order ID: {order.id}
                  </CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(order.status)} className="text-md px-4 py-2 mt-3 sm:mt-0 self-start sm:self-center">
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <InfoItem icon={Hash} label="Order ID" value={order.id} />
                  <InfoItem icon={Calendar} label="Date Placed" value={new Date(order.date).toLocaleDateString()} />
                  <InfoItem icon={DollarSign} label="Order Total" value={`$${order.total.toFixed(2)}`} />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Items in this Order ({order.items.length})</h2>
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg border">
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                        <img  
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          src={item.image} />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-700">{item.name}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>

                        {order.status === 'Delivered' && (
                          <Link to={`/products/${item.id}`}>
                            <Button variant="link" size="sm" className="p-0 h-auto text-green-600 hover:text-green-700">
                              Write a review
                            </Button>
                          </Link>
                        )}

                      </div>
                      <p className="font-semibold text-gray-800">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </section>
              
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-green-600"/> Shipping Address
                  </h2>
                  <AddressDisplay address={order.shippingAddress} />
                  <p className="mt-2 text-sm text-gray-600"><strong>Shipping Method:</strong> {order.shippingMethod}</p>
                  
                  {order.trackingNumber ? (
                    <p className="text-sm text-gray-600">
                      <strong>Tracking:</strong> 
                      <a 
                        href={`https://www.google.com/search?q=${order.trackingNumber}`} 
                        className="text-green-600 hover:underline ml-1"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {order.trackingNumber}
                      </a>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500"><strong>Tracking:</strong> Not yet available</p>
                  )}

                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-green-600"/> Billing Information
                  </h2>
                  <AddressDisplay address={order.billingAddress} />
                   <p className="mt-2 text-sm text-gray-600"><strong>Payment Method:</strong> {order.paymentMethod}</p>
                </div>
              </section>

              <section className="mt-6 pt-6 border-t">
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                   <Button variant="outline" className="text-green-700 border-green-700 hover:bg-green-100" onClick={() => navigate('/products')}>
                     <ShoppingCart className="mr-2 h-4 w-4" /> Shop Again
                   </Button>
                   
                   {order.status !== "Delivered" && order.status !== "Cancelled" && (
                     <AlertDialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
                       <AlertDialogTrigger asChild>
                         <Button 
                           variant="outline" 
                           className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                         >
                           Cancel Order
                         </Button>
                       </AlertDialogTrigger>
                       <AlertDialogContent>
                         <AlertDialogHeader>
                           <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                           <AlertDialogDescription>
                             This action cannot be undone. Please provide a reason for cancelling this order.
                           </AlertDialogDescription>
                         </AlertDialogHeader>
                         
                         <div className="grid gap-3 py-4">
                            <Label htmlFor="cancellation-reason">Reason for Cancellation</Label>
                            <Textarea
                              id="cancellation-reason"
                              placeholder="e.g., Ordered by mistake, found a different item, etc."
                              value={cancellationReason}
                              onChange={(e) => setCancellationReason(e.target.value)}
                              className="min-h-[100px]"
                            />
                         </div>

                         <AlertDialogFooter>
                           <AlertDialogCancel onClick={() => setCancellationReason("")}>Go Back</AlertDialogCancel>
                           <AlertDialogAction 
                             onClick={handleCancelOrder}
                             className="bg-red-600 hover:bg-red-700"
                           >
                             Confirm Cancellation
                           </AlertDialogAction>
                         </AlertDialogFooter>
                       </AlertDialogContent>
                     </AlertDialog>
                   )}

                   {order.status === "Cancelled" && order.cancellationReason && (
                     <div className="text-right p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm font-semibold text-red-700">Reason for Cancellation:</p>
                        <p className="text-sm text-gray-700 italic">"{order.cancellationReason}"</p>
                     </div>
                   )}

                </div>
              </section>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  // ... (no changes) ...
  <div className="bg-gray-50 p-3 rounded-lg border">
    <div className="flex items-center text-green-600 mb-1">
      <Icon className="w-4 h-4 mr-2" />
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-gray-800 font-semibold">{value}</p>
  </div>
);

const AddressDisplay = ({ address }) => (
  // ... (no changes) ...
  <div className="text-sm text-gray-700 space-y-0.5">
    <p className="font-semibold">{address.name}</p>
    <p>{address.address}</p>
    {address.phone && <p>Phone: {address.phone}</p>}
  </div>
);


export default OrderDetail;