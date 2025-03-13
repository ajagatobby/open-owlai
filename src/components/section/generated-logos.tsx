"use client";
import React from "react";
import Container from "./container";
import GeneratedLogoCard from "../ui/generated-logo-card";

export default function GeneratedLogos({
  myLogos,
}: {
  myLogos: {
    id: string;
    urls: string[];
    userId: string;
    prompt: string;
    createdAt: Date;
    updatedAt: Date;
    public: boolean;
  };
}) {
  const handleRemove = (id: string) => {
    return true;
  };

  return (
    <Container>
      <div className="lg:py-16 py-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="lg:text-4xl text-2xl font-bold text-gray-800 relative">
            Recently Generated Logos
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-500 rounded-full"></span>
          </h2>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {myLogos.urls.map((url, index) => (
            <GeneratedLogoCard
              key={index}
              item={{
                createdAt: myLogos.createdAt,
                updatedAt: myLogos.updatedAt,
                id: myLogos.id,
                prompt: myLogos.prompt,
                imageUrl: url,
                public: myLogos.public,
                userId: myLogos.userId,
              }}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
