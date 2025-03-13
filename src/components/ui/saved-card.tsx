import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Download } from "lucide-react";
import Image from "next/image";
import ImagePopup from "./image-popup";
import { toast } from "sonner";
import {
  favoriteLogo,
  makeLogoNotPublic,
  makeLogoPublic,
  unfavoriteLogo,
} from "@/lib/action";

interface SavedLogoItem {
  id: string;
  imageUrl: string;
  userId: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  public: boolean;
  isFavorite: boolean;
}

interface SavedLogoCardProps {
  item: SavedLogoItem;
  onRemove?: (id: number) => void;
}

const SavedLogoCard: React.FC<SavedLogoCardProps> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Downloading logo:", item.prompt);
  };

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
            layout="fill"
            objectFit="cover"
            quality={75}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <motion.div
          className="absolute top-4 right-4 flex space-x-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {/* <motion.button
            className="bg-white rounded-full p-2 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRemove}
          >
            <Trash2 size={20} className="text-red-500" />
          </motion.button> */}
          <motion.button
            className="bg-white rounded-full p-2 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDownload}
          >
            <Download size={20} className="text-blue-500" />
          </motion.button>
          <motion.button
            className="bg-white rounded-full p-2 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleChevronClick}
          >
            <ChevronRight size={20} className="text-gray-800" />
          </motion.button>
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
            setTimeout(() => {}, 1000);

            toast.success("Logo successfully made private!");
          } else {
            await makeLogoPublic(item.id, item.userId);
            toast.dismiss(toastId);
            setTimeout(() => {}, 1000);

            toast.success("Logo successfully made public!");
          }
        }}
        onToggleFavorite={async () => {
          const toastId = toast.loading("Processing...");

          if (item.isFavorite) {
            await unfavoriteLogo(item.id, item.userId);
            toast.dismiss(toastId);
            setTimeout(() => {}, 1000);

            toast.success("Logo removed from favorite");
          } else {
            await favoriteLogo(item.id, item.userId);
            toast.dismiss(toastId);
            setTimeout(() => {}, 1000);

            toast.success("Logo added to favorite");
          }
        }}
        isPublic={item.public}
        isFavorite={false}
      />
    </>
  );
};

export default SavedLogoCard;
