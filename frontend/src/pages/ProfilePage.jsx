import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/layout/Navbar";
import AuthModal from "../components/auth/AuthModal";
import toast from "react-hot-toast";
import {
  User,
  Trophy,
  Calendar,
  Code2,
  Mail,
  Award,
  Clock,
  CheckCircle,
  Star,
  Sun,
  Moon,
  ArrowLeft,
  Target,
  TrendingUp,
  Activity,
  BookOpen,
  Zap,
  Users,
  GitBranch,
  Flame,
} from "lucide-react";

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Check if user is authenticated when component mounts
  useEffect(() => {
    if (!authLoading && !user) {
      // User is not logged in
      toast.error("You need to be logged in to view your profile");
      setAuthModalOpen(true);
      setLoading(false);
      return;
    }

    if (user && authModalOpen) {
      // User just logged in, close modal
      setAuthModalOpen(false);
      toast.success("Welcome! Loading your profile...");
    }
  }, [user, authLoading, authModalOpen]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return; // Don't fetch if no user

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          setProfileData(data.profile);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const difficultyBorderColors = {
    easy: "border-green-500",
    medium: "border-yellow-500",
    hard: "border-red-500",
  };

  // Chart component for problem distribution
  const ProblemChart = ({ data }) => {
    const total = data.easy + data.medium + data.hard;
    const easyPercent = total > 0 ? (data.easy / total) * 100 : 0;
    const mediumPercent = total > 0 ? (data.medium / total) * 100 : 0;
    const hardPercent = total > 0 ? (data.hard / total) * 100 : 0;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Easy problems arc */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="rgb(34, 197, 94)"
                strokeWidth="8"
                strokeDasharray={`${easyPercent * 2.2} 220`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              {/* Medium problems arc */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="rgb(234, 179, 8)"
                strokeWidth="8"
                strokeDasharray={`${mediumPercent * 2.2} 220`}
                strokeDashoffset={`-${easyPercent * 2.2}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              {/* Hard problems arc */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="rgb(239, 68, 68)"
                strokeWidth="8"
                strokeDasharray={`${hardPercent * 2.2} 220`}
                strokeDashoffset={`-${(easyPercent + mediumPercent) * 2.2}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {total}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Solved
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Easy
              </span>
            </div>
            <div className="text-lg font-bold text-green-600">{data.easy}</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Medium
              </span>
            </div>
            <div className="text-lg font-bold text-yellow-600">
              {data.medium}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Hard
              </span>
            </div>
            <div className="text-lg font-bold text-red-600">{data.hard}</div>
          </div>
        </div>
      </div>
    );
  };

  // Show auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[calc(100vh-5rem)] bg-white dark:bg-black">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Checking authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show login required state when user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[calc(100vh-5rem)] bg-white dark:bg-black">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <User className="h-10 w-10 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Login Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to be logged in to view your profile. Please sign in to
              continue.
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Sign In to Continue
            </button>
            <div className="mt-4">
              <Link
                to="/"
                className="text-orange-600 dark:text-orange-400 hover:underline text-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[calc(100vh-5rem)] bg-white dark:bg-black">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[calc(100vh-5rem)] bg-white dark:bg-black">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Profile not found
            </h2>
            <Link
              to="/"
              className="text-orange-600 dark:text-orange-400 hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { user: userData, solvedProblems } = profileData;
  const totalSolved = userData.stats.totalProblems;
  const chartData = {
    easy: userData.stats.easyProblems,
    medium: userData.stats.mediumProblems,
    hard: userData.stats.hardProblems,
  };

  // Calculate streaks and additional stats
  const recentSolves = Object.values(solvedProblems)
    .flat()
    .sort((a, b) => new Date(b.solvedAt) - new Date(a.solvedAt));

  const languagesUsed = [...new Set(recentSolves.map((p) => p.language))];
  const currentStreak = 0; // You can implement streak calculation logic here
  const maxStreak = 0; // You can implement max streak calculation logic here

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      {/* Header Section */}
      <div className="pt-20 bg-white dark:bg-black">
        <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-black dark:via-black dark:to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                My Profile
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Track your coding journey, monitor progress, and celebrate
                achievements.
              </p>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center text-center lg:text-left lg:flex-row lg:items-start gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden ring-4 ring-orange-100 dark:ring-orange-900">
                      {userData.picture ? (
                        <img
                          src={userData.picture}
                          alt={userData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        userData.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userData.name}
                    </h2>
                    <div className="flex flex-col lg:flex-row items-center gap-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{userData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Member since{" "}
                          {new Date(userData.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "long", year: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {languagesUsed.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex-1 lg:ml-auto">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {totalSolved}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Problems Solved
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {currentStreak}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Current Streak
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {maxStreak}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Max Streak
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {languagesUsed.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Languages
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 bg-white dark:bg-black">
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userData.stats.easyProblems}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Easy Problems
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Target className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userData.stats.mediumProblems}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Medium Problems
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userData.stats.hardProblems}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Hard Problems
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalSolved}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Solved
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === "overview"
                    ? "border-b-2 border-orange-600 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Overview
                </div>
              </button>
              <button
                onClick={() => setActiveTab("problems")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === "problems"
                    ? "border-b-2 border-orange-600 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Solved Problems ({totalSolved})
                </div>
              </button>
              <button
                onClick={() => setActiveTab("achievements")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === "achievements"
                    ? "border-b-2 border-orange-600 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Award className="h-4 w-4" />
                  Achievements
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Problem Distribution Chart */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      Problem Distribution
                    </h3>
                    <ProblemChart data={chartData} />
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      Recent Activity
                    </h3>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {recentSolves.slice(0, 8).map((problem, index) => (
                        <div
                          key={`${problem.id}-${problem.solvedAt}-${index}`}
                          className="flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/practice/${problem.slug}`}
                              className="font-medium text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 truncate block"
                            >
                              {problem.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  difficultyColors[
                                    problem.difficulty.toLowerCase()
                                  ]
                                }`}
                              >
                                {problem.difficulty}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Code2 className="h-3 w-3" />
                                {problem.language}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(problem.solvedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {recentSolves.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>
                            No problems solved yet. Start your coding journey!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Summary */}
                  <div className="lg:col-span-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      Coding Journey Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                          {totalSolved}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          Total Problems Conquered
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                          {languagesUsed.length}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          Programming Languages Mastered
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {Math.floor(
                            (Date.now() - new Date(userData.createdAt)) /
                              (1000 * 60 * 60 * 24)
                          )}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          Days on Platform
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "problems" && (
                <div className="space-y-8">
                  {["easy", "medium", "hard"].map((difficulty) => (
                    <div key={difficulty}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 capitalize flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            difficulty === "easy"
                              ? "bg-green-500"
                              : difficulty === "medium"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        {difficulty} Problems (
                        {solvedProblems[difficulty].length})
                      </h3>

                      {solvedProblems[difficulty].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {solvedProblems[difficulty].map((problem) => (
                            <Link
                              key={problem.id}
                              to={`/practice/${problem.slug}`}
                              className="group"
                            >
                              <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-lg hover:scale-105">
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                                    {problem.title}
                                  </h4>
                                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                                </div>

                                <div className="flex items-center justify-between text-sm mb-3">
                                  <span
                                    className={`px-3 py-1 rounded-full font-medium ${
                                      difficultyColors[
                                        problem.difficulty.toLowerCase()
                                      ]
                                    }`}
                                  >
                                    {problem.difficulty}
                                  </span>
                                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <Code2 className="h-3 w-3" />
                                    {problem.language}
                                  </div>
                                </div>

                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Solved on{" "}
                                  {new Date(
                                    problem.solvedAt
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
                          <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No {difficulty} problems solved yet
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                            Challenge yourself with some {difficulty} problems!
                          </p>
                          <Link
                            to="/practice"
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <BookOpen className="h-4 w-4" />
                            Browse Problems
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "achievements" && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Your Achievements
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Celebrate your coding milestones and progress!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* First Problem Solved */}
                    <div
                      className={`p-6 rounded-xl border-2 ${
                        totalSolved > 0
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            totalSolved > 0 ? "bg-green-500" : "bg-gray-400"
                          }`}
                        >
                          <Star className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          First Steps
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {totalSolved > 0
                            ? "Solved your first problem!"
                            : "Solve your first problem"}
                        </p>
                      </div>
                    </div>

                    {/* Problem Solver */}
                    <div
                      className={`p-6 rounded-xl border-2 ${
                        totalSolved >= 10
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            totalSolved >= 10 ? "bg-blue-500" : "bg-gray-400"
                          }`}
                        >
                          <Trophy className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Problem Solver
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {totalSolved >= 10
                            ? "Solved 10+ problems!"
                            : `Solve ${10 - totalSolved} more problems`}
                        </p>
                      </div>
                    </div>

                    {/* Coding Master */}
                    <div
                      className={`p-6 rounded-xl border-2 ${
                        totalSolved >= 50
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            totalSolved >= 50 ? "bg-purple-500" : "bg-gray-400"
                          }`}
                        >
                          <Award className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Coding Master
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {totalSolved >= 50
                            ? "Solved 50+ problems!"
                            : `Solve ${50 - totalSolved} more problems`}
                        </p>
                      </div>
                    </div>

                    {/* Multi-Language */}
                    <div
                      className={`p-6 rounded-xl border-2 ${
                        languagesUsed.length >= 2
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            languagesUsed.length >= 2
                              ? "bg-orange-500"
                              : "bg-gray-400"
                          }`}
                        >
                          <Code2 className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Polyglot
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {languagesUsed.length >= 2
                            ? "Used multiple languages!"
                            : "Use 2+ programming languages"}
                        </p>
                      </div>
                    </div>

                    {/* Hard Problem Solver */}
                    <div
                      className={`p-6 rounded-xl border-2 ${
                        userData.stats.hardProblems > 0
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            userData.stats.hardProblems > 0
                              ? "bg-red-500"
                              : "bg-gray-400"
                          }`}
                        >
                          <Zap className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Challenge Accepted
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {userData.stats.hardProblems > 0
                            ? "Solved a hard problem!"
                            : "Solve a hard problem"}
                        </p>
                      </div>
                    </div>

                    {/* Dedicated Learner */}
                    <div
                      className={`p-6 rounded-xl border-2 ${
                        totalSolved >= 25
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            totalSolved >= 25 ? "bg-indigo-500" : "bg-gray-400"
                          }`}
                        >
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Dedicated Learner
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {totalSolved >= 25
                            ? "Solved 25+ problems!"
                            : `Solve ${25 - totalSolved} more problems`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
