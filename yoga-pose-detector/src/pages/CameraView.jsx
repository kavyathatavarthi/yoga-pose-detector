// Camera page - only displays backend results
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCamera, FaStop, FaSpinner, FaChartLine, FaRobot } from 'react-icons/fa';
import { usePoseDetection } from '../hooks/usePoseDetection';

const CameraView = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { startDetection, stopDetection } = usePoseDetection();

  const startCamera = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setIsActive(true);
      
      startDetection(videoRef.current, canvasRef.current, (data) => {
        setResult(data);
        // Save to localStorage for progress
        const history = JSON.parse(localStorage.getItem('yogaHistory') || '[]');
        history.push({
          id: Date.now(),
          pose: data.pose,
          score: data.score,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('yogaHistory', JSON.stringify(history.slice(-50)));
      });
      
      toast.success('Camera started!');
    } catch (err) {
      toast.error('Camera error');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    videoRef.current.srcObject?.getTracks().forEach(t => t.stop());
    setIsActive(false);
    stopDetection();
    setResult(null);
    toast.success('Camera stopped');
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">AI Yoga Pose Detector</h1>
        <p className="text-center text-gray-600 mb-8">Powered by TNN Vision Transformer</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Feed */}
          <div className="bg-black rounded-2xl overflow-hidden aspect-video relative">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted style={{ transform: 'scaleX(-1)' }} />
            <canvas ref={canvasRef} className="hidden" />
            
            {!isActive && !isLoading && (
              <button onClick={startCamera} className="absolute inset-0 m-auto w-40 h-40 bg-indigo-600 rounded-full text-white text-xl">
                <FaCamera className="mx-auto text-3xl" />
                Start
              </button>
            )}
            {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/70"><FaSpinner className="text-white text-4xl animate-spin" /></div>}
            {isActive && <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">LIVE</div>}
          </div>

          {/* Results Panel */}
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaChartLine className="mr-2 text-indigo-600" /> TNN Analysis</h2>
            
            {result ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">{result.pose?.toUpperCase()}</div>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="gray" strokeWidth="12" fill="none" />
                      <circle cx="64" cy="64" r="58" stroke="#6366f1" strokeWidth="12" fill="none" strokeDasharray={364} strokeDashoffset={364 * (1 - (result.score || 0) / 100)} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">{result.score || 0}%</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2"><FaRobot className="inline mr-2 text-purple-600" /> Feedback</h3>
                  <ul className="space-y-2">
                    {(result.feedback || []).slice(0, 3).map((msg, i) => (
                      <li key={i} className="text-gray-700 text-sm">• {msg}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">Start camera for TNN analysis</div>
            )}
          </div>
        </div>

        {isActive && (
          <div className="mt-6 text-center">
            <button onClick={stopCamera} className="px-6 py-3 bg-red-600 text-white rounded-xl">Stop Camera</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraView;