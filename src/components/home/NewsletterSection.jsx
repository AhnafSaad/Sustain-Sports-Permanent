import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios'; // Added axios import

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        variant: 'destructive',
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Send request to the backend
      await axios.post('/api/subscribers', { email });
      
      toast({
        title: 'Thank you for subscribing! 📧',
        description: "You're now in the green loop.",
      });
      setEmail('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Subscription Failed',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Stay in the Green Loop</h2>
            <p className="text-xl text-green-100">
              Get eco-tips, product updates, and exclusive offers delivered
              to your inbox
            </p>
          </div>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading} // Disable input during loading
            />
            <Button
              type="submit"
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-3"
              disabled={isLoading} // Disable button during loading
            >
              {isLoading ? 'Sending...' : 'Subscribe'}
            </Button>
          </form>
          <p className="text-sm text-green-200">
            Join 10,000+ eco-conscious athletes. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;