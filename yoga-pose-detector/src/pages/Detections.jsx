// Detection history page showing captured poses
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaChartLine } from 'react-icons/fa';

const Detections = () => {
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    const savedPoses = JSON.parse(localStorage.getItem('userPoses') || '[]');
    setDetections(savedPoses.reverse());
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all detection history?')) {
      localStorage.removeItem('userPoses');
      setDetections([]);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Detection History
            </h1>
            <p className="text-gray-600">Your captured poses and performance data</p>
          </div>
          {detections.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <FaTrash />
              <span>Clear All</span>
            </button>
          )}
        </motion.div>

        {detections.length === 0 ? (
          <div className="text-center py-20">
            <FaChartLine className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Detections Yet</h3>
            <p className="text-gray-500">Start practicing to see your pose history here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detections.map((detection, index) => (
              <motion.div
                key={detection.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-indigo-600">{detection.pose}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(detection.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Accuracy</span>
                    <span>{Math.round(detection.confidence * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                      style={{ width: `${detection.confidence * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p> {detection.confidence > 0.8 ? 'Excellent form!' : 'Keep practicing!'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Detections;