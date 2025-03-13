"use client";

import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const TopProgressBar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // This effect will run on route changes
  useEffect(() => {}, [pathname, searchParams]);

  return (
    <ProgressBar
      height="4px"
      color="#4f46e5"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
};

export default TopProgressBar;
