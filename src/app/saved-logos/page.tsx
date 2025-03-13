import AppBar from "@/components/section/appbar";
import SavedLogos from "@/components/section/saved-logos";
import { getFavoriteLogos, getOrCreateUser } from "@/lib/action";
import React from "react";

export default async function Page() {
  const user = await getOrCreateUser();
  const userLogos = await getFavoriteLogos(user?.id as string);
  return (
    <>
      <AppBar />
      <div className="lg:px-0 px-2">
        <SavedLogos userLogos={userLogos} />
      </div>
    </>
  );
}
