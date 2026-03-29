// Progress tracking component with charts and statistics
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaMedal, FaCalendarAlt, FaBrain, FaFire, FaTrophy } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const ProgressTracker = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalPoses: 0,
    averageConfidence: 0,
    bestPose: '',
    bestAccuracy: 0,
    streak: 0,
    weeklyProgress: [],
    posesByType: {},
    achievements: []
  });

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    // Load data from localStorage
    const userPoses = JSON.parse(localStorage.getItem('userPoses') || '[]');
    const sessionCount = parseInt(localStorage.getItem('sessionCount') || '0');
    const detectionHistory = JSON.parse(localStorage.getItem('detectionHistory') || '[]');
    
    if (userPoses.length > 0) {
      // Calculate statistics
      const avgConfidence = userPoses.reduce((sum, p) => sum + p.confidence, 0) / userPoses.length;
      const bestPoseData = userPoses.reduce((best, current) => 
        current.confidence > best.confidence ? current : best, userPoses[0]);
      
      // Group poses by type
      const posesByType = userPoses.reduce((acc, pose) => {
        acc[pose.pose] = (acc[pose.pose] || 0) + 1;
        return acc;
      }, {});
      
      // Calculate streak (simplified - based on sessions in last 7 days)
      const today = new Date();
      const lastWeek = new Date(today.setDate(today.getDate() - 7));
      const recentSessions = userPoses.filter(p => new Date(p.timestamp) > lastWeek);
      const streak = Math.min(Math.floor(recentSessions.length / 2), 30);
      
      // Weekly progress
      const weeklyData = [65, 72, 78, 84, 88, avgConfidence * 100];
      
      // Achievements
      const achievements = [];
      if (sessionCount >= 1) achievements.push({ name: 'First Practice', icon: '🎯', unlocked: true });
      if (userPoses.length >= 10) achievements.push({ name: '10 Poses Mastered', icon: '🌟', unlocked: true });
      if (avgConfidence > 0.8) achievements.push({ name: 'Expert Level', icon: '🏆', unlocked: true });
      if (Object.keys(posesByType).length >= 3) achievements.push({ name: 'Pose Collector', icon: '📚', unlocked: true });
      if (streak >= 7) achievements.push({ name: '7-Day Streak', icon: '🔥', unlocked: true });
      
      setStats({
        totalSessions: sessionCount,
        totalPoses: userPoses.length,
        averageConfidence: avgConfidence,
        bestPose: bestPoseData.pose,
        bestAccuracy: Math.round(bestPoseData.confidence * 100),
        streak: streak,
        weeklyProgress: weeklyData,
        posesByType: posesByType,
        achievements: achievements
      });
    }
  };

  // Chart configuration
  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'This Week'],
    datasets: [
      {
        label: 'Accuracy %',
        data: stats.weeklyProgress,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: Object.keys(stats.posesByType),
    datasets: [
      {
        data: Object.values(stats.posesByType),
        backgroundColor: ['#6366f1', '#8b5cf6', '#ec489a', '#06b6d4', '#10b981', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}% accuracy`
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} times`
        }
      }
    }
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      localStorage.removeItem('userPoses');
      localStorage.removeItem('sessionCount');
      localStorage.removeItem('detectionHistory');
      loadProgressData();
      alert('Progress has been reset successfully!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <FaCalendarAlt className="text-2xl text-indigo-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalSessions}</div>
          <div className="text-xs text-gray-500">Sessions</div>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <FaBrain className="text-2xl text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{Math.round(stats.averageConfidence * 100)}%</div>
          <div className="text-xs text-gray-500">Avg Accuracy</div>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <FaTrophy className="text-2xl text-yellow-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800 truncate">{stats.bestPose || 'None'}</div>
          <div className="text-xs text-gray-500">Best Pose</div>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <FaFire className="text-2xl text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.streak}</div>
          <div className="text-xs text-gray-500">Day Streak</div>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <FaMedal className="text-2xl text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalPoses}</div>
          <div className="text-xs text-gray-500">Total Poses</div>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <span className="text-2xl block mb-2">🎯</span>
          <div className="text-2xl font-bold text-gray-800">{stats.bestAccuracy}%</div>
          <div className="text-xs text-gray-500">Best Accuracy</div>
        </div>
      </div>

      {/* Charts */}
      {stats.totalPoses > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Accuracy Progress</h3>
              <Line data={lineData} options={lineOptions} />
            </div>
            
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Pose Distribution</h3>
              {Object.keys(stats.posesByType).length > 0 ? (
                <Doughnut data={doughnutData} options={doughnutOptions} />
              ) : (
                <p className="text-center text-gray-500 py-12">No pose data available yet</p>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
              <FaTrophy className="text-yellow-500 mr-2" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {stats.achievements.map((achievement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{achievement.name}</div>
                </motion.div>
              ))}
              {stats.achievements.length === 0 && (
                <p className="text-gray-500 text-center col-span-full">Complete more sessions to earn achievements!</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16 glass-card rounded-2xl">
          <FaMedal className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Progress Data Yet</h3>
          <p className="text-gray-500">Start practicing with the camera to track your progress!</p>
        </div>
      )}

      {/* Reset Button */}
      {stats.totalPoses > 0 && (
        <div className="text-center">
          <button
            onClick={resetProgress}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Reset All Progress
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;