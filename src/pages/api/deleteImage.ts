import { v2 } from "cloudinary";
import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { type FolderName } from "~/lib/types";

v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: env.CLOUDINARY_CLOUD_API_SECRET,
});

interface CloudinaryDestroyResponse {
  result: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "This API only accepts POST methods",
    });
  }
  const { imagePublicId, folderName } = req.body as {
    imagePublicId: string;
    folderName: FolderName;
  };
  if (!imagePublicId) {
    return res.status(400).json({ error: "Missing publicId in request body" });
  }

  if (imagePublicId) {
    try {
      const { result } = (await v2.uploader.destroy(
        `${folderName}/${imagePublicId}`,
      )) as CloudinaryDestroyResponse;
      console.log("==> result", result);
      return res.status(200).json(result);
    } catch (error) {
      console.error("delete error ==>", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
