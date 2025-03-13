import { NextRequest, NextResponse } from "next/server";
import {
  EventName,
  SubscriptionCanceledEvent,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from "@paddle/paddle-node-sdk";
import paddle from "@/lib/paddle";
import prisma from "@/lib/db";
import { Subscription } from "@prisma/client";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("paddle-signature") as string;
  const rawRequestBody = await request.text();
  const secretKey = process.env.NEXT_PUBLIC_PADDLE_WEBHOOK_SECRET_KEY!;

  try {
    if (!signature || !rawRequestBody) {
      console.log("Missing signature or request body");
      return NextResponse.json(
        { error: "Missing signature or request body" },
        { status: 400 }
      );
    }

    const eventData = paddle.webhooks.unmarshal(
      rawRequestBody,
      secretKey,
      signature
    );

    if (!eventData) {
      console.log("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (eventData.eventType) {
      case EventName.SubscriptionCanceled:
        await cancelSubscription(eventData as SubscriptionCanceledEvent);
        break;
      case EventName.SubscriptionCreated:
        await handleSubscriptionCreated(eventData as SubscriptionCreatedEvent);
        break;
      case EventName.SubscriptionUpdated:
        await handleSubscriptionUpdated(eventData as SubscriptionUpdatedEvent);
        break;
      default:
        console.log(`Unhandled event type: ${eventData.eventType}`);
    }

    return NextResponse.json({ message: "Processed webhook event" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

async function cancelSubscription(eventData: SubscriptionCanceledEvent) {
  const customerId = eventData.data?.customerId;
  if (!customerId) {
    console.log("Missing customer ID");
    return;
  }

  try {
    const customer = await paddle.customers.get(customerId);
    console.log("Customer received:", customer);
    const user = await prisma.user.findUnique({
      where: { email: customer.email },
    });

    if (!user) {
      console.log(`User not found for customer ${customerId}`);
      return;
    }

    await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        status: eventData.data.status,
      },
    });
  } catch (error) {
    console.error(
      `Error canceling subscription for customer ${customerId}:`,
      error
    );
  }
}

async function handleSubscriptionCreated(eventData: SubscriptionCreatedEvent) {
  const customerId = eventData.data?.customerId;
  if (!customerId) {
    console.log("Missing customer ID");
    return;
  }

  try {
    const customer = await paddle.customers.get(customerId);
    const user = await prisma.user.findUnique({
      where: { email: customer.email },
    });

    if (!user) {
      console.log(`User not found for customer ${customerId}`);
      return;
    }

    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (existingSubscription) {
      await updateSubscription(eventData, existingSubscription);
      await paddle.subscriptions.cancel(existingSubscription.id, {
        effectiveFrom: "next_billing_period",
      });
    } else {
      await createSubscription(eventData, user.id);
    }
  } catch (error) {
    console.error(
      `Error handling subscription created for customer ${customerId}:`,
      error
    );
  }
}

async function handleSubscriptionUpdated(eventData: SubscriptionUpdatedEvent) {
  const customerId = eventData.data?.customerId;
  console.log("Subscription updated request received:", eventData);

  if (!customerId) {
    console.log("Missing customer ID in subscription update event");
    return;
  }
}

async function updateSubscription(
  eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent,
  existingSubscription: Subscription
) {
  const newPlan = getPlan(eventData);
  if (!newPlan) {
    console.log(
      `Unable to determine new plan for subscription ${existingSubscription.id}`
    );
    return;
  }

  await prisma.subscription.update({
    where: { id: existingSubscription.id },
    data: {
      status: eventData.data.status,
      plan: newPlan,
      credits: await updateCredits(eventData, existingSubscription.credits),
    },
  });
}

async function createSubscription(
  eventData: SubscriptionCreatedEvent,
  userId: string
) {
  const plan = getPlan(eventData);
  if (!plan) {
    console.log(`Unable to determine plan for new subscription`);
    return;
  }

  await prisma.subscription.create({
    data: {
      status: eventData.data.status,
      plan,
      id: eventData.data.id as string,
      credits: getCredits(eventData),
      userId,
    },
  });
}

function getPlan(
  eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent
): string | undefined {
  const productId = eventData.data.items[0].price?.productId;
  console.log(`Product ID: ${productId}`);
  if (productId === process.env.NEXT_PUBLIC_BASIC_PRODUCT_ID) {
    return "Basic";
  } else if (productId === process.env.NEXT_PUBLIC_STANDARD_PRODUCT_ID) {
    return "Standard";
  } else if (productId === process.env.NEXT_PUBLIC_PREMIUM_PRODUCT_ID) {
    return "Premium";
  }
  return undefined;
}

function getCredits(
  eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent
): number {
  const plan = getPlan(eventData);
  switch (plan) {
    case "Basic":
      return 60;
    case "Standard":
      return 180;
    case "Premium":
      return 300;
    default:
      return 0;
  }
}

function checkIfUpgrade(
  existingSubscription: Subscription,
  newPlan: string
): boolean {
  const oldPlan = existingSubscription.plan;

  const planOrder = ["Basic", "Standard", "Premium"];
  const oldPlanIndex = planOrder.indexOf(oldPlan);
  const newPlanIndex = planOrder.indexOf(newPlan);

  return newPlanIndex > oldPlanIndex;
}

async function updateCredits(
  eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent,
  prevCredits: number
): Promise<number> {
  const plan = getPlan(eventData);
  if (!plan) {
    return prevCredits;
  }

  switch (plan) {
    case "Basic":
      return 25 + prevCredits;
    case "Standard":
      return 80 + prevCredits;
    case "Premium":
      return 125 + prevCredits;
    default:
      return prevCredits;
  }
}
