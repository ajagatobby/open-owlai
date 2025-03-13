import { useState } from "react";
import { toast } from "sonner";
import {
  isFavorite as checkFavoriteStatus,
  favoriteLogo,
  isFavorite,
  unfavoriteLogo,
} from "@/lib/action";
import { useMutation } from "@tanstack/react-query";

const useFavoriteLogo = () => {
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: async ({
      logoId,
      userId,
    }: {
      userId: string;
      logoId: string;
    }) => {
      setIsFavoriting(true);
      setError(null);

      const isAlreadyFavorite = await isFavorite(logoId, userId);

      if (isAlreadyFavorite) {
        await unfavoriteLogo(logoId, userId);
        return { favorite: null };
      } else {
        const favorite = await favoriteLogo(logoId, userId);
        return { favorite };
      }
    },
    onSuccess: (data) => {
      if (data.favorite) {
        toast.success("Logo favorited successfully");
      } else {
        toast.success("Logo unfavorited successfully");
      }
      setIsFavoriting(false);
      toast.dismiss();
      return data.favorite;
    },
    onError: (error) => {
      setError("Error updating favorite status");
      toast.error("Error updating favorite status");
      toast.dismiss();
      setIsFavoriting(false);
    },
  });

  const checkFavorite = async (logoId: string, userId: string) => {
    try {
      const isFavoriteResult = await checkFavoriteStatus(logoId, userId);
      return isFavoriteResult;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  };

  return { isFavoriting, error, toggleFavorite: mutate, checkFavorite };
};

export default useFavoriteLogo;
