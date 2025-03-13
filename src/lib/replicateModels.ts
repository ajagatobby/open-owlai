export interface ReplicateModel {
  version: string;
  input: Record<string, unknown>;
}

export const REPLICATE_MODELS = {
  ANIMATE_DIFF: {
    version:
      "lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae00d281e2fa377e48a9f",
    input: {
      path: "",
      seed: 0,
      steps: 0,
      prompt: "",
      n_prompt: "",
      motion_module: "",
      guidance_scale: 0,
    },
  },

  TOONCRAFTER: {
    version:
      "fofr/tooncrafter:0486ff07368e816ec3d5c69b9581e7a09b55817f567a0d74caad9395c9295c77",
    input: {
      loop: false,
      prompt: "",
      image_1: "",
      image_2: "",
      image_3: "",
      max_width: 512,
      max_height: 512,
      interpolate: false,
      negative_prompt: "",
      color_correction: true,
    },
  },
  CARTOONIFY: {
    version:
      "catacolabs/cartoonify:f109015d60170dfb20460f17da8cb863155823c85ece1115e1e9e4ec7ef51d3b",
    input: {
      seed: 0,
      image: "",
    },
  },
  FACE_TO_STICKER: {
    version:
      "fofr/face-to-sticker:764d4827ea159608a07cdde8ddf1c6000019627515eb02b6b449695fd547e5ef",
    input: {
      image: "",
      steps: 20,
      width: 1024,
      height: 1024,
      prompt: "",
      upscale: false,
      upscale_steps: 10,
      negative_prompt: "",
      prompt_strength: 4.5,
      ip_adapter_noise: 0.5,
      ip_adapter_weight: 0.2,
      instant_id_strength: 0.7,
    },
  },
  PHOTO_TO_ANIME: {
    version:
      "zf-kbot/photo-to-anime:7936c014091521e64f3721090cc878ab1bceb2d5e0deecc4549092fb7f9ba753",
    input: {
      image: "",
      width: 1024,
      height: 1024,
      prompt: "anime",
      strength: 0.5,
      scheduler: "K_EULER_ANCESTRAL",
      num_outputs: 1,
      guidance_scale: 6,
      negative_prompt: "",
      num_inference_steps: 20,
    },
  },
} as const;
