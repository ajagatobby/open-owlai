import ProfileLayout from "@/components/section/profile-layout";
import { getOrCreateUser, getUserById } from "@/lib/action";
import { getUserSubscription } from "@/lib/subscription";
import { Subscription } from "@prisma/client";
import React from "react";

export default async function Page() {
  const userData = await getOrCreateUser();
  if (!userData) return null;
  const user = await getUserById(userData.id);
  const subscription = await getUserSubscription(user?.id as string);

  return <ProfileLayout subscription={subscription as Subscription} />;
}
