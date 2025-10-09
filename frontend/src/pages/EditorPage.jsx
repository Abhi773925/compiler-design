import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Play,
  Terminal,
  Users,
  Video,
  MessageSquare,
  FileCode,
  Save,
} from "lucide-react";
import { Button } from "../components/ui/Button";

const EditorPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-16">
      <div className="h-full flex flex-col">
        {/* Editor Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Collaborative Code Editor
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Connected
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button size="sm">
                <Play className="h-4 w-4 mr-1" />
                Run
              </Button>
            </div>
          </div>
        </div>

        {/* Main Editor Layout */}
        <div className="flex-1 flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Collaborators
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white">
                      A
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      You
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Tools
                </h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Terminal className="h-4 w-4 mr-2" />
                    Terminal
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2">
              <div className="flex items-center space-x-2">
                <FileCode className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  main.js
                </span>
              </div>
            </div>

            <div className="flex-1 bg-gray-900 relative">
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center">
                  <Code className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Editor Coming Soon
                  </h2>
                  <p className="text-gray-300 mb-6 max-w-md">
                    We're building an amazing collaborative code editor with
                    live collaboration, video calls, chat, and integrated
                    terminal access.
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <motion.div
                      className="bg-gray-800 p-4 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Users className="h-6 w-6 text-orange-500 mb-2" />
                      <div className="text-sm text-white font-medium">
                        Live Collaboration
                      </div>
                      <div className="text-xs text-gray-400">
                        Real-time editing
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-gray-800 p-4 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Video className="h-6 w-6 text-orange-500 mb-2" />
                      <div className="text-sm text-white font-medium">
                        Video Calls
                      </div>
                      <div className="text-xs text-gray-400">
                        Integrated conferencing
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-gray-800 p-4 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Terminal className="h-6 w-6 text-orange-500 mb-2" />
                      <div className="text-sm text-white font-medium">
                        Terminal
                      </div>
                      <div className="text-xs text-gray-400">
                        GitHub integration
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-gray-800 p-4 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <MessageSquare className="h-6 w-6 text-orange-500 mb-2" />
                      <div className="text-sm text-white font-medium">Chat</div>
                      <div className="text-xs text-gray-400">
                        Team communication
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
