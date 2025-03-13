import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { colorPalettes, industries, logoTypes } from "@/lib/constant";

interface StepContentProps {
  step: number;
  formData: {
    businessName: string;
    slogan: string;
    industry: string;
    colorPalette: string;
    logoType: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<
    React.SetStateAction<{
      businessName: string;
      slogan: string;
      industry: string;
      colorPalette: string;
      logoType: string;
    }>
  >;
}

const StepContent: React.FC<StepContentProps> = ({
  step,
  formData,
  handleInputChange,
  setFormData,
}) => {
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Input
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="Enter your business name"
            className="text-base h-12 bg-white outline-none ring-offset-0 focus:ring-offset-0 text-gray-800 placeholder-gray-400"
          />
        );
      case 1:
        return (
          <Input
            name="slogan"
            value={formData.slogan}
            onChange={handleInputChange}
            placeholder="Enter your slogan (optional)"
            className="text-base h-12 bg-white outline-none ring-offset-0 focus:ring-offset-0 text-gray-800 placeholder-gray-400"
          />
        );
      case 2:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {industries.map((industry) => (
              <motion.div
                key={industry}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.industry === industry
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, industry }))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-center text-gray-800">{industry}</p>
              </motion.div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colorPalettes.map((palette, index) => (
              <motion.div
                key={palette.name}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.colorPalette === palette.name
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                }`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    colorPalette: palette.name,
                  }))
                }
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {palette.name}
                </h3>
                <div className="flex mb-2">
                  {palette.colors.map((color) => (
                    <div
                      key={color}
                      className="w-8 h-8 rounded-full mr-2"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{palette.description}</p>
              </motion.div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logoTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.logoType === type.name
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, logoType: type.name }))
                }
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {type.name}
                </h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </motion.div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return renderStep();
};

export default StepContent;
