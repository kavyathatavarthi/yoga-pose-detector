// Team member profile component
import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "AI Research Lead & Computer Vision Expert",
      bio: "PhD in Computer Vision with 10+ years experience in pose estimation and deep learning. Led research teams at top tech companies.",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      expertise: ["Computer Vision", "Deep Learning", "MediaPipe", "TensorFlow"],
      social: {
        github: "https://github.com/sarahjohnson",
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/sarahjohnson",
        email: "sarah@yogapose.ai"
      }
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Full Stack Developer & React Specialist",
      bio: "Expert in React, Node.js, and real-time applications. Built scalable web apps for startups and enterprise clients.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      expertise: ["React", "Node.js", "WebRTC", "Tailwind CSS"],
      social: {
        github: "https://github.com/michaelchen",
        linkedin: "https://linkedin.com/in/michaelchen",
        twitter: "https://twitter.com/michaelchen",
        email: "michael@yogapose.ai"
      }
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Yoga Expert & Curriculum Designer",
      bio: "Certified Yoga Instructor with 15 years of teaching experience. Specializes in alignment and therapeutic yoga.",
      image: "https://randomuser.me/api/portraits/women/89.jpg",
      expertise: ["Hatha Yoga", "Alignment", "Therapeutic Yoga", "Pranayama"],
      social: {
        github: "https://github.com/priyapatel",
        linkedin: "https://linkedin.com/in/priyapatel",
        twitter: "https://twitter.com/priyapatel",
        email: "priya@yogapose.ai"
      }
    },
    {
      id: 4,
      name: "James Wilson",
      role: "ML Engineer & Model Optimizer",
      bio: "Specializes in Tiny Neural Networks and model optimization for edge devices. Former AI researcher at leading labs.",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      expertise: ["TNN", "Model Optimization", "PyTorch", "ONNX"],
      social: {
        github: "https://github.com/jameswilson",
        linkedin: "https://linkedin.com/in/jameswilson",
        twitter: "https://twitter.com/jameswilson",
        email: "james@yogapose.ai"
      }
    },
    {
      id: 5,
      name: "Emma Rodriguez",
      role: "UI/UX Designer & Frontend Developer",
      bio: "Passionate about creating beautiful, accessible interfaces. Designs with user experience at the forefront.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      expertise: ["UI/UX Design", "Figma", "Framer Motion", "Accessibility"],
      social: {
        github: "https://github.com/emmarodriguez",
        linkedin: "https://linkedin.com/in/emmarodriguez",
        twitter: "https://twitter.com/emmarodriguez",
        email: "emma@yogapose.ai"
      }
    },
    {
      id: 6,
      name: "Dr. Amit Kumar",
      role: "Medical Advisor & Physiotherapist",
      bio: "Doctor of Physical Therapy specializing in movement analysis and injury prevention in yoga practice.",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      expertise: ["Physiotherapy", "Biomechanics", "Injury Prevention", "Rehabilitation"],
      social: {
        github: "https://github.com/amitkumar",
        linkedin: "https://linkedin.com/in/amitkumar",
        twitter: "https://twitter.com/amitkumar",
        email: "amit@yogapose.ai"
      }
    }
  ];

  return (
    <div className="space-y-12">
      {/* Mission Section */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We're on a mission to make yoga practice accessible and effective for everyone through cutting-edge AI technology. 
            Our platform combines computer vision, machine learning, and expert yoga knowledge to provide real-time feedback 
            and personalized guidance.
          </p>
        </motion.div>
      </div>

      {/* Team Grid */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-indigo-600 font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                
                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {member.expertise.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                {/* Social Links */}
                <div className="flex space-x-3 pt-3 border-t border-gray-100">
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <FaGithub size={18} />
                  </a>
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <FaLinkedin size={18} />
                  </a>
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    <FaTwitter size={18} />
                  </a>
                  <a
                    href={`mailto:${member.social.email}`}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <FaEnvelope size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="font-bold text-lg mb-2">Innovation First</h3>
          <p className="text-sm text-gray-600">Pushing boundaries with cutting-edge AI technology</p>
        </div>
        
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">💚</div>
          <h3 className="font-bold text-lg mb-2">User-Centered</h3>
          <p className="text-sm text-gray-600">Building for real people with real needs</p>
        </div>
        
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🌍</div>
          <h3 className="font-bold text-lg mb-2">Accessible for All</h3>
          <p className="text-sm text-gray-600">Making yoga practice available to everyone</p>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="glass-card rounded-2xl p-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h3 className="text-2xl font-bold mb-2">Join Our Team</h3>
        <p className="mb-4 text-indigo-100">
          We're always looking for talented individuals passionate about AI, yoga, and wellness.
        </p>
        <button className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
          View Open Positions
        </button>
      </div>
    </div>
  );
};

export default Team;