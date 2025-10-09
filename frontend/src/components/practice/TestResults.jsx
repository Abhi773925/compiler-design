import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Trophy,
  Target,
} from "lucide-react";

const TestResults = ({ results }) => {
  const [expandedTest, setExpandedTest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const {
    success,
    passedTests,
    totalTests,
    results: testCases,
    type,
  } = results;

  const toggleTestExpansion = (index) => {
    setExpandedTest(expandedTest === index ? null : index);
  };

  const getStatusIcon = (passed) => {
    return passed ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusColor = (passed) => {
    return passed
      ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
      : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20";
  };

  return (
    <div className="max-h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {success ? (
            <Trophy className="h-6 w-6 text-green-500" />
          ) : (
            <Target className="h-6 w-6 text-red-500" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {type === "run" ? "Test Run Results" : "Submission Results"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {passedTests} of {totalTests} test cases passed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              success
                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
            }`}
          >
            {success ? "Accepted" : "Failed"}
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {showDetails ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showDetails ? "Hide" : "Show"} Details
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.round((passedTests / totalTests) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${
              success ? "bg-green-500" : "bg-red-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${(passedTests / totalTests) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Test Cases */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {testCases.map((testCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`border rounded-lg overflow-hidden transition-all duration-200 ${getStatusColor(
                  testCase.passed
                )}`}
              >
                <button
                  onClick={() => toggleTestExpansion(index)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-opacity-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(testCase.passed)}
                    <span className="font-medium text-gray-900 dark:text-white">
                      Test Case {index + 1}
                      {testCase.isHidden && (
                        <span className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                          Hidden
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        testCase.passed
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {testCase.passed ? "Passed" : "Failed"}
                    </span>
                    {expandedTest === index ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedTest === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-800"
                    >
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            Input:
                          </span>
                          <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 overflow-x-auto">
                            {testCase.input}
                          </pre>
                        </div>

                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            Expected Output:
                          </span>
                          <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 overflow-x-auto">
                            {testCase.expectedOutput}
                          </pre>
                        </div>

                        {testCase.actualOutput !== undefined && (
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              Your Output:
                            </span>
                            <pre
                              className={`mt-1 p-2 rounded overflow-x-auto ${
                                testCase.passed
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                  : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                              }`}
                            >
                              {testCase.actualOutput}
                            </pre>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      {!showDetails && (
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
          Click "Show Details" to see individual test case results
        </div>
      )}
    </div>
  );
};

export default TestResults;
