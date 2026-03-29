// Progress page with TNN detection data
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaMedal, FaCalendarAlt, FaBrain, FaFire, FaTrophy, FaRobot } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Progress = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalPoses: 0,
    averageScore: 0,
    bestPose: '',
    bestScore: 0,
    streak: 0,
    weeklyProgress: [],
    posesByType: {},
    achievements: []
  });

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    const history = JSON.parse(localStorage.getItem('yogaHistory') || '[]');
    const sessionCount = parseInt(localStorage.getItem('yogaSessionCount') || '0');
    
    if (history.length > 0) {
      const avgScore = history.reduce((sum, p) => sum + (p.score || 0), 0) / history.length;
      const best = history.reduce((best, current) => 
        (current.score || 0) > (best.score || 0) ? current : best, history[0]);
      
      const posesByType = history.reduce((acc, pose) => {
        acc[pose.pose] = (acc[pose.pose] || 0) + 1;
        return acc;
      }, {});
      
      // Calculate streak based on sessions in last 7 days
      const today = new Date();
      const lastWeek = new Date(today.setDate(today.getDate() - 7));
      const recentSessions = history.filter(p => new Date(p.timestamp) > lastWeek);
      const streak = Math.min(Math.floor(recentSessions.length / 2), 30);
      
      // Weekly progress from history
      const weeklyScores = [];
      for (let i = 0; i < 6; i++) {
        const weekScores = history.filter(p => {
          const date = new Date(p.timestamp);
          const weekNum = Math.floor((Date.now() - date) / (7 * 24 * 60 * 60 * 1000));
          return weekNum === i;
        });
        const weekAvg = weekScores.length > 0 
          ? weekScores.reduce((s, p) => s + (p.score || 0), 0) / weekScores.length 
          : 0;
        weeklyScores.unshift(weekAvg);
      }
      
      // Achievements based on TNN scores
      const achievements = [];
      if (sessionCount >= 1) achievements.push({ name: 'First Practice', icon: '🎯', unlocked: true });
      if (history.length >= 10) achievements.push({ name: '10 Poses Mastered', icon: '🌟', unlocked: true });
      if (avgScore >= 80) achievements.push({ name: 'TNN Expert Level', icon: '🏆', unlocked: true });
      if (Object.keys(posesByType).length >= 3) achievements.push({ name: 'Pose Collector', icon: '📚', unlocked: true });
      if (streak >= 7) achievements.push({ name: '7-Day Streak', icon: '🔥', unlocked: true });
      if (best.score >= 95) achievements.push({ name: 'Perfect TNN Form', icon: '✨', unlocked: true });
      
      setStats({
        totalSessions: sessionCount,
        totalPoses: history.length,
        averageScore: Math.round(avgScore),
        bestPose: best.pose,
        bestScore: best.score || 0,
        streak: streak,
        weeklyProgress: weeklyScores,
        posesByType: posesByType,
        achievements: achievements
      });
    }
  };

  const lineData = {
    labels: ['Week 6', 'Week 5', 'Week 4', 'Week 3', 'Week 2', 'Last Week'],
    datasets: [
      {
        label: 'TNN Accuracy Score %',
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

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem('yogaHistory');
      localStorage.removeItem('yogaSessionCount');
      loadProgressData();
      toast.success('Progress reset successfully!');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Yoga Journey
          </h1>
          <p className="text-xl text-gray-600">
            Track your progress powered by TNN AI analysis
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          <div className="glass-card rounded-xl p-4 text-center">
            <FaCalendarAlt className="text-2xl text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.totalSessions}</div>
            <div className="text-xs text-gray-500">TNN Sessions</div>
          </div>
          
          <div className="glass-card rounded-xl p-4 text-center">
            <FaBrain className="text-2xl text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.averageScore}%</div>
            <div className="text-xs text-gray-500">Avg TNN Score</div>
          </div>
          
          <div className="glass-card rounded-xl p-4 text-center">
            <FaTrophy className="text-2xl text-yellow-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-800 truncate">{stats.bestPose || 'None'}</div>
            <div className="text-xs text-gray-500">Best TNN Pose</div>
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
        </div>

        {/* Charts */}
        {stats.totalPoses > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">TNN Accuracy Progress</h2>
                <Line data={lineData} options={{ responsive: true }} />
              </div>
              
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Pose Distribution (TNN)</h2>
                <Doughnut data={doughnutData} options={{ responsive: true }} />
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <FaTrophy className="text-yellow-500 mr-2" />
                TNN Achievements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 glass-card rounded-2xl">
            <FaRobot className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No TNN Progress Data Yet</h3>
            <p className="text-gray-500">Start practicing with the camera to track your TNN analysis!</p>
          </div>
        )}

        {/* Reset Button */}
        {stats.totalPoses > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={resetProgress}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Reset All Progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;