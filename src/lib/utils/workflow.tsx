"use client";

import { User } from "@prisma/client";
import { Type, Pencil, Layers, Sticker, Palette, Brush } from "lucide-react";

export interface WorkflowItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconColor: string;
  href: string;
  user?: User | null;
}

export const logos: WorkflowItem[] = [
  {
    title: "Create logo from text",
    description: "Generate a unique logo based on your text description.",
    icon: <Type size={28} />,
    gradient: "from-blue-400 to-indigo-500",
    iconColor: "text-yellow-300",
    href: "/create-logo",
  },
  {
    title: "Sketch to logo",
    description: "Transform your hand-drawn sketch into a polished logo.",
    icon: <Pencil size={28} />,
    gradient: "from-purple-400 to-pink-500",
    iconColor: "text-green-300",
    href: "/sketch-to-logo",
  },
  {
    title: "Logo to Logo",
    description: "Create multiple variations of your existing logo design.",
    icon: <Layers size={28} />,
    gradient: "from-green-400 to-cyan-500",
    iconColor: "text-pink-300",
    href: "/logo-to-logo",
  },
];

export const stableDiffusion: WorkflowItem[] = [
  {
    title: "Face-to-sticker",
    description: "Convert facial images into fun, customized stickers.",
    icon: <Sticker size={28} />,
    gradient: "from-red-400 to-orange-500",
    iconColor: "text-blue-300",
    href: "/face-to-sticker",
  },
  {
    title: "Cartonify",
    description: "Transform your photos into charming cartoon versions.",
    icon: <Palette size={28} />,
    gradient: "from-yellow-400 to-amber-500",
    iconColor: "text-purple-300",
    href: "/cartonify",
  },
  {
    title: "Photo to anime",
    description: "Turn your images into captivating anime-style artwork.",
    icon: <Brush size={28} />,
    gradient: "from-pink-400 to-rose-500",
    iconColor: "text-cyan-300",
    href: "/photo-to-anime",
  },
];

// export const animations: WorkflowItem[] = [
//   {
//     title: "Animate Diff",
//     description: "Bring static images to life with AI-powered animations.",
//     icon: <Wand2 size={28} />,
//     gradient: "from-teal-400 to-emerald-500",
//     iconColor: "text-red-300",
//     href: "/animate-diff",
//   },
//   {
//     title: "Toon Crafter",
//     description: "Create videos from illustrated input images with ease.",
//     icon: <Music size={28} />,
//     gradient: "from-cyan-400 to-sky-500",
//     iconColor: "text-yellow-300",
//     href: "/toon-crafter",
//   },
//   {
//     title: "Image to motion",
//     description: "Convert still images into dynamic video sequences.",
//     icon: <Clapperboard size={28} />,
//     gradient: "from-indigo-400 to-violet-500",
//     iconColor: "text-green-300",
//     href: "/image-to-motion",
//   },
// ];
