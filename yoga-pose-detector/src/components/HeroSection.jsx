// Hero section with animated background and call to action
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              Yoga Pose Detection
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Master your yoga practice with real-time pose detection and instant correction feedback using advanced CNN and TNN models.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/camera"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <FaPlay />
                <span>Start Free Trial</span>
              </Link>
              <Link
                to="/detections"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300"
              >
                <FaInfoCircle />
                <span>Learn More</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Yoga Practice"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 glass-card rounded-xl p-4 shadow-xl animate-pulse-slow">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-gray-800">AI Active - Ready for Detection</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;