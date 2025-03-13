import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { REPLICATE_MODELS } from "@/lib/replicateModels";

type AnimateDiffInput = typeof REPLICATE_MODELS.ANIMATE_DIFF.input;

interface RequestBody {
  input: AnimateDiffInput;
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();

    if (!isValidInput(body.input)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const output = await replicate.run(REPLICATE_MODELS.ANIMATE_DIFF.version, {
      input: body.input,
    });

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Error in animate-diff API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function isValidInput(input: any): input is AnimateDiffInput {
  return (
    typeof input.path === "string" &&
    typeof input.seed === "number" &&
    typeof input.steps === "number" &&
    typeof input.prompt === "string" &&
    typeof input.n_prompt === "string" &&
    typeof input.motion_module === "string" &&
    typeof input.guidance_scale === "number"
  );
}

export async function GET() {
  return NextResponse.json({
    message: "Animate Diff API is running. Use POST to generate animations.",
  });
}
