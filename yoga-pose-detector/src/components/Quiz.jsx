// Interactive quiz component to test yoga knowledge
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaArrowRight } from 'react-icons/fa';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);

  const questions = [
    {
      id: 1,
      question: "What is the primary benefit of Mountain Pose (Tadasana)?",
      options: [
        "Improves balance and posture",
        "Builds arm strength",
        "Increases flexibility in legs",
        "Opens hip flexors"
      ],
      correct: 0,
      explanation: "Mountain Pose improves posture, balance, and body awareness. It's the foundation for all standing poses."
    },
    {
      id: 2,
      question: "In Downward Dog, where should your gaze be directed?",
      options: [
        "Up at the ceiling",
        "Towards your belly button",
        "Between your feet",
        "Behind you"
      ],
      correct: 2,
      explanation: "Gaze between your feet or toward your navel to maintain a neutral neck position."
    },
    {
      id: 3,
      question: "What does CNN stand for in our pose detection system?",
      options: [
        "Computer Neural Network",
        "Convolutional Neural Network",
        "Central Nervous Network",
        "Continuous Neural Network"
      ],
      correct: 1,
      explanation: "CNN (Convolutional Neural Network) is used for image recognition and pose detection."
    },
    {
      id: 4,
      question: "Which pose is known as the 'king of asanas'?",
      options: [
        "Tree Pose",
        "Warrior Pose",
        "Headstand (Sirsasana)",
        "Lotus Pose"
      ],
      correct: 2,
      explanation: "Headstand (Sirsasana) is called the king of asanas for its numerous benefits."
    },
    {
      id: 5,
      question: "How many body landmarks does MediaPipe Pose detect?",
      options: [
        "17 landmarks",
        "25 landmarks",
        "33 landmarks",
        "42 landmarks"
      ],
      correct: 2,
      explanation: "MediaPipe Pose detects 33 body landmarks for comprehensive pose analysis."
    },
    {
      id: 6,
      question: "What is the correct alignment for Warrior II Pose?",
      options: [
        "Front knee bent 90°, arms parallel to floor",
        "Both knees bent, arms overhead",
        "Back knee bent, front leg straight",
        "Feet together, arms at sides"
      ],
      correct: 0,
      explanation: "In Warrior II, front knee bends to 90° directly over ankle, arms extend parallel to floor."
    },
    {
      id: 7,
      question: "Which yoga pose is best for improving balance?",
      options: [
        "Downward Dog",
        "Child's Pose",
        "Tree Pose",
        "Cobra Pose"
      ],
      correct: 2,
      explanation: "Tree Pose (Vrksasana) is excellent for developing balance and focus."
    },
    {
      id: 8,
      question: "What does TNN stand for in our correction system?",
      options: [
        "Tiny Neural Network",
        "Total Neural Network",
        "Training Neural Network",
        "Transfer Neural Network"
      ],
      correct: 0,
      explanation: "TNN (Tiny Neural Network) provides lightweight, fast pose correction feedback."
    }
  ];

  // Load quiz history
  useEffect(() => {
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) {
      setQuizHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleAnswer = (selectedIndex) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedAnswer(selectedIndex);
    const isCorrect = selectedIndex === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        finishQuiz();
      }
    }, 2000);
  };

  const finishQuiz = () => {
    const percentage = ((score + (selectedAnswer === questions[currentQuestion].correct ? 1 : 0)) / questions.length) * 100;
    
    const quizResult = {
      id: Date.now(),
      date: new Date().toISOString(),
      score: score + (selectedAnswer === questions[currentQuestion].correct ? 1 : 0),
      total: questions.length,
      percentage: percentage
    };
    
    const updatedHistory = [quizResult, ...quizHistory].slice(0, 10);
    setQuizHistory(updatedHistory);
    localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
    localStorage.setItem('lastQuizScore', JSON.stringify(quizResult));
    
    setShowResult(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (showResult) {
    const finalScore = score + (selectedAnswer === questions[currentQuestion].correct ? 1 : 0);
    const percentage = (finalScore / questions.length) * 100;
    
    return (
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8"
        >
          <FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
          <div className="text-5xl font-bold text-indigo-600 mb-2">{Math.round(percentage)}%</div>
          <p className="text-gray-600 mb-4">
            You scored {finalScore} out of {questions.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <p className="text-gray-700 mb-6">
            {percentage >= 80 && "🎉 Excellent! You're a yoga expert!"}
            {percentage >= 60 && percentage < 80 && "👍 Good job! Keep learning!"}
            {percentage < 60 && "💪 Keep practicing! You'll improve!"}
          </p>
          
          <button
            onClick={restartQuiz}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Take Quiz Again
          </button>
        </motion.div>
        
        {/* Quiz History */}
        {quizHistory.length > 1 && (
          <div className="mt-8 glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Previous Attempts</h3>
            <div className="space-y-2">
              {quizHistory.slice(1, 4).map((attempt, idx) => (
                <div key={attempt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">
                    {new Date(attempt.date).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-indigo-600">
                    {Math.round(attempt.percentage)}%
                  </span>
                  <span className="text-sm text-gray-500">
                    {attempt.score}/{attempt.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                  isAnswered
                    ? idx === currentQ.correct
                      ? 'border-green-500 bg-green-50'
                      : selectedAnswer === idx
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 opacity-50'
                    : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{option}</span>
                  {isAnswered && idx === currentQ.correct && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                  {isAnswered && selectedAnswer === idx && idx !== currentQ.correct && (
                    <FaTimesCircle className="text-red-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-indigo-50 rounded-xl"
            >
              <p className="text-sm text-indigo-800">
                <strong>Explanation:</strong> {currentQ.explanation}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;