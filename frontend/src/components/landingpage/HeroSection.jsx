import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code,
  Users,
  Video,
  MessageSquare,
  Terminal,
  GitBranch,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TypewriterEffect } from "../ui/TextEffects";
import { Button } from "../ui/Button";
import { Spotlight } from "../ui/BackgroundEffects";
import AuthModal from "../auth/AuthModal";
import { useAuth } from "../../context/AuthContext";

const HeroSection = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const words = [
    {
      text: "Code,",
      className: "text-orange-600 dark:text-orange-400 font-bold",
    },
    {
      text: "Collaborate,",
      className: "text-orange-600 dark:text-orange-400 font-bold",
    },
    {
      text: "Conquer",
      className: "text-orange-600 dark:text-orange-400 font-bold",
    },
    {
      text: "with",
      className: "text-gray-900 dark:text-white font-bold",
    },
    {
      text: "PrepMate",
      className: "text-orange-600 dark:text-orange-400 font-bold",
    },
  ];

  const features = [
    {
      icon: Code,
      title: "Live Code Editor",
      description: "Real-time code editing with syntax highlighting",
    },
    {
      icon: Users,
      title: "Live Collaboration",
      description: "Work together in real-time with your team",
    },
    {
      icon: Video,
      title: "Video Calls",
      description: "Integrated video conferencing for pair programming",
    },
    {
      icon: MessageSquare,
      title: "Chat Features",
      description: "Built-in messaging and communication tools",
    },
    {
      icon: Terminal,
      title: "Terminal Access",
      description: "Full terminal with GitHub integration",
    },
    {
      icon: GitBranch,
      title: "DSA Problems",
      description: "LeetCode-style problems with test cases",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-black relative overflow-hidden">
        {/* Spotlight Effect */}
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="orange"
        />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
          <div className="text-center">
            {/* Typewriter Effect - Fixed and Minimal */}
            <div className="mb-8">
              <TypewriterEffect
                words={words}
                className="text-4xl md:text-6xl lg:text-7xl font-bold"
                cursorClassName="bg-orange-600 dark:bg-orange-400"
              />
            </div>

            {/* Minimal Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              The ultimate platform for coding interviews and collaborative
              programming.
            </motion.p>

            {/* Two Minimal CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {/* Get Started Button */}
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-base font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => setAuthModalOpen(true)}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {/* Start Collaborating Button */}
              <Button
                variant="outline"
                size="lg"
                className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 text-base font-medium rounded-lg transition-all duration-200 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-400 dark:hover:text-black"
                onClick={() => setAuthModalOpen(true)}
              >
                Start Collaborating
                <Users className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg mb-4 mx-auto">
                    <feature.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Section */}
            <motion.div
              className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {[
                { value: "10K+", label: "Problems Solved" },
                { value: "5K+", label: "Active Users" },
                { value: "95%", label: "Success Rate" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent dark:from-orange-950/20 dark:via-transparent dark:to-transparent pointer-events-none" />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default HeroSection;
