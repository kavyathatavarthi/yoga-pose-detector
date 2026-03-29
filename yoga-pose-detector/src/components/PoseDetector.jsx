// Main pose detector component using TNN backend
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaVideo, FaChartLine, FaSave, FaSpinner } from 'react-icons/fa';
import { usePoseDetection } from '../hooks/usePoseDetection';
import PoseCorrection from './PoseCorrection';

const PoseDetector = ({ onPoseDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPose, setCurrentPose] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { startDetection, stopDetection } = usePoseDetection();

  // Load detection history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('yogaHistory');
    if (savedHistory) {
      setDetectionHistory(JSON.parse(savedHistory).slice(0, 10));
    }
  }, []);

  // Save detection when pose is detected
  const handlePoseDetected = (poseData) => {
    setCurrentPose(poseData);
    if (onPoseDetected) onPoseDetected(poseData);
    
    // Auto-save if recording
    if (isRecording && poseData.score >= 70) {
      saveDetection(poseData);
    }
  };

  const saveDetection = (poseData) => {
    const newDetection = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      pose: poseData.pose,
      confidence: poseData.confidence,
      score: poseData.score,
      form_type: poseData.form_type,
      feedback: poseData.feedback
    };
    
    const updatedHistory = [newDetection, ...detectionHistory].slice(0, 20);
    setDetectionHistory(updatedHistory);
    localStorage.setItem('yogaHistory', JSON.stringify(updatedHistory));
  };

  const startCamera = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
        
        setTimeout(() => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth || 640;
            canvasRef.current.height = videoRef.current.videoHeight || 480;
          }
        }, 100);
        
        startDetection(videoRef.current, canvasRef.current, handlePoseDetected);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Unable to access camera. Please check permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
      stopDetection();
      setCurrentPose(null);
      setIsRecording(false);
    }
  };

  const captureCurrentPose = () => {
    if (currentPose && currentPose.score >= 50) {
      saveDetection(currentPose);
      alert(`✅ Pose saved! ${currentPose.pose.toUpperCase()} detected with ${currentPose.score}% accuracy`);
    } else {
      alert('No pose detected or confidence too low. Please ensure proper positioning.');
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      alert('🎥 Recording started! Good poses will be automatically saved.');
    } else {
      setIsRecording(false);
      alert('Recording stopped.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Video Feed */}
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
          playsInline
          autoPlay
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
          style={{ transform: 'scaleX(-1)' }}
        />
        
        {!isActive && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <FaCamera />
              <span>Start TNN Camera</span>
            </button>
          </div>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <FaSpinner className="text-white text-4xl animate-spin" />
          </div>
        )}

        {isActive && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white text-xs">TNN ACTIVE</span>
          </div>
        )}
      </div>

      {/* Controls */}
      {isActive && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={captureCurrentPose}
            disabled={!currentPose}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            <span>Save Current Pose</span>
          </button>
          
          <button
            onClick={toggleRecording}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <FaVideo />
            <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
          </button>
          
          <button
            onClick={stopCamera}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Stop Camera
          </button>
        </div>
      )}

      {/* Current Pose Feedback - from TNN */}
      {currentPose && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <FaChartLine className="mr-2 text-indigo-600" />
            TNN Real-time Analysis
          </h3>
          <PoseCorrection poseData={currentPose} />
        </div>
      )}

      {/* Detection History */}
      {detectionHistory.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <FaChartLine className="mr-2 text-indigo-600" />
            Recent TNN Detections
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {detectionHistory.slice(0, 5).map((detection) => (
              <div key={detection.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-semibold text-indigo-600">{detection.pose.toUpperCase()}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {new Date(detection.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  detection.score >= 85 ? 'text-green-600' : 
                  detection.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {detection.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoseDetector;