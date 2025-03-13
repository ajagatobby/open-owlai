"use client";
import React, { useEffect, useState } from "react";
import Container from "./container";
import { motion } from "framer-motion";
import RecentCard from "../ui/recent-card";
import Link from "next/link";
import { isFavorite } from "@/lib/action";

interface RecentLogo {
  id: string;
  urls: string[];
  userId: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  public: boolean;
}

interface RecentProps {
  recentLogos: RecentLogo[];
}

export default function Recent({ recentLogos }: RecentProps) {
  const [logosWithFavorites, setLogosWithFavorites] = useState<any[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const processedLogos = await Promise.all(
        recentLogos.map(async (logo) => {
          const favoriteStatus = await isFavorite(logo.id, logo.userId);
          return {
            ...logo,
            isFavorite: favoriteStatus,
          };
        })
      );
      setLogosWithFavorites(processedLogos);
    };

    loadFavorites();
  }, [recentLogos]);

  return (
    <Container>
      <div className="lg:py-16 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="lg:text-3xl text-2xl relative bg-clip-text text-transparent bg-gradient-to-r from-gray-600  to-slate-700 font-medium">
            Recently Generated
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-500 rounded-full"></span>
          </h2>
          <Link href="mylogos">
            <motion.button
              className="px-6 py-2 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors duration-300 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">View All</span>
              <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-1"></span>
            </motion.button>
          </Link>
        </div>
        <div className="grid lg:gap-6 gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {logosWithFavorites.map(
            (item) =>
              item.urls.length > 0 &&
              item.urls.map((url: string, index: number) => (
                <RecentCard
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
      </div>
    </Container>
  );
}
