"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiHome, FiAlertCircle, FiArrowRight } from "react-icons/fi";

const Custom404: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
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

          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Page Not Found
          </h2>

          <p className="text-center text-gray-600 mb-8">
            Oops! It seems you've ventured into uncharted territory. The page
            you're looking for doesn't exist or has been moved.
          </p>

          <div className="space-y-4">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-indigo-600 p-1 rounded-xl"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/"
                className="block bg-white rounded-lg py-3 px-4 text-center font-medium text-purple-600 hover:bg-opacity-90 transition duration-300"
              >
                <div className="flex items-center justify-center">
                  <FiHome className="w-5 h-5 mr-2" />
                  Return to Home
                </div>
              </Link>
            </motion.div>

            {/* <motion.div
              className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 py-3 px-4 text-white font-medium hover:from-purple-600 hover:to-indigo-700 transition duration-300">
                <div className="flex items-center justify-center">
                  Contact Support
                  <FiArrowRight className="w-5 h-5 ml-2" />
                </div>
              </button>
            </motion.div> */}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white"
        >
          <h3 className="text-xl font-semibold mb-2">Lost in Cyberspace?</h3>
          <p className="mb-4">
            Don't worry, even the best explorers sometimes take a wrong turn!
          </p>
          <motion.div
            className="flex items-center text-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="mr-2">Error Code:</span>
            <motion.span
              className="font-mono bg-white bg-opacity-20 px-2 py-1 rounded"
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
              404_PAGE_NOT_FOUND
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Custom404;
