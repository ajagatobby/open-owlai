"use client";

import React, { useState } from "react";
import Container from "./container";
import { Layers, Wand2, Clapperboard } from "lucide-react";
import WorkflowCard from "../ui/workflow-card";
import { logos, stableDiffusion } from "@/lib/utils/workflow";
import { User } from "@prisma/client";

const TabButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ label, isActive, onClick, icon }) => (
  <button
    className={`px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default function AICreativeSuite({ user }: { user: User | null }) {
  const [activeTab, setActiveTab] = useState<"logos" | "stableDiffusion">(
    "logos"
  );

  const tabContent = {
    logos,
    stableDiffusion,
  };

  return (
    <Container className="lg:py-12 py-8">
      <div className="flex flex-col items-start space-y-3 mb-6 text-start">
        <div className="relative">
          <h2 className="lg:text-4xl text-3xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-slate-700">
              AI-Powered Creative Suite
            </span>
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl my-4">
          Unleash your creativity with our advanced AI tools. From logo design
          to animation, bring your ideas to life effortlessly.
        </p>
      </div>
      <div className="flex space-x-4 mb-10 relative">
        <TabButton
          label="Logos"
          isActive={activeTab === "logos"}
          onClick={() => setActiveTab("logos")}
          icon={<Layers size={20} />}
        />
        <TabButton
          label="Stable Diffusion"
          isActive={activeTab === "stableDiffusion"}
          onClick={() => setActiveTab("stableDiffusion")}
          icon={<Wand2 size={20} />}
        />
        {/* <TabButton
          label="Animations"
          isActive={activeTab === "animations"}
          onClick={() => setActiveTab("animations")}
          icon={<Clapperboard size={20} />}
        /> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 gap-4">
        {tabContent[activeTab].map((workflow, index) => (
          <WorkflowCard key={index} {...workflow} user={user} />
        ))}
      </div>
    </Container>
  );
}
