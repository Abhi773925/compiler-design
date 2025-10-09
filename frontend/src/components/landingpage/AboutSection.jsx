import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Lightbulb,
  Heart,
  Rocket,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const AboutSection = () => {
  const stats = [
    {
      number: "10K+",
      label: "Active Developers",
      icon: Users,
    },
    {
      number: "50K+",
      label: "Problems Solved",
      icon: Lightbulb,
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: Heart,
    },
    {
      number: "24/7",
      label: "Platform Uptime",
      icon: Rocket,
    },
  ];

  const teamValues = [
    {
      title: "Innovation First",
      description:
        "We're constantly pushing the boundaries of collaborative coding, bringing you cutting-edge features that make programming more intuitive and enjoyable.",
    },
    {
      title: "Community Driven",
      description:
        "Built by developers, for developers. Every feature is designed based on real feedback from our vibrant community of programmers worldwide.",
    },
    {
      title: "Learning Focused",
      description:
        "We believe in learning through collaboration. Our platform is designed to help you grow as a developer while working on exciting projects.",
    },
  ];

  return (
    <section className="min-h-screen py-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              PrepMate
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Empowering developers worldwide to collaborate, learn, and build
            amazing projects together. PrepMate is more than just a
            platform—it's a community of passionate programmers.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                We're on a mission to revolutionize how developers collaborate
                and learn. PrepMate breaks down the barriers of traditional
                coding by providing a seamless, real-time collaborative
                environment where ideas flourish and innovation thrives.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Whether you're a beginner taking your first steps in programming
                or an experienced developer working on complex projects,
                PrepMate provides the tools and community you need to succeed.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </motion.a>
              <motion.a
                href="#"
                className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </motion.a>
              <motion.a
                href="#"
                className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right Values */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Our Values
            </h3>

            {teamValues.map((value, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl p-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to join our community?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Start your journey with PrepMate today and become part of a global
            community of developers who are passionate about code,
            collaboration, and continuous learning.
          </p>
          <motion.button
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
            <Rocket className="ml-2 h-6 w-6" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
