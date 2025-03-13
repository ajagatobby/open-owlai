import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { REPLICATE_MODELS } from "@/lib/replicateModels";
import { checkUserCredit, deductCredit } from "@/lib/subscription";
import prisma from "@/lib/db";
import { readUserData } from "@/lib/supabase/readUser";
import { getUser } from "@/lib/action";

type CartoonifyInput = (typeof REPLICATE_MODELS)["CARTOONIFY"]["input"];

interface RequestBody {
  input: CartoonifyInput;
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const REQUIRED_CREDITS = 1;

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

    if (!isValidInput(body.input)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const output = await replicate.run(REPLICATE_MODELS.CARTOONIFY.version, {
      input: body.input,
    });

    await deductCredit(user.id, REQUIRED_CREDITS);

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Error in cartoonify API route:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

function isValidInput(input: unknown): input is CartoonifyInput {
  if (typeof input !== "object" || input === null) {
    return false;
  }

  const { seed, image } = input as Partial<CartoonifyInput>;

  return (
    typeof seed === "number" && typeof image === "string" && image.trim() !== ""
  );
}

export async function GET() {
  return NextResponse.json({
    message: "Cartoonify API is running. Use POST to generate cartoons.",
  });
}
