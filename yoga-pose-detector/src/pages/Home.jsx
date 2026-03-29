// Landing page with hero section and feature highlights
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCamera, FaBrain, FaChartLine, FaRobot, FaShieldAlt, FaClock, FaHandPeace } from 'react-icons/fa';
import HeroSection from '../components/HeroSection';

const Home = () => {
  const features = [
    {
      icon: FaCamera,
      title: 'Real-time Detection',
      description: 'Using MediaPipe and CNN for accurate pose detection in real-time with 95% accuracy',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaBrain,
      title: 'AI Correction',
      description: 'Tiny Neural Network provides instant feedback and correction suggestions',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaChartLine,
      title: 'Progress Tracking',
      description: 'Monitor your yoga journey with detailed analytics and achievement milestones',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaRobot,
      title: 'Smart Assistant',
      description: 'Get instant answers and pose guidance from our AI-powered chatbot',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: FaShieldAlt,
      title: 'Privacy First',
      description: 'All processing happens locally on your device - no video data stored',
      color: 'from-teal-500 to-green-500'
    },
    {
      icon: FaClock,
      title: '24/7 Availability',
      description: 'Practice anytime, anywhere with our always-available AI coach',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '98%', label: 'Accuracy Rate' },
    { number: '15+', label: 'Yoga Poses' },
    { number: '4.9', label: 'User Rating' }
  ];

  return (
    <div>
      <HeroSection />
      
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-indigo-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology combined with expert yoga knowledge to perfect your practice
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Yoga Practice?
            </h2>
            <p className="text-xl text-indigo-200 mb-8">
              Join thousands of users who have improved their practice with AI precision
            </p>
            <Link
              to="/camera"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <FaCamera />
              <span>Start Detecting Now - Free</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;