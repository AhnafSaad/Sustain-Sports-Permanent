import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const teamMembers = [
    { name: 'Ahnaf Sadik Saad', role: 'Lead Developer & Visionary', imageAlt: 'Ahnaf Sadik Saad, focused and innovative' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <Leaf className="w-20 h-20 text-green-600 mx-auto float-animation" />
          <h1 className="text-5xl font-bold text-gray-900">About Sustain Sports</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We're not just a brand; we're a movement. A movement towards a world where passion for sports and love for our planet coexist in harmony.
          </p>
        </motion.section>

        {/* --- MODIFIED SECTION --- */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 space-y-8" // Added space-y-8 here
        >
          {/* --- "Our Mission" Card --- */}
          <Card className="leaf-shadow overflow-hidden">
            <div className="p-8 md:p-12 space-y-6">
              <Target className="w-12 h-12 text-green-700" />
              <h2 className="text-3xl font-semibold text-green-700">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed max-w-3xl">
                Our mission is to create high-performance, aesthetically pleasing sports equipment that is 100% eco-friendly. We challenge the status quo, proving that sustainable choices can enhance athletic performance. We are dedicated to innovating materials, reducing waste, and inspiring our community to play with purpose.
              </p>
            </div>
          </Card>

          {/* --- "Our Story" Card --- */}
          <Card className="leaf-shadow overflow-hidden">
            <div className="p-8 md:p-12 space-y-6">
              <Leaf className="w-12 h-12 text-green-700" />
              <h2 className="text-3xl font-semibold text-green-700">Our Story</h2>
              <p className="text-gray-600 leading-relaxed max-w-3xl">
                Sustain Sports was born from a simple idea on a trail run: "What if our gear could give back to the grounds we play on?" As athletes and nature lovers, we were tired of the compromise between performance and sustainability. So, we embarked on a journey to create a brand that honors both. Founded in 2022, we've been relentlessly pursuing innovation in green technology for sports ever since.
              </p>
            </div>
          </Card>
        </motion.section>
        {/* --- END OF MODIFIED SECTION --- */}


        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet the Team</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
            Meet the visionary driving Sustain Sports forward.
          </p>
          <div className="flex justify-center">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="text-center max-w-sm"
              >
                <Card className="leaf-shadow overflow-hidden">
                  <img  className="w-full h-80 object-cover" alt={member.imageAlt} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                    <p className="text-green-600">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
