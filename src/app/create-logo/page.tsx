import LogoCreatorLayout from "@/components/layout/create-logo";
import { getOrCreateUser } from "@/lib/action";
import React from "react";

export default async function Page() {
  await getOrCreateUser();

  return <LogoCreatorLayout />;
}
