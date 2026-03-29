import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CameraView from './pages/CameraView';
import VideoTutorial from './pages/VideoTutorial';
import TeamPage from './pages/TeamPage';
import QuizPage from './pages/QuizPage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/camera" element={<CameraView />} />
            <Route path="/videos" element={<VideoTutorial />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/quiz" element={<QuizPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;