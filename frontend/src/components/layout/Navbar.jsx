import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  Code,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import AuthModal from "../auth/AuthModal";
import { cn } from "../../lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Problems", href: "#problems" },
    { name: "About", href: "#about" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/" className="flex items-center">
                <Code className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-2" />
                <span className="font-bold text-xl text-gray-900 dark:text-white">
                  PrepMate
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.a>
                ))}
                <Link
                  to="/editor"
                  className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Editor
                </Link>
                <Link
                  to="/practice"
                  className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Practice
                </Link>
              </div>
            </div>

            {/* Right side items - Minimal with Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>

              {/* User section or Get Started */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="h-8 w-8 rounded-full border-2 border-orange-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(user.name) +
                            "&background=orange&color=fff";
                        }}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full border-2 border-orange-500 bg-orange-400 flex items-center justify-center text-white font-medium">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-gray-500 transition-transform duration-200",
                        profileDropdownOpen && "rotate-180"
                      )}
                    />
                  </Button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                      >
                        {/* User Info Section */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            {user.picture ? (
                              <img
                                src={user.picture}
                                alt={user.name}
                                className="h-10 w-10 rounded-full"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://ui-avatars.com/api/?name=" +
                                    encodeURIComponent(user.name) +
                                    "&background=orange&color=fff";
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-medium">
                                {user.name?.charAt(0) || "U"}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <User className="h-4 w-4 mr-3 text-gray-400" />
                            My Profile
                          </Link>

                          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Get Started
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 dark:text-gray-300"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            className={cn("md:hidden", isOpen ? "block" : "hidden")}
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isOpen ? 1 : 0,
              height: isOpen ? "auto" : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Theme
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-gray-600 dark:text-gray-300"
                >
                  {theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {/* Mobile User Section */}
              <div className="pt-2">
                {user ? (
                  <div className="space-y-2">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="h-10 w-10 rounded-full border-2 border-orange-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(user.name) +
                              "&background=orange&color=fff";
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full border-2 border-orange-500 bg-orange-400 flex items-center justify-center text-white font-medium">
                          {user.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <User className="h-4 w-4 mr-3 text-gray-400" />
                        My Profile
                      </button>

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => {
                      setAuthModalOpen(true);
                      setIsOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
