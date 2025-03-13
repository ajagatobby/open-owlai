"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Star, Crown, ChevronRight, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// Note: Ensure these components are available in your project
import Container from "@/components/section/container";
import AppBar from "@/components/section/appbar";
import { Button } from "@/components/ui/button";

const subscriptionPlans = [
  {
    name: "Basic",
    futurePrice: 25,
    visiblePrice: 12.99,
    icon: Zap,
    features: [
      "60 logos per month",
      "Make logo generated private",
      "Email support",
      "Access to new features",
      "Basic editing tools",
      "Community forums access",
    ],
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "Professional",
    futurePrice: 45,
    visiblePrice: 24.99,
    icon: Star,
    features: [
      "180 logos per month",
      "Make logo generated private",
      "Priority email & chat support",
      "Early access to new features",
      "Advanced editing tools",
      "Exclusive webinars & tutorials",
    ],
    color: "from-purple-400 to-purple-600",
    recommended: true,
  },
  {
    name: "Premium",
    futurePrice: 99,
    visiblePrice: 44.99,
    icon: Crown,
    features: [
      "300 logos per month",
      "Make logo generated private",
      "24/7 priority support",
      "First access to new features",
      "Premium editing suite",
      "Custom branding solutions",
    ],
    color: "from-yellow-400 to-yellow-600",
  },
];

const PricingPage: React.FC = () => {
  const [annualBilling, setAnnualBilling] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if the user just signed in and was redirected back
    const justSignedIn = searchParams.get("signedIn") === "true";
    if (justSignedIn) {
      // You can add any post-signin logic here
      console.log("User just signed in and was redirected back");
    }
  }, [searchParams]);

  const getDiscountedPrice = (price: number) => {
    return annualBilling ? price * 0.9 : price;
  };

  const handleButtonClick = () => {
    const currentPageUrl = window.location.pathname + window.location.search;
    const signinUrl = `/signin?redirect=${encodeURIComponent(currentPageUrl)}`;
    router.push(signinUrl);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar />
      <Container className="py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16"
          >
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Unlock your full creative potential with our tailored subscription
              plans. Find the perfect fit for your logo design needs for a
              fraction.
            </p>
            <div className="flex justify-center items-center mb-12">
              <span
                className={`mr-3 font-medium ${
                  annualBilling ? "text-gray-500" : "text-gray-900"
                }`}
              >
                Monthly
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={annualBilling}
                  onChange={() => setAnnualBilling(!annualBilling)}
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
              <span
                className={`ml-3 font-medium ${
                  annualBilling ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Annual
              </span>
              {annualBilling && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                  Save 10%
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                    plan.recommended
                      ? "border-2 border-yellow-400"
                      : "border border-gray-200"
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 right-0 bg-yellow-400 text-white px-2 py-1 text-sm font-semibold">
                      Best Value
                    </div>
                  )}
                  <div
                    className={`absolute inset-x-0 h-2 bg-gradient-to-r ${plan.color}`}
                  />
                  <div className="p-8">
                    <div
                      className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}
                    >
                      <plan.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-500 line-through mb-1">
                        ${plan.futurePrice}/mo
                      </p>
                      <p className="text-5xl font-bold text-purple-600">
                        ${getDiscountedPrice(plan.visiblePrice).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        per {annualBilling ? "year" : "month"}
                      </p>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-700">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full py-4 h-12 text-lg font-medium rounded-xl bg-gradient-to-r ${
                        plan.recommended
                          ? "from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
                          : "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      } transition-all duration-300`}
                      onClick={handleButtonClick}
                    >
                      Subscribe now
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default PricingPage;
