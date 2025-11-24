
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center space-x-2"
            >
              <Leaf className="w-8 h-8 text-green-400" />
              <span className="font-medium text-lg text-green-300 text-shadow-sm">
                Eco-Friendly Sports Equipment
              </span>
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-shadow-lg">
              Play Green.
              <br />
              <span className="text-green-400">Stay Clean.</span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto text-shadow-md">
              High-performance sustainable gear for a greener future.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-green-100 font-bold px-10 py-4 text-lg pulse-green"
              >
                Shop Now
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <Link to="/sustainability">
              <Button
                size="lg"
                className="bg-green-500 text-white hover:bg-green-600 font-semibold px-10 py-4 text-lg"
              >
                Our Sustainability
                <Zap className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
