"use client";
import React, { useEffect, useState } from "react";
import Container from "./container";
import SavedLogoCard from "../ui/saved-card";
import EmptyState from "../ui/empty-state";
import { useRouter } from "next/navigation";
import { isFavorite } from "@/lib/action";

interface SavedLogoItem {
  id: string;
  urls: string[];
  userId: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  public: boolean;
}

export default function SavedLogos({
  userLogos = [],
}: {
  userLogos: SavedLogoItem[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logosWithFavorites, setLogosWithFavorites] = useState<
    Array<SavedLogoItem & { isFavorite: boolean }>
  >([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (!userLogos || userLogos.length === 0) {
          setLogosWithFavorites([]);
          setLoading(false);
          return;
        }

        const processedLogos = await Promise.all(
          userLogos.map(async (logo) => {
            try {
              const favoriteStatus = await isFavorite(logo.id, logo.userId);
              return {
                ...logo,
                isFavorite: favoriteStatus,
              };
            } catch (error) {
              console.error(
                `Error getting favorite status for logo ${logo.id}:`,
                error
              );
              return {
                ...logo,
                isFavorite: false,
              };
            }
          })
        );

        setLogosWithFavorites(processedLogos);
      } catch (error) {
        console.error("Error loading favorites:", error);
        setLogosWithFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [userLogos]);

  return (
    <Container>
      <div className="lg:py-16 py-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="lg:text-4xl text-2xl font-bold text-gray-800 relative">
            Saved Logos
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-500 rounded-full"></span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : !userLogos || userLogos.length === 0 ? (
          <EmptyState
            title="You haven't saved any logos yet"
            description="Get started by creating your first project."
            actionLabel="Create Logo"
            onAction={() => router.push("/")}
          />
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {logosWithFavorites.map(
              (item) =>
                item.urls &&
                item.urls.length > 0 &&
                item.urls.map((url: string, index: number) => (
                  <SavedLogoCard
                    key={`${item.id}-${index}`}
                    item={{
                      id: item.id,
                      imageUrl: url,
                      userId: item.userId,
                      prompt: item.prompt,
                      createdAt: item.createdAt,
                      updatedAt: item.updatedAt,
                      public: item.public,
                      isFavorite: item.isFavorite,
                    }}
                  />
                ))
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
