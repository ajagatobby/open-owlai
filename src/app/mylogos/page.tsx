import AppBar from "@/components/section/appbar";
import MyLogos from "@/components/section/my-logos";
import { getLogos, getOrCreateUser } from "@/lib/action";
import React from "react";

export default async function Page() {
  const user = await getOrCreateUser();
  const userLogos = await getLogos(user?.id as string);
  return (
    <>
      <AppBar />
      <div className="lg:px-0 px-2">
        <MyLogos myLogos={userLogos} />
      </div>
    </>
  );
}
