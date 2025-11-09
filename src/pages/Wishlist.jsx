import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleRemoveItem = (productId, productName) => {
    removeFromWishlist(productId);
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your wishlist.`
    });
  };

  const handleMoveToCart = (product) => {
    // Note: We use the full product object (which has the 'id') for both
    addToCart(product); 
    removeFromWishlist(product.id);
    toast({
      title: "Moved to cart! 🛒",
      description: `${product.name} has been added to your cart.`
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="w-32 h-32 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-16 h-16 text-red-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">Your wishlist is empty</h1>
              <p className="text-xl text-gray-600">
                Looks like you haven't added any eco-friendly products yet!
              </p>
            </div>
            <Link to="/products">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 mb-8"
        >
          <Link to="/products">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="overflow-hidden leaf-shadow h-full flex flex-col">
                <img
                  className="w-full h-48 object-cover"
                  alt={item.name}
                  src={item.image || "https://images.unsplash.com/photo-1581156404134-9bf1c6ab0b3d"}
                />
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    <span className="text-lg font-bold text-green-600">${item.price}</span>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Move to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;