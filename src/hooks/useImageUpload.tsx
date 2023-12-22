import { useState } from "react";
import toast from "react-hot-toast";

interface SelectedImage {
  file: string | null;
  loading: boolean;
  url: string | null;
  error: string | null;
}

type ResponseData = {
  status: "success" | "error";
  message: string;
  imageUrl: string | null;
};

interface ImageUploadHook {
  selectedImage: SelectedImage;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadImage: (body: {
    imageFile: string;
    folderName:
      | "nexascale-frontend-mentor-tasks"
      | "nexascale-frontend-mentor-solutions";
  }) => Promise<void>;
}

export const useImageUpload: () => ImageUploadHook = () => {
  const [selectedImage, setSelectedImage] = useState<SelectedImage>({
    file: null,
    loading: false,
    url: null,
    error: null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      if (loadEvent.target?.result) {
        setSelectedImage({
          ...selectedImage,
          file: loadEvent.target.result as string,
        });
      }
    };

    reader.readAsDataURL(file);
  };

  const uploadImage = async (body: {
    imageFile: string;
    folderName:
      | "nexascale-frontend-mentor-tasks"
      | "nexascale-frontend-mentor-solutions";
  }): Promise<void> => {
    if (selectedImage.loading) {
      return;
    }

    setSelectedImage({
      ...selectedImage,
      loading: true,
    });

    try {
      const res = await fetch("/api/uploadImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as ResponseData;

      if (res.ok) {
        setSelectedImage({
          ...selectedImage,
          url: data.imageUrl ?? null,
          loading: false,
        });
        toast.success(data.message);
      } else {
        setSelectedImage({
          ...selectedImage,
          error: data.message,
          loading: false,
        });
        toast.error(data.message);
      }
    } catch (error) {
      setSelectedImage({
        ...selectedImage,
        error: "Server Error, Try again Later",
        loading: false,
      });
      toast.error("Server Error, Try again Later");
    }
  };

  return { selectedImage, handleImageChange, uploadImage };
};
