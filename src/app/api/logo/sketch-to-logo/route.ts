import { createLogo } from "@/lib/action";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { UTApi } from "uploadthing/server";
import { checkUserCredit, deductCredit } from "@/lib/subscription";
import prisma from "@/lib/db";
import { generateImages, studyImageAndGeneratePrompt } from "@/lib/helpers";

const utapi = new UTApi();
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const {
    businessName,
    slogan,
    industry,
    colorPalette,
    logoType,
    sketchs,
    userId,
  } = await request.json();

  try {
    const userSub = await prisma.subscription.findUnique({
      where: { userId },
    });

    const userCredit = await checkUserCredit(
      userId,
      userSub?.credits !== undefined && userSub.credits > 0
        ? "subscription"
        : "free"
    );

    if (userCredit < 1)
      return NextResponse.json(
        { error: "Insufficient credit to generate logos" },
        { status: 400 }
      );

    const refinedPrompt = await studyImageAndGeneratePrompt(
      businessName,
      industry,
      colorPalette,
      logoType,
      slogan,
      sketchs as string[]
    );

    // Determine how many logos to generate based on available credit
    const logosToGenerate = userCredit >= 3 ? 3 : userCredit;

    const imagePromises = Array(logosToGenerate)
      .fill(null)
      .map(() => generateImages(refinedPrompt as string));

    // Generate images
    const imageUrlsArray = await Promise.all(imagePromises);

    // Flatten the array of arrays
    const imageUrls = imageUrlsArray.flat();

    // Upload generated images and get their URLs
    const uploadedImageUrls = await Promise.all(
      imageUrls.map(async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `${uuidv4()}.png`, { type: "image/png" });

        const data = await utapi.uploadFiles([file], {
          metadata: { userId },
        });

        return data[0].data?.url;
      })
    );

    // Filter out any undefined URLs
    const validImageUrls = uploadedImageUrls.filter(
      (url): url is string => url !== undefined
    );

    // Create a logo using the valid image URLs
    const createdLogo = await createLogo(
      validImageUrls,
      refinedPrompt as string,
      userId
    );

    const { user, subscription } = await deductCredit(userId, logosToGenerate);

    return NextResponse.json(
      {
        image_urls: validImageUrls,
        createdLogo,
        remainingCredits: (user.freeCredit || 0) + (subscription?.credits || 0),
        generatedLogos: logosToGenerate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating logo:", error);
    return NextResponse.json(
      { error: "Unable to generate logo" },
      { status: 500 }
    );
  }
}
