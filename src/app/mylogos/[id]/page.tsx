import GeneratedLogos from "@/components/section/generated-logos";
import ResultAppBar from "@/components/section/result-appbar";
import EmptyState from "@/components/ui/empty-state";
import { getLogo, getOrCreateUser } from "@/lib/action";
import React from "react";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  await getOrCreateUser();

  const logos = await getLogo(params.id as string);
  if (!logos) {
    return (
      <EmptyState
        title="No logo found"
        description="This logo does not exist"
      />
    );
  }
  return (
    <>
      <ResultAppBar />
      <div className="lg:px-0 px-2">
        <GeneratedLogos myLogos={logos} />
      </div>
    </>
  );
}
