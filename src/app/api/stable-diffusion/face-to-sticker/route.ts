import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { REPLICATE_MODELS } from "@/lib/replicateModels";
import { checkUserCredit, deductCredit } from "@/lib/subscription";
import prisma from "@/lib/db";
import { readUserData } from "@/lib/supabase/readUser";
import { getUser } from "@/lib/action";

type FaceToStickerInput = typeof REPLICATE_MODELS.FACE_TO_STICKER.input;

interface RequestBody {
  input: FaceToStickerInput;
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const REQUIRED_CREDITS = 1; // Set this to the number of credits required for face-to-sticker
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

    console.log("Face to sticker input:", body.input);

    if (!isValidInput(body.input)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const output = await replicate.run(
      REPLICATE_MODELS.FACE_TO_STICKER.version,
      { input: body.input }
    );

    await deductCredit(user.id, REQUIRED_CREDITS);

    console.log("Face to sticker output:", output);
    return NextResponse.json({ output });
  } catch (error) {
    console.error("Error in face-to-sticker API route:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

function isValidInput(input: unknown): input is FaceToStickerInput {
  if (typeof input !== "object" || input === null) {
    return false;
  }

  const {
    image,
    steps,
    width,
    height,
    prompt,
    upscale,
    upscale_steps,
    negative_prompt,
    prompt_strength,
    ip_adapter_noise,
    ip_adapter_weight,
    instant_id_strength,
  } = input as Partial<FaceToStickerInput>;

  return (
    typeof image === "string" &&
    typeof steps === "number" &&
    typeof width === "number" &&
    typeof height === "number" &&
    typeof prompt === "string" &&
    typeof upscale === "boolean" &&
    typeof upscale_steps === "number" &&
    typeof negative_prompt === "string" &&
    typeof prompt_strength === "number" &&
    typeof ip_adapter_noise === "number" &&
    typeof ip_adapter_weight === "number" &&
    typeof instant_id_strength === "number"
  );
}

export async function GET() {
  return NextResponse.json({
    message: "Face to Sticker API is running. Use POST to generate stickers.",
  });
}
