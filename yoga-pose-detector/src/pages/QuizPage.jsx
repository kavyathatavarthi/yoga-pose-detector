// Yoga knowledge quiz page
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = [
    {
      question: "What is the primary benefit of Mountain Pose (Tadasana)?",
      options: [
        "Improves balance and posture",
        "Builds arm strength",
        "Increases flexibility in legs",
        "Opens hip flexors"
      ],
      correct: 0
    },
    {
      question: "In Downward Dog, where should your gaze be directed?",
      options: [
        "Up at the ceiling",
        "Towards your belly button",
        "Between your feet",
        "Behind you"
      ],
      correct: 2
    },
    {
      question: "What does CNN stand for in our pose detection system?",
      options: [
        "Computer Neural Network",
        "Convolutional Neural Network",
        "Central Nervous Network",
        "Continuous Neural Network"
      ],
      correct: 1
    },
    {
      question: "Which pose is known as the 'king of asanas'?",
      options: [
        "Tree Pose",
        "Warrior Pose",
        "Headstand (Sirsasana)",
        "Lotus Pose"
      ],
      correct: 2
    },
    {
      question: "How many body landmarks does MediaPipe Pose detect?",
      options: [
        "17 landmarks",
        "25 landmarks",
        "33 landmarks",
        "42 landmarks"
      ],
      correct: 2
    }
  ];

  const handleAnswer = (selectedIndex) => {
    setSelectedAnswer(selectedIndex);
    const isCorrect = selectedIndex === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
      toast.success('Correct! Great job!');
    } else {
      toast.error(`Incorrect. The correct answer is: ${questions[currentQuestion].options[questions[currentQuestion].correct]}`);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        const percentage = ((score + (isCorrect ? 1 : 0)) / questions.length) * 100;
        if (percentage >= 80) {
          toast.success(`Quiz completed! Score: ${percentage}% - Excellent!`);
        } else if (percentage >= 60) {
          toast.success(`Quiz completed! Score: ${percentage}% - Good job!`);
        } else {
          toast.success(`Quiz completed! Score: ${percentage}% - Keep learning!`);
        }
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    toast.success('Quiz restarted! Good luck!');
  };

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8 max-w-2xl w-full text-center"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Quiz Completed!
          </h1>
          <div className="text-6xl font-bold text-indigo-600 mb-4">{Math.round(percentage)}%</div>
          <p className="text-xl text-gray-600 mb-2">
            You scored {score} out of {questions.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-gray-600 mb-6">
            {percentage >= 80 ? "🎉 Excellent! You're a yoga expert!" :
             percentage >= 60 ? "👍 Good job! Keep practicing!" :
             "💪 Keep learning! Practice makes perfect!"}
          </p>
          <button
            onClick={restartQuiz}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Take Quiz Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8"
        >
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-sm font-semibold text-indigo-600">Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedAnswer === null
                    ? 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                    : selectedAnswer === index
                    ? index === questions[currentQuestion].correct
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : index === questions[currentQuestion].correct && selectedAnswer !== null
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 opacity-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? index === questions[currentQuestion].correct
                        ? 'border-green-500 bg-green-500'
                        : 'border-red-500 bg-red-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <span className="text-white text-sm">
                        {index === questions[currentQuestion].correct ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizPage;