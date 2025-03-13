import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomUsername = (email: string) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomUsername = "";

  // Generate a random 6-character username
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomUsername += characters.charAt(randomIndex);
  }

  // Append a portion of the email to the username
  const emailParts = email.split("@");
  const emailUsername = emailParts[0];
  const maxEmailLength = 4;
  const truncatedEmail = emailUsername.slice(0, maxEmailLength);
  const finalUsername = `${truncatedEmail}_${randomUsername}`;

  return finalUsername;
};

export const handleDownload = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `logo_${uuidv4()}.png`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success("Image downloaded successfully");
  } catch (error) {
    console.error("Error downloading image:", error);
    toast.error("Failed to download image");
  }
};
