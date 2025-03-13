import { getUserById } from "@/lib/action";
import { getUserSubscription } from "@/lib/subscription";
import { readUserData } from "@/lib/supabase/readUser";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const userData = await readUserData();

    if (!userData) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const user = await getUserById(userData.id);

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const subscription = await getUserSubscription(user.id as string);

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription, { status: 200 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
