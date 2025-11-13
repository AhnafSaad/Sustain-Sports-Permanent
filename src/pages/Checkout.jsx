import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, Shield, Check, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    
    // Check for our donation reward pattern
    if (promoCode.toUpperCase().startsWith('ECO-REWARD-')) {
      // Apply 15% discount for donation rewards
      const discountAmount = getCartTotal() * 0.15;
      setDiscount(discountAmount);
      toast({
        title: "Promo Applied! 🌱",
        description: "15% donation reward discount applied."
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "This code is not valid or has expired."
      });
      setDiscount(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      
      // 1. Get existing orders from local storage, or create an empty array
      const allOrders = JSON.parse(localStorage.getItem('sustainSportsUserOrders') || '[]');

      // 2. Create a new order object
      const newOrder = {
        id: `SS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, // A simple unique ID
        userId: user.email, // Use email as the unique ID
        date: new Date().toISOString(),
        status: 'Processing',
        items: items, // Items from useCart()
        total: ((getCartTotal() - discount) * 1.08), // Total with discount
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
          phone: '', // You don't collect this, but OrderDetail.jsx might use it
        },
        billingAddress: {
          name: formData.nameOnCard,
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        },
        shippingMethod: 'Free Shipping',
        paymentMethod: `Card ending in ${formData.cardNumber.slice(-4)}`,
        trackingNumber: `1Z${Math.random().toString().slice(2, 18)}` // Fake tracking #
      };

      // 3. Add the new order to the beginning of the list
      const updatedOrders = [newOrder, ...allOrders];

      // 4. Save the updated list back to local storage
      localStorage.setItem('sustainSportsUserOrders', JSON.stringify(updatedOrders));

      // 5. Now continue with your original logic
      clearCart();
      setIsProcessing(false);
      toast({
        title: "Order placed successfully! 🎉",
        description: "Thank you for your eco-friendly purchase! You'll receive a confirmation email shortly."
      });
      // Navigate to My Orders to see the new order!
      navigate('/my-orders'); 
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some eco-friendly products before checkout.</p>
          <Link to="/products">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 mb-8"
        >
          <Link to="/cart">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <Card className="leaf-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="leaf-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span>Shipping Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="leaf-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <span>Payment Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="text"
                    name="nameOnCard"
                    placeholder="Name on card"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    type="text"
                    name="cardNumber"
                    placeholder="Card number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Place Order Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                size="lg"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Place Order - $${((getCartTotal() - discount) * 1.08).toFixed(2)}`
                )}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Order Items */}
            <Card className="leaf-shadow">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-b-0">
                    <img  
                      className="w-16 h-16 object-cover rounded-lg"
                      alt={item.name}
                     src="https://images.unsplash.com/photo-1581156404134-9bf1c6ab0b3d" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card className="leaf-shadow">
              <CardContent className="space-y-3 pt-6">
                
                {/* Promo Code Input */}
                <div className="flex space-x-2 mb-4">
                  <Input 
                    placeholder="Promo Code" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={handleApplyPromo}>
                    Apply
                  </Button>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                </div>
                
                {/* Show Discount if applied */}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center"><Tag className="w-3 h-3 mr-1"/> Discount:</span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${((getCartTotal() - discount) * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-green-600">
                      {/* Recalculate total with discount */}
                      ${((getCartTotal() - discount) * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className="leaf-shadow">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">SSL encrypted checkout</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Free shipping on all orders</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eco Impact */}
            <Card className="leaf-shadow bg-green-50">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-green-800 mb-3">🌱 Your Eco Impact</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <p>• This order saves 2.5kg CO₂ emissions</p>
                  <p>• Supports sustainable manufacturing</p>
                  <p>• Contributes to ocean cleanup initiatives</p>
                  <p>• Plants 1 tree through our partnership</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;