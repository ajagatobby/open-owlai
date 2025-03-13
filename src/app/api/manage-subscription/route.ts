import paddle from "@/lib/paddle";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    const subscription = await paddle.subscriptions.get(subscriptionId);
    return NextResponse.json({
      subscription: {
        id: subscription.id,
        update_url: subscription.managementUrls?.updatePaymentMethod,
        cancel_url: subscription.managementUrls?.cancel,
      },
    });
  } catch (error) {}
}
