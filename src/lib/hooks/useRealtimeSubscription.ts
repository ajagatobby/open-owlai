import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Subscription } from "@prisma/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useRealtimeSubscription = (userId?: string) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch initial subscription data for the given userId
        if (userId) {
          const { data: subscriptionData, error: subscriptionError } =
            await supabase
              .from("Subscription")
              .select("*")
              .eq("userId", userId)
              .single();

          if (subscriptionError) {
            console.error("Error fetching subscription:", subscriptionError);
          } else {
            setSubscription(subscriptionData as Subscription);
          }
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const channel = supabase
      .channel("subscription-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Subscription" },
        (payload: any) => {
          console.log("Change received!", payload);
          if (userId && payload.new.userId === userId) {
            switch (payload.eventType) {
              case "INSERT":
              case "UPDATE":
                setSubscription(payload.new);
                break;
              case "DELETE":
                setSubscription(null);
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

  return { subscription, loading };
};
