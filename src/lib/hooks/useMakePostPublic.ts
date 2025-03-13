import { useMutation } from "@tanstack/react-query";
import { isPublic, makeLogoNotPublic, makeLogoPublic } from "../action";
import { toast } from "sonner";

const useMakePostPublic = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: async ({
      userId,
      logoId,
    }: {
      userId: string;
      logoId: string;
    }) => {
      const toastId = toast.loading("Action Triggered");
      const isAlreadyPublic = await isPublic(logoId, userId);
      toast;
      if (isAlreadyPublic) {
        toast.dismiss(toastId);
        setTimeout(() => {}, 1000);
        toast.loading("Making logo not public");
        const data = await makeLogoNotPublic(logoId, userId);
        return data;
      }
      toast.dismiss(toastId);
      setTimeout(() => {}, 1000);

      toast.loading("Making logo public");

      const data = await makeLogoPublic(logoId, userId);
      return data;
    },
    onSuccess: () => {
      toast.success("Logo modified successfully");
      toast.dismiss();
    },
    onError: () => {
      toast.error("Failed to make logo public");
      toast.dismiss();
    },
  });

  const checkPublicity = async (logoId: string, userId: string) => {
    const data = await isPublic(logoId, userId);
    return data;
  };

  return {
    isPublicizing: isPending,
    mutate,
    checkPublicity,
  };
};

export default useMakePostPublic;
