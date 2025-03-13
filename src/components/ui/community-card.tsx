import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Copy, Download } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import useFavoriteLogo from "@/lib/hooks/useFavoriteLogo";
import useMakePostPublic from "@/lib/hooks/useMakePostPublic";
import { v4 as uuidv4 } from "uuid";
import ImagePopup from "./image-popup";

interface MyLogoItem {
  id: string;
  imageUrl: string;
  userId: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  public: boolean;
}

interface CommunityCardProps {
  item: MyLogoItem;
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
  page?: "explore" | "home" | "favorite" | "mylogo";
}

const CommunityCard: React.FC<CommunityCardProps> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { checkFavorite, toggleFavorite } = useFavoriteLogo();
  const { mutate: makePublic, checkPublicity } = useMakePostPublic();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPublic, setIsPublic] = useState(item.public);
  const [isToastReady, setIsToastReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsToastReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!item.userId) return;
      try {
        const isFavoriteResult = await checkFavorite(item.id, item.userId);
        const isPublicResult = await checkPublicity(item.id, item.userId);
        setIsPublic(isPublicResult);
        setIsFavorite(isFavoriteResult);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };
    fetchStatus();
  }, [checkFavorite, checkPublicity, item.id, item.userId]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    if (!isToastReady) return;

    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(item.imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `logo_${item.userId || "user"}_${uuidv4()}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
      showToast("Image downloaded successfully");
    } catch (error) {
      console.error("Error downloading image:", error);
      showToast("Failed to download image", "error");
    }
  };

  const handleTogglePublic = async () => {
    if (!item.userId) return;
    try {
      const result: any = await makePublic({
        logoId: item.id,
        userId: item.userId,
      });
      setIsPublic(result);
      showToast(result ? "Logo made public" : "Logo made private");
    } catch (error) {
      console.error("Error toggling public status:", error);
      showToast("Failed to update logo visibility", "error");
    }
  };

  const handleFavorite = async () => {
    if (!item.userId) return;
    try {
      const result: any = await toggleFavorite({
        logoId: item.id,
        userId: item.userId,
      });
      setIsFavorite(result);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      showToast("Failed to update favorites", "error");
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopupOpen(true);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        showToast(`${type} copied to clipboard!`);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        showToast(`Failed to copy ${type.toLowerCase()}`, "error");
      }
    );
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-indigo-800/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <motion.div
          className="absolute top-4 right-4 flex space-x-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <ActionButton
            icon={<Download size={18} />}
            onClick={handleDownload}
            color="text-blue-500"
          />
          <ActionButton
            icon={<Copy size={18} />}
            onClick={() => copyToClipboard(item.prompt, "Caption")}
            color="text-green-500"
          />

          <ActionButton
            icon={<ChevronRight size={18} />}
            onClick={handleChevronClick}
            color="text-gray-800"
          />
        </motion.div>
      </motion.div>
      <ImagePopup
        item={item}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onTogglePublic={handleTogglePublic}
        onToggleFavorite={handleFavorite}
        isPublic={isPublic}
        isFavorite={isFavorite}
        community={true}
      />
    </>
  );
};

const ActionButton: React.FC<{
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  color: string;
}> = ({ icon, onClick, color }) => (
  <motion.button
    className={`bg-white rounded-full p-2 cursor-pointer ${color}`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
  >
    {icon}
  </motion.button>
);

export default CommunityCard;
