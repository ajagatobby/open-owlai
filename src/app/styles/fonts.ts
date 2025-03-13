import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const sansBold = localFont({
  src: "../styles/Product Sans Bold.ttf",
  variable: "--font-sans-bold",
  weight: "600 700 800 900",
  display: "swap",
  style: "normal",
});

export const sans = localFont({
  src: "../styles/product-sans-regular.ttf",
  variable: "--font-sans",
  weight: "400 500",
  display: "swap",
  style: "normal",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
