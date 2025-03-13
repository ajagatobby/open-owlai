import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  ChevronRight,
  Copy,
  Download,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface MyLogoItem {
  id: string;
  imageUrl: string;
  userId: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  public: boolean;
}

interface ImagePopupProps {
  item: MyLogoItem;
  isOpen: boolean;
  onClose: () => void;
  onTogglePublic: () => void;
  onToggleFavorite: () => void;
  isPublic: boolean;
  isFavorite: boolean;
  community?: boolean;
}

const ImagePopup: React.FC<ImagePopupProps> = ({
  item,
  isOpen,
  onClose,
  onTogglePublic,
  onToggleFavorite,
  isPublic,
  isFavorite,
  community,
}) => {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(`${type} copied to clipboard!`);
      },
      (err) => {
        toast.error(`Failed to copy ${type.toLowerCase()}`);
        console.error("Could not copy text: ", err);
      }
    );
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = item.imageUrl;
    link.download = `${item.prompt.replace(/\s+/g, "-").toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image download started");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full"
          >
            <div className="relative aspect-video">
              <Image
                src={item.imageUrl}
                alt={item.prompt}
                layout="fill"
                objectFit="contain"
                quality={100}
                className="transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                {item.prompt}
              </h3> */}
            </div>
            <div className="p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <div className="flex flex-wrap gap-6 justify-center items-center">
                <CreativeButton
                  onClick={() => copyToClipboard(item.prompt, "Caption")}
                  icon={<Copy size={24} />}
                  text="Prompt"
                  color="bg-blue-500"
                />
                <CreativeButton
                  onClick={downloadImage}
                  icon={<Download size={24} />}
                  text="Save"
                  color="bg-green-500"
                />
                <CreativeButton
                  onClick={onToggleFavorite}
                  icon={
                    <Bookmark
                      size={24}
                      fill={isFavorite ? "currentColor" : "none"}
                    />
                  }
                  text={isFavorite ? "Saved" : "Save"}
                  color="bg-yellow-500"
                />
                {!community && (
                  <CreativeButton
                    onClick={onTogglePublic}
                    icon={isPublic ? <EyeOff size={24} /> : <Eye size={24} />}
                    text={isPublic ? "Make Private" : "Make Public"}
                    color="bg-purple-500"
                  />
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
            >
              <X size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CreativeButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  color: string;
}> = ({ onClick, icon, text, color }) => (
  <motion.button
    onClick={onClick}
    className={`group relative flex flex-col items-center justify-center w-20 h-20 ${color} rounded-2xl text-white shadow-lg overflow-hidden`}
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.95, rotate: -5 }}
  >
    <motion.div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{
        background:
          "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)",
      }}
    />
    <motion.div>{icon}</motion.div>
    <span className="mt-2 text-xs font-semibold">{text}</span>
  </motion.button>
);

export default ImagePopup;
