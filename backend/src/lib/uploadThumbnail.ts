import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";

export const uploadThumbnail = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "canvas-thumbnails",
      },
      (error, result) => {
        if (error) return reject(error);

        if (!result)
          return reject(new Error("Cloudinary upload returned no result."));

        resolve(result);
      },
    );

    stream.end(buffer);
  });
};
