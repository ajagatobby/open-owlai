import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { User } from "@prisma/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useRealtimeUser = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch initial user data for the given userId
        if (userId) {
          const { data: userData, error: userError } = await supabase
            .from("User")
            .select("*")
            .eq("id", userId)
            .single();

          if (userError) {
            console.error("Error fetching user:", userError);
          } else {
            setUser(userData as User);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const channel = supabase
      .channel("user-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "User" },
        (payload: any) => {
          console.log("User change received!", payload);
          if (userId && payload.new.id === userId) {
            switch (payload.eventType) {
              case "INSERT":
              case "UPDATE":
                setUser(payload.new);
                break;
              case "DELETE":
                setUser(null);
                break;
              default:
                break;
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  return { user, loading };
};
