// uploadthing.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: {
      // Specify the expected file type
      maxFileSize: "4MB", // Set the maximum file size (optional)
      maxFileCount: 1, // Set the maximum number of files (optional)
    },
  })
    .middleware(async ({ req }) => {
      // Add any necessary authorization logic here
      const userId = "user_id"; // Replace with actual user ID

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("File uploaded by user", metadata.userId);
      console.log("File URL:", file.url);

      // Generate a unique slug for the uploaded file
      const slug = `${metadata.userId}-${Date.now()}-${file.name}`;

      return { fileUrl: file.url, slug };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
