"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Feather,
  Globe,
  Palette,
  Layout,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingPopup from "@/components/ui/loading-popup";
import Link from "next/link";
import { colorPalettes, industries, logoTypes } from "@/lib/constant";
import useReadUser from "@/lib/hooks/useReadUser";
import { useRealtimeSubscription } from "@/lib/hooks/useRealtimeSubscription";
import { useUser } from "@/lib/context/useUserContext";
import { toast } from "sonner";
import useLogoGenerator from "@/lib/hooks/useLogoGenerator";

const steps = [
  "Business Name",
  "Slogan (Optional)",
  "Industry",
  "Color Palette",
  "Logo Type",
];

const LogoCreatorLayout: React.FC = () => {
  const { user } = useReadUser();
  const { subscription } = useRealtimeSubscription(user?.id as string);
  const { loading: isUserLoading, user: supabaseUser } = useUser();
  const {
    isLoading: generatingLogo,
    generateLogo,
    error,
    progress,
  } = useLogoGenerator(user?.id as string);

  const [currentStep, setCurrentStep] = useState(0);
  const [logoId, setLogoId] = useState("");
  const [formData, setFormData] = useState({
    businessName: "",
    slogan: "",
    industry: "",
    colorPalette: "",
    logoType: "",
  });

  const [isStepComplete, setIsStepComplete] = useState(false);

  useEffect(() => {
    checkStepCompletion();
  }, [currentStep, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (
      currentStep < steps.length - 1 &&
      (isStepComplete || currentStep === 1)
    ) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === steps.length - 1) {
      if (!user) {
        toast.warning("You must be logged in to generate a logo");
        return;
      }

      const hasInsufficientCredits =
        (subscription?.credits ?? 0) <= 0 &&
        (supabaseUser?.freeCredit ?? 0) <= 0;

      if (hasInsufficientCredits) {
        toast.warning("Please upgrade your account to start generating logo");
        return;
      }

      const logoId = await generateLogo({
        businessName: formData.businessName,
        colorPalette: formData.colorPalette,
        industry: formData.industry,
        logoType: formData.logoType,
        slogan: formData.slogan,
      });

      setLogoId(logoId as string);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleLoadingComplete = async () => {};

  const checkStepCompletion = () => {
    switch (currentStep) {
      case 0:
        setIsStepComplete(formData.businessName.trim() !== "");
        break;
      case 1:
        setIsStepComplete(true); // Slogan is optional
        break;
      case 2:
        setIsStepComplete(formData.industry !== "");
        break;
      case 3:
        setIsStepComplete(formData.colorPalette !== "");
        break;
      case 4:
        setIsStepComplete(formData.logoType !== "");
        break;
      default:
        setIsStepComplete(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
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

  const stepIcons = [Zap, Feather, Globe, Palette, Layout];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
      <LoadingPopup
        isOpen={generatingLogo}
        progress={progress}
        onLoadingComplete={handleLoadingComplete}
      />

      {/* Fixed top slider */}
      <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
              </Button>
            </Link>
            <div className="text-lg font-semibold text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden h-2 mb-6 text-xs flex rounded-full bg-gray-200">
              <motion.div
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
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
                      {index < currentStep ? (
                        <Check size={24} />
                      ) : (
                        <Icon size={24} />
                      )}
                    </motion.div>
                    <div className="text-sm hidden lg:block font-medium">
                      {step}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow overflow-y-auto py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-sm border p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <motion.h2
                className="text-2xl font-medium mb-0 text-gray-700"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {steps[currentStep]}
              </motion.h2>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed bottom navigation */}
      <div className="bg-white border-t border-gray-200 p-6 sticky bottom-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="px-8 py-3 h-12 text-purple-600 border-purple-600 hover:bg-purple-50 transition-all duration-300"
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isStepComplete && currentStep !== 1}
            className="px-8 py-3 h-12 bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}{" "}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoCreatorLayout;
