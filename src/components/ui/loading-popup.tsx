"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingPopupProps {
  isOpen: boolean;
  progress?: number;
  onLoadingComplete?: () => void;
  page?: "stable-difussion";
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({
  isOpen,
  progress = 100,
  onLoadingComplete,
  page,
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(
        () => {
          setDisplayProgress((prev) => {
            if (prev >= progress) {
              clearInterval(interval);
              return progress;
            }
            return prev + 1;
          });
        },
        page === "stable-difussion" ? 800 : 50
      );

      return () => clearInterval(interval);
    }
  }, [isOpen, progress]);

  useEffect(() => {
    if (displayProgress >= 100) {
      onLoadingComplete?.();
    }
  }, [displayProgress, onLoadingComplete]);

  if (!isOpen) return null;

  const particles = Array.from({ length: 50 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-white rounded-full"
      initial={{
        opacity: 0,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        repeatType: "loop",
      }}
    />
  ));

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 z-50 overflow-hidden"
      >
        {particles}
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
            className="mb-8"
          >
            <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100">
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, type: "spring", stiffness: 100 }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#4cb"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: displayProgress / 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  rotate: -90,
                  transformOrigin: "50% 50%",
                }}
              />
            </svg>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-6xl font-bold text-white"
            >
              <motion.span
                key={displayProgress}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {Math.round(displayProgress)}%
              </motion.span>
            </motion.div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
            className="text-3xl font-semibold text-white mb-4"
          >
            {page === "stable-difussion" ? "Generating" : "Creating Your Logo"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 100 }}
            className="text-xl text-purple-200"
          >
            {page === "stable-difussion"
              ? "Please wait while we are transforming your photos..."
              : "Please wait while we generate your unique design..."}
          </motion.p>
          <motion.div
            className="mt-8 flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {["Sketching", "Coloring", "Refining"].map((step, index) => (
              <motion.div
                key={step}
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default LoadingPopup;
