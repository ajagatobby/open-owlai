import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationBarProps {
  currentStep: number;
  totalSteps: number;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
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
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
