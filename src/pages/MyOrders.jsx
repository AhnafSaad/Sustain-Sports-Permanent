import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, Hash, DollarSign, Info, ArrowLeft, Leaf, Search, Edit3, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// --- StarRatingInput কম্পোনেন্টটি এখানে যোগ করা হয়েছে ---
const StarRatingInput = ({ rating, setRating }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={starValue}
            className={`w-6 h-6 cursor-pointer ${
              starValue <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            onClick={() => setRating(starValue)}
          />
        );
      })}
    </div>
  );
};

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- START: রিভিউ লজিকের জন্য নতুন state ---
  const [reviewedOrderIds, setReviewedOrderIds] = useState([]); // কোন অর্ডারগুলোর রিভিউ দেওয়া হয়েছে
  // --- END: রিভিউ লজিকের জন্য নতুন state ---

  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [currentReviewProduct, setCurrentReviewProduct] = useState(null); // { id, name, orderId }
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (!user) {
      toast({
        title: "Access Denied",
        description: "Please log in to view your orders.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    const allOrders = JSON.parse(localStorage.getItem('sustainSportsUserOrders') || '[]');
    const userOrders = allOrders.filter(order => order.userId === user.email);
    userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    setOrders(userOrders);
    setFilteredOrders(userOrders);

    // --- START: রিভিউড অর্ডার লিস্ট লোড করা ---
    const reviewedOrders = JSON.parse(localStorage.getItem('sustainSportsReviewedOrders') || '[]');
    setReviewedOrderIds(reviewedOrders);
    // --- END: রিভিউড অর্ডার লিস্ট লোড করা ---

    setLoading(false);
  }, [user, navigate, toast]);

  useEffect(() => {
    const results = orders.filter(order =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  // --- রিভিউ সাবমিট করার ফাংশন ---
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user || !currentReviewProduct) {
      toast({ variant: "destructive", title: "Error", description: "Could not submit review. Please try again." });
      return;
    }
    if (reviewRating === 0 || !reviewComment.trim()) {
      toast({ variant: "destructive", title: "Incomplete Review", description: "Please provide a rating and comment." });
      return;
    }

    const newReview = {
      id: Date.now(),
      name: user.name, // লগইন করা ইউজার এর নাম
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      verified: true, // যেহেতু সে কিনেছে
      userId: user._id 
    };

    // নির্দিষ্ট প্রোডাক্ট এর রিভিউ localStorage-এ সেভ করা
    const reviews = JSON.parse(localStorage.getItem(`reviews_${currentReviewProduct.id}`)) || [];
    const updatedReviews = [newReview, ...reviews];
    localStorage.setItem(`reviews_${currentReviewProduct.id}`, JSON.stringify(updatedReviews));

    // --- START: এই অর্ডারটিকে "রিভিউড" হিসেবে মার্ক করা ---
    const updatedReviewedOrderIds = [...reviewedOrderIds, currentReviewProduct.orderId];
    localStorage.setItem('sustainSportsReviewedOrders', JSON.stringify(updatedReviewedOrderIds));
    setReviewedOrderIds(updatedReviewedOrderIds);
    // --- END: এই অর্ডারটিকে "রিভিউড" হিসেবে মার্ক করা ---

    toast({ title: "Review Submitted! 🌱", description: "Thank you for your feedback." });

    // পপ-আপ বন্ধ করা এবং state রিসেট করা
    setShowReviewDialog(false);
    setReviewRating(0);
    setReviewComment('');
    setCurrentReviewProduct(null);
  };

  const handleViewDetails = (orderId) => {
    navigate(`/my-orders/${orderId}`);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    // --- Dialog কম্পোনেন্ট দিয়ে পুরো পেইজটি Wrap করা হয়েছে ---
    <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-10 h-10 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
            </div>
            <Link to="/profile">
              <Button variant="outline" className="text-green-700 border-green-700 hover:bg-green-100 w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by Order ID or Product Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-lg"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => {
                // --- START: বাটন দেখানোর কন্ডিশন চেক ---
                const isDelivered = order.status === 'Delivered';
                const isAlreadyReviewed = reviewedOrderIds.includes(order.id);
                const canReview = isDelivered && !isAlreadyReviewed && order.items.length > 0;
                // --- END: বাটন দেখানোর কন্ডিশন চেক ---

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="leaf-shadow-hover overflow-hidden transition-all duration-300 hover:border-green-400">
                      <CardHeader className="bg-gray-50/50 p-4 border-b">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                          <div className="space-y-1">
                            <CardTitle className="text-lg font-semibold text-gray-800">Order ID: {order.id}</CardTitle>
                            <CardDescription className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-1.5" />
                              Placed on: {new Date(order.date).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge variant={getStatusBadgeVariant(order.status)} className="text-sm px-3 py-1 mt-2 sm:mt-0 self-start sm:self-auto">
                            {order.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                          <span className="font-semibold">Total: ${order.total.toFixed(2)}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Items:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                            {order.items.map((item, idx) => (
                              <li key={idx}>{item.name} (x{item.quantity})</li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 text-right flex justify-end space-x-2">
                          {/* --- START: রিভিউ বাটন এখন কন্ডিশনাল --- */}
                          {canReview && (
                            <DialogTrigger asChild>
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => setCurrentReviewProduct({ 
                                  id: order.items[0].id, 
                                  name: order.items[0].name,
                                  orderId: order.id  // <-- অর্ডার ID পাস করা হচ্ছে
                                })}
                              >
                                <Edit3 className="w-4 h-4 mr-1.5" /> Write a Review
                              </Button>
                            </DialogTrigger>
                          )}
                          {/* --- END: রিভিউ বাটন কন্ডিশনাল --- */}
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(order.id)} className="text-green-600 border-green-600 hover:bg-green-50">
                            <Info className="w-4 h-4 mr-1.5" /> View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-inner">
                <Leaf className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700">No Orders Found</h2>
                <p className="text-gray-500 mt-2">
                  {searchTerm ? "No orders match your search." : "You haven't placed any orders yet."}
                </p>
                <Link to="/products" className="mt-4 inline-block">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Start Shopping</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* --- START: রিভিউ পপ-আপ (Modal) --- */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a Review for {currentReviewProduct?.name}</DialogTitle>
          <DialogDescription>
            Share your thoughts about this product.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitReview} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rating" className="text-right">
              Rating
            </Label>
            <div className="col-span-3">
              <StarRatingInput rating={reviewRating} setRating={setReviewRating} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comment" className="text-right">
              Comment
            </Label>
            <Textarea
              id="comment"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="col-span-3"
              placeholder="Tell us more about your experience..."
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Submit Review</Button>
          </DialogFooter>
        </form>
      </DialogContent>
      {/* --- END: রিভিউ পপ-আপ --- */}
    </Dialog>
  );
};

export default MyOrders;