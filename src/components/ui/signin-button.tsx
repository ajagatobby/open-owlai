import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Sparkles } from "lucide-react";

const SignInButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="relative overflow-hidden w-44 rounded-full focus:outline-none"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-shift"></div>
      <div className="relative bg-black bg-opacity-70 rounded-full px-6 py-3 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer-fast"></div>
        <LogIn className="w-5 h-5 mr-2 text-white" />
        <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-blue-400 animate-gradient-text">
          Sign In
        </span>
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-full h-full bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center rounded-full">
              <span className="text-lg font-bold text-white flex items-center">
                Welcome Back{" "}
                <Sparkles className="ml-2 w-5 h-5 text-yellow-400 animate-pulse" />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-transparent opacity-25 animate-pulse-slow"></div>
      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes shimmer-fast {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes gradient-text {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 25%;
          }
          50% {
            opacity: 15%;
          }
        }
        .animate-gradient-shift {
          animation: gradient-shift 3s ease infinite;
          background-size: 200% 200%;
        }
        .animate-shimmer-fast {
          animation: shimmer-fast 1.5s infinite;
        }
        .animate-gradient-text {
          animation: gradient-text 3s ease infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </motion.button>
  );
};

export default SignInButton;
