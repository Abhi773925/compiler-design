import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Code,
  Tag,
  Trophy,
  Lightbulb,
  Sun,
  Moon,
} from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import MonacoCodeEditor from "../components/practice/MonacoCodeEditor";
import TestResults from "../components/practice/TestResults";
import AuthModal from "../components/auth/AuthModal";

const ProblemSolver = () => {
  const { slug } = useParams();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [language, setLanguage] = useState("javascript"); // Support multiple languages
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const difficultyColors = {
    Easy: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900",
    Medium:
      "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900",
    Hard: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900",
  };

  useEffect(() => {
    fetchProblem();
  }, [slug]);

  useEffect(() => {
    // Close auth modal when user logs in
    if (user && authModalOpen) {
      setAuthModalOpen(false);
      toast.success("Welcome! You can now run and submit code.");
    }
  }, [user, authModalOpen]);

  useEffect(() => {
    if (problem && problem.starterCode && problem.starterCode[language]) {
      setCode(problem.starterCode[language]);
    } else if (problem && !problem.starterCode) {
      // Set default starter code based on language
      const defaultCode = {
        javascript: `function solution(input) {
    // Write your solution here
    return ""; // Return your answer
}

// Example usage:
// console.log(solution("your test input"));`,
        cpp: `#include<iostream>
using namespace std;

int main() {
    // Write your solution here
    
    return 0;
}`,
        java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        // Write your solution here
        
    }
}`,
      };
      setCode(defaultCode[language] || defaultCode.javascript);
    }
  }, [problem, language]);

  const fetchProblem = async () => {
    try {
      const response = await fetch(
        `https://compiler-design.onrender.com/api/problems/${slug}`
      );
      const data = await response.json();
      setProblem(data);
      if (data.starterCode && data.starterCode.javascript) {
        setCode(data.starterCode.javascript);
      }
    } catch (error) {
      console.error("Error fetching problem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("You need to be logged in to run code");
      setAuthModalOpen(true);
      return;
    }

    if (!code.trim()) {
      toast.error("Please write some code before running!");
      return;
    }

    setIsRunning(true);
    setTestResults(null);

    try {
      const response = await fetch(
        `https://compiler-design.onrender.com/api/problems/${slug}/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ code, language }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setTestResults({ ...result, type: "run" });
    } catch (error) {
      console.error("Error running code:", error);
      toast.error("Failed to run code. Please try again.");
      setTestResults({
        success: false,
        passedTests: 0,
        totalTests: 0,
        results: [],
        type: "run",
        error:
          "Failed to run code. Please check your connection and try again.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("You need to be logged in to submit solutions");
      setAuthModalOpen(true);
      return;
    }

    if (!code.trim()) {
      toast.error("Please write some code before submitting!");
      return;
    }

    setIsSubmitting(true);
    setTestResults(null);

    try {
      const response = await fetch(
        `https://compiler-design.onrender.com/api/problems/${slug}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ code, language }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setTestResults({ ...result, type: "submit" });

      // Show success/failure toast
      if (result.success) {
        toast.success(
          "Solution submitted successfully! All test cases passed."
        );
      } else {
        toast.error(
          `Solution failed: ${result.passedTests}/${result.totalTests} test cases passed.`
        );
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      toast.error("Failed to submit code. Please try again.");
      setTestResults({
        success: false,
        passedTests: 0,
        totalTests: 0,
        results: [],
        type: "submit",
        error:
          "Failed to submit code. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Problem not found
          </h2>
          <Link
            to="/practice"
            className="text-orange-600 dark:text-orange-400 hover:underline"
          >
            Back to Practice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-black flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/practice"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Practice
            </Link>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {problem.title}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                difficultyColors[problem.difficulty]
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel defaultSize={50} minSize={30} className="flex flex-col">
            {/* Left Panel - Problem Description */}
            <div className="border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900 h-full">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === "description"
                      ? "border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-gray-900"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-900"
                  }`}
                >
                  Problem
                </button>
                <button
                  onClick={() => setActiveTab("solutions")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === "solutions"
                      ? "border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-gray-900"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-900"
                  }`}
                >
                  Editorial
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
                {activeTab === "description" && (
                  <div className="space-y-8">
                    {/* Problem Description */}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        Problem Statement
                      </h2>
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-base">
                          {problem.description}
                        </div>
                      </div>
                    </div>

                    {/* Examples */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        Examples
                      </h3>
                      <div className="space-y-6">
                        {problem.examples.map((example, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-4">
                              Example {index + 1}
                            </div>
                            <div className="space-y-3">
                              <div>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  Input:
                                </span>
                                <div className="mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                                  <code className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                                    {example.input}
                                  </code>
                                </div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  Output:
                                </span>
                                <div className="mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                                  <code className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                                    {example.output}
                                  </code>
                                </div>
                              </div>
                              {example.explanation && (
                                <div>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    Explanation:
                                  </span>
                                  <div className="mt-1 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                    {example.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Constraints */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Constraints
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <ul className="space-y-2">
                          {problem.constraints.map((constraint, index) => (
                            <li
                              key={index}
                              className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2"
                            >
                              <span className="text-orange-600 dark:text-orange-400 mt-1">
                                •
                              </span>
                              <code className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                                {constraint}
                              </code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Topics
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {problem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium border border-orange-200 dark:border-orange-800"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "solutions" && (
                  <div className="text-center py-12">
                    <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Solutions Coming Soon
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Submit your solution first to see editorial solutions and
                      discussion.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-200 dark:bg-gray-700 hover:bg-orange-500 transition-colors duration-200" />

          <Panel defaultSize={50} minSize={30} className="flex flex-col">
            {/* Right Panel - Code Editor */}
            <div className="flex flex-col bg-gray-50 dark:bg-gray-900 h-full">
              {/* Editor Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-gray-900 dark:text-white"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded text-xs font-medium">
                      {language === "javascript"
                        ? "ES6+"
                        : language === "cpp"
                        ? "C++17"
                        : "Java 15"}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                      title={`Switch to ${
                        theme === "dark" ? "light" : "dark"
                      } mode`}
                    >
                      {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={handleRun}
                      disabled={isRunning}
                      className={`flex items-center gap-2 ${
                        !user
                          ? "bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500"
                          : "bg-gray-600 hover:bg-gray-700"
                      } disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md`}
                      title={!user ? "Please log in to run code" : ""}
                    >
                      <Play className="h-4 w-4" />
                      {isRunning
                        ? "Running..."
                        : !user
                        ? "Run Code (Login Required)"
                        : "Run Code"}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`flex items-center gap-2 ${
                        !user
                          ? "bg-orange-400 hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500"
                          : "bg-orange-600 hover:bg-orange-700"
                      } disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md`}
                      title={!user ? "Please log in to submit solutions" : ""}
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting
                        ? "Submitting..."
                        : !user
                        ? "Submit (Login Required)"
                        : "Submit Solution"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 p-4 min-h-0">
                <div className="h-full w-full">
                  <MonacoCodeEditor
                    code={code}
                    onChange={setCode}
                    language="javascript"
                  />
                </div>
              </div>

              {/* Test Results */}
              {testResults && (
                <div className="border-t border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                  <TestResults results={testResults} />
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default ProblemSolver;
