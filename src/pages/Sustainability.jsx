import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Recycle, Globe, ShieldCheck, TrendingUp, Droplets, TreeDeciduous, PackageCheck } from 'lucide-react';

const sustainabilitySections = [
  {
    title: 'Our Impact Report',
    description: 'Transparency in our journey: progress, challenges, and future goals.',
    icon: TrendingUp,
    link: '/sustainability/impact-report',
    imgSrc: 'https://iili.io/KDBg2vp.jpg',
    imageAlt: 'Graph showing positive environmental impact trends'
  },
  {
    title: '100% Eco-Friendly Products',
    description: 'Our unwavering commitment to products that are kind to the Earth, from creation to end-of-life.',
    icon: ShieldCheck,
    link: '/sustainability/100-eco-friendly',
    imgSrc: 'https://iili.io/KtSgoKv.jpg',
    imageAlt: 'Collection of beautifully designed eco-friendly sports gear'
  },
  {
    title: 'Eco-Friendly Materials',
    description: 'Discover the innovative, sustainable materials that form the heart of our gear.',
    icon: Leaf,
    link: '/sustainability/eco-friendly-materials',
    imgSrc: 'https://iili.io/KtSDIwv.jpg',
    imageAlt: 'Close-up of various sustainable textiles like organic cotton and recycled polyester'
  },
  {
    title: 'Circular Economy Summary',
    description: 'A brief look at how we design for longevity, repairability, and recyclability to close the loop.',
    icon: Recycle,
    link: '/sustainability/circular-economy-summary',
    imgSrc: 'https://iili.io/KtUJhIn.jpg',
    imageAlt: 'Infographic illustrating a simple circular product lifecycle'
  },
  {
    title: 'Circular Economy Deep Dive',
    description: 'Explore our detailed strategies for transforming product lifecycles and eliminating waste.',
    icon: PackageCheck,
    link: '/sustainability/circular-economy',
    imgSrc: 'https://iili.io/KDBQ667.webp',
    imageAlt: 'Detailed infographic showing a complex circular economy flow'
  },
  {
    title: 'Planet Positive Vision',
    description: 'Our ambition to go beyond neutral and actively contribute to a healthier planet.',
    icon: Globe,
    link: '/sustainability/planet-positive',
    imgSrc: 'https://iili.io/KDBmeIa.webp',
    imageAlt: 'Image of Earth from space with a green glow, symbolizing a healthier planet'
  },
  {
    title: 'Water Conservation',
    description: 'How we\'re working to protect and preserve precious water resources.',
    icon: Droplets,
    link: '/sustainability/water-conservation',
    imgSrc: 'https://iili.io/KDC3NWX.webp',
    imageAlt: 'Hands cupping clean, clear water'
  },
];

const Sustainability = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <TreeDeciduous className="w-24 h-24 text-green-700 mx-auto float-animation" />
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">Our Commitment to Sustainability</h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            At Sustain Sports, we believe performance and planetary health go hand-in-hand. Explore our initiatives to create a greener future for sports and beyond.
          </p>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sustainabilitySections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col overflow-hidden leaf-shadow-hover transition-all duration-300 ease-in-out hover:border-green-500 border-transparent border-2">
                <div className="h-56 bg-gray-200">
                  <img loading="lazy" className="w-full h-full object-cover" alt={section.imageAlt} src={section.imgSrc} />
                </div>
                <CardHeader className="items-center text-center pt-4 pb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <p className="text-gray-600 text-center leading-relaxed mb-4">
                    {section.description}
                  </p>
                  <Link to={section.link} className="mt-auto">
                    <Button variant="outline" className="w-full bg-green-600 text-white hover:bg-green-700 border-green-600 hover:border-green-700 transition-colors duration-300">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center py-12 bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl shadow-2xl"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Partner With Us for a Greener Future</h2>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join our mission to make sports sustainable. Whether you're a supplier, innovator, or advocate, let's collaborate.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-semibold px-10 py-3 text-lg transition-transform duration-300 hover:scale-105">
              Partner With Us
            </Button>
          </Link>
        </motion.section>
      </div>
    </div>
  );
};

export default Sustainability;