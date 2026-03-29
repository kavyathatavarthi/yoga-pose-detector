// Footer component with copyright and links
import React from 'react';
import { FaHandPeace, FaHeart, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FaHandPeace className="text-3xl text-indigo-400" />
              <span className="font-bold text-xl">YogaPose AI</span>
            </div>
            <p className="text-gray-300 mb-4">
              Revolutionizing yoga practice with AI-powered pose detection and correction technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-indigo-400 transition-colors">Home</a></li>
              <li><a href="/camera" className="hover:text-indigo-400 transition-colors">Try Detector</a></li>
              <li><a href="/progress" className="hover:text-indigo-400 transition-colors">My Progress</a></li>
              <li><a href="/quiz" className="hover:text-indigo-400 transition-colors">Take Quiz</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: support@yogapose.ai</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Hours: Mon-Fri 9am-6pm</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center gap-1">
            Made with <FaHeart className="text-red-500" /> by YogaPose AI Team © 2024
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;