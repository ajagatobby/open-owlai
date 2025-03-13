import axios from "axios";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useGeneratedImages } from "../context/generatedImagesCtx";
import { useRouter } from "next/navigation";

export interface CreatedLogo {
  id: string;
  urls: string[];
  prompt: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogoGeneratorResponse {
  image_urls: string[];
  createdLogo: CreatedLogo;
  remainingCredits: number;
  generatedLogos: number;
}

interface GenerateLogoParams {
  businessName: string;
  slogan: string;
  industry: string;
  colorPalette: string;
  logoType: string;
  sketchs?: string[];
  type?: "logo-to-logo" | "sketch-to-logo" | "create-logo";
}

const useLogoGenerator = (userId: string) => {
  const { addGeneratedImage, setIsLoading: setContextIsLoading } =
    useGeneratedImages();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const simulateProgress = useCallback(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prevProgress + Math.random() * 10;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const generateLogo = useCallback(
    async ({
      businessName,
      slogan,
      industry,
      colorPalette,
      logoType,
      sketchs,
      type,
    }: GenerateLogoParams): Promise<string | undefined> => {
      setIsLoading(true);
      setContextIsLoading(true);
      setError(null);

      const stopSimulation = simulateProgress();

      try {
        const endpoint =
          sketchs && sketchs.length > 0
            ? "/api/logo/sketch-to-logo"
            : type === "logo-to-logo"
            ? "/api/logo/logo-to-logo"
            : "/api/logo/create-logo";

        const payload = {
          businessName,
          slogan,
          industry,
          colorPalette,
          logoType,
          userId,
          ...(sketchs && sketchs.length > 0 ? { sketchs } : {}),
        };

        const response = await axios.post<LogoGeneratorResponse>(
          endpoint,
          payload
        );

        const { image_urls, createdLogo, remainingCredits, generatedLogos } =
          response.data;

        setImageUrls(image_urls);
        addGeneratedImage(createdLogo);

        toast.success(
          `Generated ${generatedLogos} logos. Remaining credits: ${remainingCredits}`
        );

        router.push(`/mylogos/${createdLogo.id}`);

        return createdLogo.id;
      } catch (error) {
        let errorMessage = "An unexpected error occurred";
        if (axios.isAxiosError(error)) {
          errorMessage =
            error.response?.data?.message ||
            "An error occurred while generating the logo";
        }
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        stopSimulation();
        setProgress(100);
        setIsLoading(false);
        setContextIsLoading(false);
      }
    },
    [userId, addGeneratedImage, setContextIsLoading, router, simulateProgress]
  );

  return { imageUrls, generateLogo, isLoading, error, progress };
};

export default useLogoGenerator;
