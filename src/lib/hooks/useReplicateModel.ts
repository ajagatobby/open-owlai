import { useState } from "react";
import { REPLICATE_MODELS } from "@/lib/replicateModels";
import { toast } from "sonner";

type ModelName = keyof typeof REPLICATE_MODELS;
type ModelInput<T extends ModelName> = (typeof REPLICATE_MODELS)[T]["input"];

interface UseReplicateModelsResult<T extends ModelName> {
  runModel: (input: ModelInput<T>) => Promise<any>;
  result: any | null;
  error: string | null;
  isLoading: boolean;
}

export function useReplicateModels<T extends ModelName>(
  modelName: T
): UseReplicateModelsResult<T> {
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runModel = async (input: ModelInput<T>) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/stable-diffusion/${modelName.toLowerCase().replace(/_/g, "-")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "An unknown error occurred";
        if (data && data.error) {
          errorMessage = data.error;
        } else if (response.status === 401) {
          errorMessage = "User not authenticated";
        } else if (response.status === 400) {
          errorMessage = data.error || "Invalid input";
        }
        throw new Error(errorMessage);
      }

      setResult(data.output);
      toast.success(`${modelName} model run completed successfully!`);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unknown error occurred";
      setError(errorMessage);

      // Additional handling for specific error messages
      if (errorMessage.includes("Insufficient credits")) {
        toast.error(
          "You don't have enough credits. Please upgrade your plan.",
          {
            duration: 5000,
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { runModel, result, error, isLoading };
}
