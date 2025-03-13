"use client";
import React, { createContext, useContext, useState } from "react";

export interface GeneratedImage {
  id: string;
  urls: string[];
  prompt: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface GeneratedImagesContextProps {
  generatedImages: GeneratedImage[];
  addGeneratedImage: (image: GeneratedImage) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const GeneratedImagesContext = createContext<GeneratedImagesContextProps>({
  generatedImages: [],
  addGeneratedImage: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export const useGeneratedImages = () => useContext(GeneratedImagesContext);

interface GeneratedImagesProviderProps {
  children: React.ReactNode;
}

export const GeneratedImagesProvider: React.FC<
  GeneratedImagesProviderProps
> = ({ children }) => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addGeneratedImage = (image: GeneratedImage) => {
    setGeneratedImages((prevImages) => [...prevImages, image]);
  };

  return (
    <GeneratedImagesContext.Provider
      value={{ generatedImages, addGeneratedImage, isLoading, setIsLoading }}
    >
      {children}
    </GeneratedImagesContext.Provider>
  );
};
