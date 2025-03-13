"use client";
import React from "react";
import Container from "./container";
import { motion } from "framer-motion";
import CommunityCard from "../ui/community-card";
import { useRouter } from "next/navigation";
import EmptyState from "../ui/empty-state";

interface CommunityLogo {
  id: string;
  urls: string[];
  userId: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  public: boolean;
}

interface CommunityCardItem {
  id: string;
  imageUrl: string;
  userId: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  public: boolean;
}

interface CommunityProps {
  communityLogos: CommunityLogo[];
}

export default function Community({ communityLogos }: CommunityProps) {
  const handleRemove = (id: string) => {
    return true;
  };
  const router = useRouter();

  return (
    <Container>
      <div className="lg:py-16 py-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="lg:text-4xl text-2xl font-bold text-gray-800 relative">
            Community
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full"></span>
          </h2>
        </div>
        {communityLogos.length === 0 && (
          <EmptyState
            title="No logos found in the community"
            description="Add your logo to the community by sharing it with the community."
            actionLabel="Create Logo"
            onAction={() => router.push("/")}
          />
        )}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {communityLogos.map(
            (item) =>
              item.urls.length > 0 &&
              item.urls.map((url, index) => (
                <CommunityCard
                  key={`${item.id}-${index}`}
                  item={{
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    id: item.id,
                    prompt: item.prompt,
                    imageUrl: url,
                    public: item.public,
                    userId: item.userId,
                  }}
                  onRemove={handleRemove}
                />
              ))
          )}
        </div>
      </div>
    </Container>
  );
}
