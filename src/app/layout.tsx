import type { Metadata } from "next";
import "@/app/styles/globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

import { inter, sans, sansBold } from "./styles/fonts";
import { UserProvider } from "@/lib/context/useUserContext";
import QueryProvider from "@/lib/context/query-provider";
import { GeneratedImagesProvider } from "@/lib/context/generatedImagesCtx";
import TopProgressBar from "@/components/ui/top-bar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const metadata: Metadata = {
    title: "Owl AI - Turn your ideas into logos",
    description:
      "Unleash your brand's potential with Owl AI's cutting-edge logo generator. Harness the power of GPT-4 to create unique, professional logos in minutes. Save time, money, and elevate your brand identity today!",
    keywords: [
      "AI logo generator",
      "GPT-4 design",
      "brand identity",
      "logo creation",
      "Owl AI",
    ],
    authors: [{ name: "Owl AI Team." }],
    creator: "Owl AI",
    publisher: "Owl AI LLC.",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://www.owlai.art",
      siteName: "Owl AI",
      title: "Owl AI - AI-Powered Logo Generation Reimagined",
      description:
        "Transform your brand with Owl AI's GPT-4 powered logo generator. Create stunning, unique logos effortlessly. Join the design revolution!",
      images: [
        {
          url: "https://qpugwjdozpbjgfxfbmth.supabase.co/storage/v1/object/public/images/91b1fe94-7ae7-40f5-aea0-e1ae31785258/13e5840d-3248-4123-999c-bb60aa941138.png",
          width: 1200,
          height: 630,
          alt: "Owl AI Logo Generator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@OwlAI_Art",
      creator: "@OwlAI_Art",
      title: "Owl AI - Next-Gen Logo Creation with GPT-4",
      description:
        "Elevate your brand instantly with Owl AI's revolutionary logo generator. Powered by GPT-4, designed for visionaries.",
      images: [
        "https://qpugwjdozpbjgfxfbmth.supabase.co/storage/v1/object/public/images/91b1fe94-7ae7-40f5-aea0-e1ae31785258/13e5840d-3248-4123-999c-bb60aa941138.png",
      ],
    },
    viewport: "width=device-width, initial-scale=1",
    robots: "index, follow",
  };
  return (
    <html
      lang="en"
      className={cn(
        inter.variable,
        sans.variable,
        sansBold.variable,
        "font-sans font-default antialiased tracking-wide"
      )}
    >
      <GeneratedImagesProvider>
        <Analytics />
        <SpeedInsights />
        <TopProgressBar />
        <QueryProvider>
          <UserProvider>
            <body className={cn("bg-backgroundClr")}>
              <Toaster theme="light" expand richColors position="top-center" />
              {children}
            </body>
          </UserProvider>
        </QueryProvider>
      </GeneratedImagesProvider>
    </html>
  );
}
