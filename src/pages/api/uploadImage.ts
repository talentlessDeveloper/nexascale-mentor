import { v2 } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";

v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: env.CLOUDINARY_CLOUD_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "This API only accepts POST methods",
    });
  }

  let imageUrl;
  const { imageFile } = req.body;

  if (imageFile) {
    // console.log("entered the if block");
    try {
      const uploadedImage = await v2.uploader.upload(imageFile, {
        folder: "nexascale-frontend-mentor-tasks", // Set the folder in your Cloudinary where images will be stored
        resource_type: "image", // Specify the type of resource
      });

      imageUrl = uploadedImage.secure_url;

      return res.status(200).json({
        status: "success",
        message: "Image Uploaded Successfully",
        imageUrl,
      });
    } catch (error) {
      //   console.error("Error updating profile: ==>", error);
      return res.status(500).json({
        status: "error",
        message: "Error Uploading Image",
        imageUrl: null,
      });
    }
  }
}
// export const config = {
//   api: {
//     externalResolver: true,
//   },
// };
