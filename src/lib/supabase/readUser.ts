"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const readUserData = async () => {
  const session = createServerComponentClient({ cookies });
  const user = (await session.auth.getUser()).data.user;
  return user;
};
