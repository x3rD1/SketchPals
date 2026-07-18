import cloudinary from "../config/cloudinary";

export const uploadThumbnail = (buffer: Buffer) => {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "canvas-thumbnails",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(buffer);
  });
};
