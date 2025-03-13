"use client";
import React from "react";
import Container from "./container";
import MyLogoCard from "../ui/my-logo-card";
import EmptyState from "../ui/empty-state";
import { useRouter } from "next/navigation";

export default function MyLogos({
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
  }[];
}) {
  const handleRemove = (id: string) => {
    return true;
  };
  const router = useRouter();

  return (
    <Container>
      <div className="lg:py-16 py-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="lg:text-4xl text-2xl font-bold text-gray-800 relative">
            My Logos
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-500 rounded-full"></span>
          </h2>
        </div>
        {myLogos.length === 0 && (
          <EmptyState
            title="You haven't created any logos yet"
            description="Get started by creating your first logo."
            actionLabel="Create Logo"
            onAction={() => router.push("/")}
          />
        )}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {myLogos.map(
            (item) =>
              item.urls.length > 0 &&
              item.urls.map((url) => (
                <MyLogoCard
                  key={item.id}
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
