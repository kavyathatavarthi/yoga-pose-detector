// Pose correction component - displays TNN feedback from backend
import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaRobot } from 'react-icons/fa';

const PoseCorrection = ({ poseData }) => {
  // poseData comes from backend TNN model
  if (!poseData) {
    return (
      <div className="text-center py-8">
        <FaRobot className="text-4xl text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">Waiting for TNN pose detection...</p>
      </div>
    );
  }

  const { pose, score, feedback, confidence, form_type } = poseData;
  
  const getFormTypeStyles = () => {
    if (form_type === 'perfect') {
      return { 
        bg: 'bg-green-50', 
        border: 'border-green-500', 
        icon: FaCheckCircle, 
        iconColor: 'text-green-500', 
        text: 'Perfect Form!' 
      };
    }
    if (form_type === 'good') {
      return { 
        bg: 'bg-yellow-50', 
        border: 'border-yellow-500', 
        icon: FaCheckCircle, 
        iconColor: 'text-yellow-500', 
        text: 'Good Form' 
      };
    }
    return { 
      bg: 'bg-orange-50', 
      border: 'border-orange-500', 
      icon: FaExclamationTriangle, 
      iconColor: 'text-orange-500', 
      text: 'Needs Improvement' 
    };
  };

  const styles = getFormTypeStyles();
  const IconComponent = styles.icon;

  return (
    <div className="space-y-4">
      {/* Pose Name and Score */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">TNN Detected Pose</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {pose.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(confidence * 100)}% confidence
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">Accuracy Score: {score}%</p>
      </div>

      {/* Form Type Badge */}
      <div className={`${styles.bg} border-l-4 ${styles.border} p-3 rounded-lg`}>
        <div className="flex items-center">
          <IconComponent className={`${styles.iconColor} mr-2`} />
          <span className="font-medium text-gray-800">{styles.text}</span>
        </div>
      </div>

      {/* TNN Feedback */}
      {feedback && feedback.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <FaLightbulb className="text-yellow-500 mr-2" />
            TNN AI Suggestions
          </h3>
          <div className="space-y-2">
            {feedback.slice(0, 5).map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-sm text-gray-700">{msg}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Tip */}
      <div className="bg-indigo-50 rounded-lg p-4 mt-4">
        <h4 className="font-semibold text-indigo-800 mb-2 flex items-center">
          <FaLightbulb className="mr-2" />
          Pro Tip
        </h4>
        <p className="text-sm text-indigo-700">
          For best results, ensure good lighting, wear fitted clothing, 
          and position your full body in the frame.
        </p>
      </div>
    </div>
  );
};

export default PoseCorrection;