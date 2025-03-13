"use server";
import { createClient } from "./server";

export async function signin(email: string, password: string) {
  const supabase = createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      user: null,
      error,
    };
  }

  return data;
}
