// AI Chat Assistant for yoga guidance
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Yoga Assistant. Ask me anything about yoga poses, techniques, or how to improve your practice!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sampleResponses = {
    'mountain pose': 'Mountain Pose (Tadasana) is the foundation of all standing poses. Stand with feet hip-width apart, arms at sides, palms forward. Engage your thighs, lift your chest, and lengthen your spine.',
    'downward dog': 'Downward Dog (Adho Mukha Svanasana) is a resting pose that stretches the entire body. Start on hands and knees, lift hips up and back, forming an inverted V shape. Press hands firmly into mat and keep spine long.',
    'warrior': 'Warrior poses build strength and stamina. For Warrior II, bend front knee to 90°, extend arms parallel to floor, gaze over front hand. Keep hips squared forward.',
    'tree pose': 'Tree Pose (Vrksasana) improves balance. Place foot on inner thigh (avoid knee), hands at heart center, focus on a fixed point. Engage core for stability.',
    'correction': 'Our AI uses MediaPipe to detect 33 body landmarks. We analyze angles between joints to provide real-time feedback. For best results, ensure good lighting and stand fully in frame.',
    'default': "That's a great question! For specific yoga guidance, I recommend practicing with our camera detection feature. It provides real-time feedback on your form. Would you like tips on a specific pose?"
  };

  const getBotResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('mountain') || lowerMsg.includes('tadasana')) {
      return sampleResponses['mountain pose'];
    } else if (lowerMsg.includes('downward') || lowerMsg.includes('dog')) {
      return sampleResponses['downward dog'];
    } else if (lowerMsg.includes('warrior')) {
      return sampleResponses['warrior'];
    } else if (lowerMsg.includes('tree') || lowerMsg.includes('vrksasana')) {
      return sampleResponses['tree pose'];
    } else if (lowerMsg.includes('correction') || lowerMsg.includes('accuracy')) {
      return sampleResponses['correction'];
    } else {
      return sampleResponses['default'];
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Yoga Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Get instant answers to your yoga questions and pose guidance
          </p>
        </motion.div>

        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' ? 'bg-indigo-600' : 'bg-purple-600'
                  }`}>
                    {message.sender === 'user' ? <FaUser className="text-white" /> : <FaRobot className="text-white" />}
                  </div>
                  <div className={`rounded-2xl p-4 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                    <FaRobot className="text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-white/50">
            <div className="flex space-x-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about yoga poses, techniques, or how to improve..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 resize-none"
                rows="2"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <FaPaperPlane />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Ask about Mountain Pose, Downward Dog, Warrior, Tree Pose, or pose correction tips!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;