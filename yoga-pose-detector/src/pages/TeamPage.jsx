// Team page showing project contributors
import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import varshithaImg from './varshitha.jpeg';
import vaishnaviImg from './vaishnavi.jpeg';
import harikaImg from './harika.jpeg';
import kavyaImg from './kavya.jpeg';

const TeamPage = () => {
  const team = [
    {
      name: "Varshitha",
      role: "AI Research Lead",
      image: varshithaImg,
      social: { github: "#", linkedin: "#", twitter: "#" }
    },
    {
      name: "Vaishnavi",
      role: "Full Stack Developer",
      image: vaishnaviImg,
      social: { github: "#", linkedin: "#", twitter: "#" }
    },
    {
      name: "Harika",
      role: "Yoga Expert",
      image: harikaImg,
      social: { github: "#", linkedin: "#", twitter: "#" }
    },
    {
      name: "Kavya",
      role: "ML Engineer",
      image: kavyaImg,
      social: { github: "#", linkedin: "#", twitter: "#" }
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Meet Our Team
          </h1>
          <p className="text-xl text-gray-600">
            Passionate experts combining AI technology with yoga expertise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-indigo-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex space-x-3">
                  <a href={member.social.github} className="text-gray-500 hover:text-indigo-600 transition-colors">
                    <FaGithub size={20} />
                  </a>
                  <a href={member.social.linkedin} className="text-gray-500 hover:text-indigo-600 transition-colors">
                    <FaLinkedin size={20} />
                  </a>
                  <a href={member.social.twitter} className="text-gray-500 hover:text-indigo-600 transition-colors">
                    <FaTwitter size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 glass-card rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We're on a mission to make yoga practice accessible and effective for everyone through cutting-edge AI technology. Our platform combines computer vision, machine learning, and expert yoga knowledge to provide real-time feedback and personalized guidance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;