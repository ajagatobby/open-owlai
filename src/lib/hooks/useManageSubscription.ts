import { useState } from "react";

interface ManageSubscriptionData {
  id: string;
  update_url: string | null;
  cancel_url: string | null;
}

export const useManageSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manageSubscription, setManageSubscription] =
    useState<ManageSubscriptionData | null>(null);

  const fetchManageSubscription = async (subscriptionId: string) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setManageSubscription(null);

    try {
      const response = await fetch("/api/manage-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Something went wrong");
      }

      const data = await response.json();
      setManageSubscription(data.subscription);
    } catch (error) {
      setIsError(true);
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchManageSubscription,
    isLoading,
    isError,
    error,
    manageSubscription,
  };
};
