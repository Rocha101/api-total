import { createUploadthing, type FileRouter } from "uploadthing/express";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  bodyProgressImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async (req) => {
      const user = req.user;

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
