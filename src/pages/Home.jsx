import React, { useState, useEffect } from 'react'; // <-- 1. IMPORT useState/useEffect
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import axios from 'axios'; // <-- 2. IMPORT axios

// --- 3. REMOVE the old static data import ---
// import { getFeaturedProducts } from '@/data/products';

const Home = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // --- 4. ADD state for featured products & loading ---
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 5. ADD useEffect to fetch products from the API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/products');
        setFeaturedProducts(data.slice(0, 4)); // Get the first 4 products
      } catch (error) {
        console.error("Failed to fetch featured products", error);
        toast({
          variant: "destructive",
          title: "Failed to load products",
          description: "Could not fetch featured products from the server."
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]); // Add toast as a dependency

  const handleAddToCart = (product) => {
    // --- 6. UPDATE: Ensure the product added to cart has the correct 'id' property ---
    const productToAdd = { ...product, id: product._id };
    addToCart(productToAdd);
    toast({
      title: 'Added to cart! 🛒',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleFeatureClick = (featureTitle) => { // <-- 7. FIX: Accept the featureTitle argument
    toast({
      title: `🚧 ${featureTitle} `,
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection onFeatureClick={handleFeatureClick} />
      {/* --- 8. UPDATE: Pass the state variable to the component --- */}
      {!loading && (
        <FeaturedProductsSection products={featuredProducts} onAddToCart={handleAddToCart} />
      )}
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;