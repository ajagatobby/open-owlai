import SketchToLogoLayout from "@/components/layout/sketch-to-logo";
import { getOrCreateUser } from "@/lib/action";
import React from "react";

export default async function Page() {
  await getOrCreateUser();

  return (
    <>
      <SketchToLogoLayout />
    </>
  );
}
