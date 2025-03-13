// RecentCard.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import ImagePopup from "./image-popup";
import {
  favoriteLogo,
  makeLogoNotPublic,
  makeLogoPublic,
  unfavoriteLogo,
} from "@/lib/action";
import { toast } from "sonner";

interface RecentItem {
  id: string;
  imageUrl: string;
  userId: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  public: boolean;
  isFavorite: boolean;
}

interface RecentCardProps {
  item: RecentItem;
}

const RecentCard: React.FC<RecentCardProps> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopupOpen(true);
  };

  return (
    <>
      <motion.div
        className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full h-[45vh] relative">
          <Image
            src={item.imageUrl}
            alt={item.prompt}
            quality={75}
            className="transition-transform duration-300 group-hover:scale-110 object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <motion.div
          className="absolute top-4 right-4 bg-white rounded-full p-2 cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={handleChevronClick}
        >
          <ChevronRight size={20} className="text-gray-800" />
        </motion.div>
      </motion.div>
      <ImagePopup
        item={item}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onTogglePublic={async () => {
          const toastId = toast.loading("Processing...");

          if (item.public) {
            await makeLogoNotPublic(item.id, item.userId);
            toast.dismiss(toastId);
            setTimeout(() => {}, 2000);
            toast.success("Logo successfully made private!");
          } else {
            await makeLogoPublic(item.id, item.userId);
            toast.dismiss(toastId);
            toast.success("Logo successfully made public!");
          }
        }}
        onToggleFavorite={async () => {
          const toastId = toast.loading("Processing...");
          if (item.isFavorite) {
            await unfavoriteLogo(item.id, item.userId);
            toast.dismiss(toastId);
            setTimeout(() => {}, 2000);

            toast.success("Logo removed from favorite");
          } else {
            toast.loading("Processing...");
            await favoriteLogo(item.id, item.userId);
            toast.dismiss(toastId);
            setTimeout(() => {}, 2000);

            toast.success("Logo added to favorite");
          }
        }}
        isPublic={item.public}
        isFavorite={item.isFavorite}
      />
    </>
  );
};

export default RecentCard;
