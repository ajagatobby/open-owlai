import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const UltraPremiumCreditsButton: React.FC<{ credits: number }> = ({
  credits,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayedCredits, setDisplayedCredits] = useState(credits);

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setDisplayedCredits((prev) => (prev < credits ? prev + 1 : credits));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setDisplayedCredits(credits);
    }
  }, [isHovered, credits]);

  return (
    <motion.button
      className="relative overflow-hidden rounded-lg sm:rounded-2xl p-0.5 sm:p-1 focus:outline-none"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 animate-gradient-shift"></div>
      <div className="relative bg-black bg-opacity-80 rounded-md sm:rounded-xl px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer-fast"></div>
        <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 mr-1.5 sm:mr-2 text-yellow-400 animate-pulse" />
        <span className="text-sm sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-white to-yellow-400 animate-gradient-text">
          {displayedCredits} Credits
        </span>
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center rounded-md sm:rounded-xl">
              <span className="text-xs sm:text-lg font-bold text-white">
                Premium Power!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </motion.button>
  );
};

export default UltraPremiumCreditsButton;
