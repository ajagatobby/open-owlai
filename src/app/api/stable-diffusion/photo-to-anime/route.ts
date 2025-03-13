import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { REPLICATE_MODELS } from "@/lib/replicateModels";
import { checkUserCredit, deductCredit } from "@/lib/subscription";
import prisma from "@/lib/db";
import { readUserData } from "@/lib/supabase/readUser";
import { getUser } from "@/lib/action";

type PhotoToAnimeInput = typeof REPLICATE_MODELS.PHOTO_TO_ANIME.input;

interface RequestBody {
  input: PhotoToAnimeInput;
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const REQUIRED_CREDITS = 1; // Set this to the number of credits required for photo-to-anime
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const readUser = await readUserData();
    const user = await getUser(readUser?.id as string);
    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userSub = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    const totalCredits = (user.freeCredit || 0) + (userSub?.credits || 0);

    if (totalCredits < REQUIRED_CREDITS) {
      return NextResponse.json(
        {
          error: `Insufficient credits. Required: ${REQUIRED_CREDITS}, Available: ${totalCredits}`,
        },
        { status: 400 }
      );
    }

    const body: RequestBody = await request.json();

    console.log("Photo to anime input:", body.input);

    if (!isValidInput(body.input)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const output = await replicate.run(
      REPLICATE_MODELS.PHOTO_TO_ANIME.version,
      { input: body.input }
    );

    await deductCredit(user.id, REQUIRED_CREDITS);

    console.log("Photo to anime output:", output);
    return NextResponse.json({ output });
  } catch (error) {
    console.error("Error in photo-to-anime API route:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

function isValidInput(input: unknown): input is PhotoToAnimeInput {
  if (typeof input !== "object" || input === null) {
    return false;
  }

  const {
    image,
    width,
    height,
    prompt,
    strength,
    scheduler,
    num_outputs,
    guidance_scale,
    negative_prompt,
    num_inference_steps,
  } = input as Partial<PhotoToAnimeInput>;

  return (
    typeof image === "string" &&
    typeof width === "number" &&
    typeof height === "number" &&
    typeof prompt === "string" &&
    typeof strength === "number" &&
    typeof scheduler === "string" &&
    typeof num_outputs === "number" &&
    typeof guidance_scale === "number" &&
    typeof negative_prompt === "string" &&
    typeof num_inference_steps === "number"
  );
}

export async function GET() {
  return NextResponse.json({
    message:
      "Photo to Anime API is running. Use POST to generate anime-style images.",
  });
}
