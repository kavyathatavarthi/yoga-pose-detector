// Simple hook that only sends frames to backend and returns results
import { useRef } from 'react';

export const usePoseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const apiUrl = 'http://localhost:5000';

  const captureAndPredict = async () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      });
      
      return await response.json();
      
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const startDetection = (videoElement, canvasElement, onResult) => {
    videoRef.current = videoElement;
    canvasRef.current = canvasElement;
    
    intervalRef.current = setInterval(async () => {
      if (videoElement.srcObject && videoElement.readyState === 4 && videoElement.videoWidth > 0) {
        const result = await captureAndPredict();
        if (result?.success && onResult) {
          onResult(result);
        }
      }
    }, 500);
  };

  const stopDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return { startDetection, stopDetection };
};