"use client";
import React, { useState, useEffect, useCallback } from "react";
import { REPLICATE_MODELS } from "@/lib/replicateModels";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Image as ImageIcon,
  Sliders,
  Wand2,
  ArrowLeft,
  X,
  Plus,
  Loader,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useDropzone } from "@uploadthing/react";
import { toast } from "sonner";
import { useReplicateModels } from "@/lib/hooks/useReplicateModel";
import LoadingPopup from "@/components/ui/loading-popup";
import { handleDownload } from "@/lib/utils";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadThing";

const steps = ["Upload Image", "Generate Cartoon"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

type CartoonifyInputReadonly = (typeof REPLICATE_MODELS)["CARTOONIFY"]["input"];

type CartoonifyInput = {
  -readonly [K in keyof CartoonifyInputReadonly]: CartoonifyInputReadonly[K] extends
    | string
    | number
    | boolean
    ? CartoonifyInputReadonly[K]
    : string | number | boolean;
};

const CartoonifyPage: React.FC = () => {
  const { runModel, result, error, isLoading } =
    useReplicateModels("CARTOONIFY");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CartoonifyInput>({
    image: "",
    seed: 0,
  });
  const [uploadedImage, setUploadedImage] = useState<{
    id: string;
    preview: string;
  } | null>(null);
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        const file = res[0];
        setUploadedImage({ id: file.key, preview: file.url });
        setFormData((prev: any) => ({ ...prev, image: file.url }));
      }
      setUploading(false);
    },
    onUploadError: (error: Error) => {
      console.error("Upload Error:", error);
      toast.error("Failed to upload image");
      setUploading(false);
    },
    onUploadBegin: () => {
      setUploading(true);
    },
  });

  useEffect(() => {
    checkStepCompletion();
  }, [currentStep, formData, uploadedImage]);

  useEffect(() => {
    if (typeof result === "string") {
      setResultImage(result);
    }
  }, [result]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.size <= MAX_FILE_SIZE) {
        startUpload([file]);
      } else {
        toast.error(`File exceeds the maximum limit of 3MB`);
      }
    },
    [startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const removeImage = useCallback(() => {
    setUploadedImage(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  }, []);

  const handleNext = async () => {
    if (currentStep < steps.length - 1 && isStepComplete) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === steps.length - 1) {
      setResultImage(null); // Clear previous result
      await runModel(formData as CartoonifyInputReadonly);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const checkStepCompletion = () => {
    switch (currentStep) {
      case 0:
        setIsStepComplete(!!uploadedImage);
        break;
      case 1:
        setIsStepComplete(true); // Always allow to proceed from settings
        break;
      case 2:
        setIsStepComplete(true); // Always allow to generate
        break;
      default:
        setIsStepComplete(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Please upload an image to cartoonify. The model works best
                    with clear, high-contrast images.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center" {...getRootProps()}>
              <div className="w-full max-w-md p-6 border-2 border-dashed border-purple-300 rounded-lg text-center cursor-pointer transition-all duration-300 hover:border-purple-500 hover:bg-purple-50">
                <input {...getInputProps()} />
                <Plus className="mx-auto h-12 w-12 text-purple-400 mb-4" />
                <p className="text-sm font-medium text-purple-600 mb-1">
                  Upload Image
                </p>
                <p className="text-xs text-gray-500">
                  {isDragActive
                    ? "Drop the image here..."
                    : "Drag and drop or click to select an image (Max 3MB)"}
                </p>
              </div>
            </div>
            {uploading && (
              <div className="flex justify-center items-center">
                <Loader className="w-6 h-6 animate-spin text-purple-500" />
                <span className="ml-2 text-purple-500">Uploading...</span>
              </div>
            )}
            {uploadedImage && (
              <div className="relative group">
                <Image
                  src={uploadedImage.preview}
                  alt="Uploaded image"
                  width={500}
                  height={200}
                  layout="responsive"
                  objectFit="cover"
                  className="rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white bg-opacity-75 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            {resultImage ? (
              <div className="relative group">
                <Image
                  src={resultImage}
                  alt="Cartoonifiy Image"
                  width={500}
                  height={500}
                  layout="responsive"
                  objectFit="contain"
                  className="rounded-lg shadow-lg"
                />
                <div
                  onClick={() => handleDownload(resultImage)}
                  className="absolute top-2 right-2 cursor-pointer bg-white bg-opacity-75 text-blue-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p>Click "Generate" to create your cartoonified image!</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const stepIcons = [ImageIcon, Wand2];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
      <Head>
        <title>Cartoonify Image</title>
        <meta
          name="description"
          content="Professional image cartoonification tool"
        />
      </Head>

      {/* Progress bar and steps */}
      <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto">
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
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
                        <Check size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </motion.div>
                    <div className="text-xs text-center font-medium">
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
        <div className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-sm border p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <motion.h2
                className="text-xl font-medium mb-4 text-gray-700"
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

        {error && (
          <div className="max-w-2xl mx-auto mt-4 bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm">
            Error: {error}
          </div>
        )}
      </div>

      {isLoading && <LoadingPopup page="stable-difussion" isOpen={isLoading} />}

      {/* Navigation buttons */}
      <div className="bg-white border-t border-gray-200 p-6 sticky bottom-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="px-6 py-2 text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isStepComplete || isLoading}
            className="px-6 py-2 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? (
              isLoading ? (
                <Loader className="w-6 h-6 mr-2 animate-spin text-white" />
              ) : (
                ""
              )
            ) : (
              ""
            )}
            {currentStep === steps.length - 1
              ? isLoading
                ? "Generating..."
                : "Generate"
              : "Next"}

            {!isLoading && <ChevronRight className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartoonifyPage;
