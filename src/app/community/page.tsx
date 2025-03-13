import AppBar from "@/components/section/appbar";
import Community from "@/components/section/community";
import { getAllLogos } from "@/lib/action";
import React from "react";

export default async function Page() {
  const communityLogos = await getAllLogos();
  return (
    <>
      <AppBar />
      <div className="lg:px-0 px-2">
        <Community communityLogos={communityLogos} />
      </div>
    </>
  );
}
