import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Feather, Globe, Palette, Layout } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const stepIcons = [Zap, Feather, Globe, Palette, Layout];

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="relative mb-8">
      <div className="overflow-hidden h-2 mb-6 text-xs flex rounded-full bg-gray-200">
        <motion.div
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const Icon = stepIcons[index];
          return (
            <motion.div
              key={step}
              className={`flex flex-col items-center ${
                index <= currentStep ? "text-purple-600" : "text-gray-400"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  index < currentStep
                    ? "bg-purple-500 text-white"
                    : index === currentStep
                    ? "bg-purple-100 border-2 border-purple-500"
                    : "bg-gray-200"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {index < currentStep ? <Check size={24} /> : <Icon size={24} />}
              </motion.div>
              <div className="text-sm font-medium">{step}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
