import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Users, CheckCircle, Trophy, Code, Tag } from "lucide-react";
import Navbar from "../components/layout/Navbar";

const PracticePage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const difficultyColors = {
    Easy: "text-green-600 dark:text-green-400",
    Medium: "text-yellow-600 dark:text-yellow-400",
    Hard: "text-red-600 dark:text-red-400",
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/problems");
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter(
    (problem) => filter === "All" || problem.difficulty === filter
  );

  const getAcceptanceRate = (stats) => {
    if (stats.totalSubmissions === 0) return 0;
    return Math.round(
      (stats.acceptedSubmissions / stats.totalSubmissions) * 100
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading problems...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Practice{" "}
            <span className="text-orange-600 dark:text-orange-400">
              Problems
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sharpen your coding skills with our curated collection of DSA
            problems
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-wrap justify-center gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setFilter(difficulty)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === difficulty
                    ? "bg-orange-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Problems Grid */}
        <motion.div
          className="grid gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filteredProblems.map((problem, index) => (
            <motion.div
              key={problem._id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {/* Problem Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Code className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {problem.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        difficultyColors[problem.difficulty]
                      } bg-opacity-10 ${
                        problem.difficulty === "Easy"
                          ? "bg-green-100 dark:bg-green-900"
                          : problem.difficulty === "Medium"
                          ? "bg-yellow-100 dark:bg-yellow-900"
                          : "bg-red-100 dark:bg-red-900"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span>{problem.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>
                        {getAcceptanceRate(problem.stats)}% Acceptance
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{problem.stats.totalSubmissions} Submissions</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {problem.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                    {problem.tags.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                        +{problem.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="lg:ml-6">
                  <Link
                    to={`/practice/${problem.slug}`}
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Code className="h-4 w-4" />
                    Solve Problem
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProblems.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No problems found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filter to see more problems.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PracticePage;
