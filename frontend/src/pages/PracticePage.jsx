import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Clock, 
  Users, 
  CheckCircle, 
  Trophy, 
  Code, 
  Tag, 
  Search,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import Navbar from "../components/layout/Navbar";

const PracticePage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const difficultyColors = {
    Easy: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    Medium: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    Hard: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await fetch("https://compiler-design.onrender.com/api/problems");
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredProblems = problems.filter((problem) => {
    const matchesDifficulty = filter === "All" || problem.difficulty === filter;
    const matchesSearch = 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesDifficulty && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProblems = filteredProblems.slice(startIndex, endIndex);

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const getAcceptanceRate = (stats) => {
    if (stats.totalSubmissions === 0) return 0;
    return Math.round(
      (stats.acceptedSubmissions / stats.totalSubmissions) * 100
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            Master coding interviews with LeetCode Blind 75 - the most essential problems
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search problems, tags, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setFilter(difficulty)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === difficulty
                    ? "bg-orange-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>

          {/* Results Info */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProblems.length)} of {filteredProblems.length} problems
              {searchQuery && (
                <span className="ml-2">
                  for "<span className="font-medium text-orange-600 dark:text-orange-400">{searchQuery}</span>"
                </span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Problems List */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {currentProblems.map((problem, index) => (
            <motion.div
              key={problem._id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Problem Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                        {problem.title}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium border ${
                        difficultyColors[problem.difficulty]
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>{problem.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>{getAcceptanceRate(problem.stats)}% Acceptance</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{problem.stats.totalSubmissions} Submissions</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {problem.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {problem.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs">
                        +{problem.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="lg:ml-6 flex-shrink-0">
                  <Link
                    to={`/practice/${problem.slug}`}
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
                  >
                    <Code className="h-4 w-4" />
                    Solve
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-orange-600 text-white shadow-lg"
                          : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span
                      key={page}
                      className="px-2 py-2 text-gray-400 dark:text-gray-600"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredProblems.length === 0 && !loading && (
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
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery ? "Try adjusting your search query" : "Try adjusting your filter to see more problems."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-orange-600 dark:text-orange-400 hover:underline"
              >
                Clear search
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PracticePage;
