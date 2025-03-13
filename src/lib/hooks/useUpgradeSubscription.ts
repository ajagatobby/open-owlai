import { useMutation } from "@tanstack/react-query";
import { upgradeSubscription } from "../subscription";
import { toast } from "sonner";

export const useUpgradeSubscription = () => {
  const { data, mutate, isPending, isError } = useMutation({
    mutationFn: async ({ priceId }: { priceId: string }) => {
      toast.loading("Upgrading subscription");
      const data = await upgradeSubscription({ priceId });
      return data;
    },
    onSuccess: () => {
      toast.success("Subscription upgraded successfully");
    },
    onError: () => {
      toast.error("Error upgrading subscription");
      toast.dismiss();
    },
  });

  return {
    isUpgrading: isPending,
    mutate,
    isError,
    data,
  };
};
