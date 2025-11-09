import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, Share2, ArrowLeft, Check, Truck, Shield, Recycle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext'; // <-- 1. IMPORT useWishlist
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios'; 

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // --- 2. ADD WISHLIST HOOK ---
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]); 

  // --- 3. CHECK IF ITEM IS IN WISHLIST ---
  // We map the API's '_id' to the 'id' our context expects
  const productToAdd = product ? { ...product, id: product._id } : null;
  const isInWishlist = productToAdd ? wishlistItems.some(item => item.id === productToAdd.id) : false;

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data: allProducts } = await axios.get('/api/products');
        const foundProduct = allProducts.find(p => p._id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          const storedReviews = JSON.parse(localStorage.getItem(`reviews_${foundProduct._id}`)) || [];
          setReviews(storedReviews);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]); 

  const handleAddToCart = () => {
    if (!productToAdd) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd);
    }
    toast({
      title: "Added to cart! 🛒",
      description: `${quantity} x ${product.name} added to your cart.`
    });
  };

  const handleBuyNow = () => {
    if (!productToAdd) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd);
    }
    toast({
      title: "Added to cart! 🛒",
      description: `${quantity} x ${product.name} added. Proceeding to checkout.`
    });
    navigate('/checkout');
  };

  // --- 4. UPDATE handleWishlist ---
  const handleWishlist = () => {
    if (!productToAdd) return;

    if (isInWishlist) {
      removeFromWishlist(productToAdd.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(productToAdd);
      toast({
        title: "Added to Wishlist! ❤️",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "🚧 Share feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{error || 'Product not found'}</h2>
          <Link to="/products">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/products">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="relative">
              <img  
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
                alt={product.name}
                src={product.image || "https://images.unsplash.com/photo-1683724709712-b68cbb3f0069"} />
              <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                {product.ecoTag}
              </Badge>
              {product.originalPrice > product.price && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                  Sale
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[
                product.image, 
                "https://images.unsplash.com/photo-1589595427524-2ddaf2d43fc9", 
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop", 
                "https://images.unsplash.com/photo-1614632537190-23e4b2e69c88?w=100&h=100&fit=crop"
              ].slice(0,4).map((imgSrc, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-green-600' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img  
                    className="w-full h-20 object-cover"
                    alt={`${product.name} view ${index + 1}`}
                    src={imgSrc || "https://images.unsplash.com/photo-1589595427524-2ddaf2d43fc9"} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-green-600 text-green-600">
                  {product.category?.name || 'Category'}
                </Badge>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWishlist}
                    // --- 5. UPDATE BUTTON STYLE BASED ON STATE ---
                    className={`border-gray-300 hover:bg-gray-50 ${
                      isInWishlist ? 'text-red-500' : 'text-gray-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({reviews.length > 0 ? reviews.length : (product.reviews || 0)} reviews)</span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-green-600">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                )}
                {product.originalPrice > product.price && (
                  <Badge className="bg-red-500 text-white">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </Badge>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed">{product.fullDescription || product.description}</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Key Features:</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.features && product.features.length > 0 ? (
                  product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No features listed.</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 py-3"
                  size="lg"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Truck className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">30-Day Returns</p>
                  <p className="text-sm text-gray-600">Easy returns policy</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Recycle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Eco-Friendly</p>
                  <p className="text-sm text-gray-600">Sustainable materials</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews ({reviews.length})</h2>
              </div>

              {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                      className="space-y-3 p-4 bg-gray-50 rounded-lg shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700 italic">"{review.comment}"</p>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="font-medium">{review.name}</span>
                        <span>{review.date}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">Be the first to review this product!</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;