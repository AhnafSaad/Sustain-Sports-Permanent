
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FeaturedProductsSection = ({ products, onAddToCart }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900">Featured Products</h2>
          <p className="text-xl text-gray-600">
            Discover our most popular eco-friendly sports equipment
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id} // <-- FIX: Use _id for the key
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="overflow-hidden leaf-shadow hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover"
                    alt={product.name}
                    src={product.image} // <-- FIX: Use dynamic product.image
                  />
                  <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                    {product.ecoTag}
                  </Badge>
                  {product.originalPrice > product.price && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                      Sale
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">
                      ${product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </CardContent>
                {/* --- FIX: Changed to flex layout --- */}
                <CardFooter className="p-4 pt-0 flex space-x-2">
                  <Button
                    onClick={() => onAddToCart(product)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Link to={`/products/${product._id}`} className="flex-1"> {/* <-- FIX: Use _id for the link */}
                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/products">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;