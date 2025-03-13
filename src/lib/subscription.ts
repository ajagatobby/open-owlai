"use server";
import { getUser } from "./action";
import prisma from "./db";
import paddle from "./paddle";
import { readUserData } from "./supabase/readUser";

// Function to get user subscription from the database
export const getUserSubscription = async (userId: string) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    return subscription;
  } catch (error) {
    console.error("Error retrieving user subscription:", error);
    throw new Error("Failed to retrieve user subscription");
  }
};

export const upgradeSubscription = async ({ priceId }: { priceId: string }) => {
  try {
    const userData = await readUserData();

    if (!userData?.id) {
      throw new Error("User data not found");
    }

    const subscriptionObject = await prisma.subscription.findUnique({
      where: { userId: userData.id },
    });

    if (!subscriptionObject) {
      throw new Error("Subscription not found");
    }

    // Get current subscription details from Paddle
    const userSubscription = await paddle.subscriptions.get(
      subscriptionObject.id
    );

    // Prepare new subscription items list
    const newSubscriptionItems = userSubscription.items.map((item) => ({
      priceId: item.price?.id!,
      quantity: item.quantity,
    }));

    // Find if the new price item already exists in the subscription
    const existingItemIndex = newSubscriptionItems.findIndex(
      (item) => item.priceId === priceId
    );

    // If it exists, ensure quantity does not exceed the maximum allowed (in this case, 1)
    if (existingItemIndex !== -1) {
      if (newSubscriptionItems[existingItemIndex].quantity !== 1) {
        throw new Error(`Quantity for ${priceId} must be 1`);
      }
    } else {
      newSubscriptionItems.push({
        priceId,
        quantity: 1,
      });
    }

    // Update subscription with the new items
    const updatedSubscription = await paddle.subscriptions.update(
      subscriptionObject.id,
      {
        items: newSubscriptionItems,
        prorationBillingMode: "full_immediately",
      }
    );

    // Ensure updatedSubscription is serialized
    const serializedSubscription = JSON.parse(
      JSON.stringify(updatedSubscription)
    );

    // Retrieve the productId of the price that was passed as an argument
    const newPrice = userSubscription.items.find(
      (item) => item.price?.id === priceId
    );
    if (!newPrice?.price?.productId) {
      throw new Error("Product ID not found for the given price ID");
    }
    const productId = newPrice.price.productId;

    const newCredits = getCredits(productId);
    const newPlan = getPlan(productId);

    console.log("New plan: ", newPlan, " New credits: ", newCredits);

    await prisma.subscription.update({
      where: { userId: userData.id },
      data: {
        status: updatedSubscription.status,
        credits: newCredits,
        plan: newPlan,
      },
    });

    return serializedSubscription;
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    throw new Error("Failed to upgrade subscription");
  }
};

function getPlan(productId: string): string {
  console.log(`Product ID: ${productId}`);
  if (productId === process.env.NEXT_PUBLIC_BASIC_PRODUCT_ID) {
    return "Basic";
  } else if (productId === process.env.NEXT_PUBLIC_STANDARD_PRODUCT_ID) {
    return "Standard";
  } else if (productId === process.env.NEXT_PUBLIC_PREMIUM_PRODUCT_ID) {
    return "Premium";
  }
  return "Unknown";
}

function getCredits(productId: string): number {
  const plan = getPlan(productId);
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

export const deductCredit = async (userId: string, amount: number = 1) => {
  try {
    const user = await getUser(userId);
    if (!user) throw new Error("User not found");

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    let totalAvailableCredits = user.freeCredit + (subscription?.credits || 0);

    if (totalAvailableCredits < amount) {
      throw new Error(
        `Insufficient credits. Required: ${amount}, Available: ${totalAvailableCredits}`
      );
    }

    let remainingAmount = amount;
    let updatedUser = user;
    let updatedSubscription = subscription;

    // Handle free credit deduction
    if (user.freeCredit > 0) {
      const freeDeduction = Math.min(user.freeCredit, remainingAmount);
      updatedUser = await deductFreeCredit(userId, freeDeduction);
      remainingAmount -= freeDeduction;
    }

    // Handle subscription credit deduction if there's remaining amount
    if (remainingAmount > 0 && subscription) {
      updatedSubscription = await deductSubscriptionCredit(
        userId,
        remainingAmount
      );
    }

    return {
      user: updatedUser,
      subscription: updatedSubscription,
    };
  } catch (error) {
    console.error("Error deducting credits:", error);
    throw error;
  }
};

const deductFreeCredit = async (userId: string, amount: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  const decrement = Math.min(amount, user?.freeCredit ?? 0);
  return prisma.user.update({
    where: { id: userId },
    data: { freeCredit: { decrement } },
  });
};

const deductSubscriptionCredit = async (userId: string, amount: number) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });
  const decrement = Math.min(amount, subscription?.credits ?? 0);
  return prisma.subscription.update({
    where: { userId },
    data: { credits: { decrement } },
  });
};

export const checkUserCredit = async (
  userId: string,
  type: "free" | "subscription"
): Promise<number> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { freeCredit: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (type === "free") {
    return user.freeCredit;
  }

  const userSubscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { credits: true },
  });

  if (!userSubscription) {
    throw new Error("Subscription not found");
  }

  return userSubscription.credits;
};
