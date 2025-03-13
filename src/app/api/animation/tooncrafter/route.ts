import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { REPLICATE_MODELS } from "@/lib/replicateModels";

type TooncrafterInput = typeof REPLICATE_MODELS.TOONCRAFTER.input;

interface RequestBody {
  input: TooncrafterInput;
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

    const output = await replicate.run(REPLICATE_MODELS.TOONCRAFTER.version, {
      input: body.input,
    });

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Error in tooncrafter API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function isValidInput(input: any): input is TooncrafterInput {
  return (
    typeof input.loop === "boolean" &&
    typeof input.prompt === "string" &&
    typeof input.image_1 === "string" &&
    typeof input.image_2 === "string" &&
    typeof input.image_3 === "string" &&
    typeof input.max_width === "number" &&
    typeof input.max_height === "number" &&
    typeof input.interpolate === "boolean" &&
    typeof input.negative_prompt === "string" &&
    typeof input.color_correction === "boolean"
  );
}

export async function GET() {
  return NextResponse.json({
    message: "Tooncrafter API is running. Use POST to generate animations.",
  });
}
