"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiAlertCircle, FiRefreshCcw, FiHome } from "react-icons/fi";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
  const errorMessage: string = error.message || "An unexpected error occurred";
  const errorDigest: string | undefined = error.digest;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full"
      >
        <div className="p-8">
          <motion.div
            className="w-24 h-24 bg-red-500 rounded-full mx-auto mb-6 flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <FiAlertCircle className="text-white w-12 h-12" />
          </motion.div>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-center text-gray-600 mb-6">{errorMessage}</p>

          <div className="space-y-4">
            <motion.button
              onClick={reset}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium py-3 px-4 rounded-xl hover:from-red-600 hover:to-orange-600 transition duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiRefreshCcw className="w-5 h-5 mr-2" />
              Try Again
            </motion.button>

            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-xl"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/"
                className="block bg-white rounded-lg py-3 px-4 text-center font-medium text-blue-600 hover:bg-opacity-90 transition duration-300"
              >
                <div className="flex items-center justify-center">
                  <FiHome className="w-5 h-5 mr-2" />
                  Return to Home
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        {errorDigest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white"
          >
            <h3 className="text-lg font-semibold mb-2">Error Details</h3>
            <motion.div
              className="flex items-center text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="mr-2">Error Digest:</span>
              <motion.span
                className="font-mono bg-white bg-opacity-10 px-2 py-1 rounded"
                animate={{
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {errorDigest}
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ErrorPage;
