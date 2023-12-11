import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip } from "lucide-react";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import z from "zod";
import { getServerAuthSession } from "~/server/auth";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import { api } from "~/utils/api";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
// const MDPreview = dynamic(
//   () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
//   { ssr: false },
// );

const MAX_FILE_SIZE = 1024 * 1024 * 1;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/avif",
  "image/webp",
];

const formSchema = z.object({
  title: z.string().max(255, {
    message: "Title cannot be empty characters",
  }),
  description: z.string().min(15, {
    message: "Description must be at least 15 characters",
  }),
  assets: z.string(),
  brief: z.string(),
  imageFile: z
    .unknown()
    .refine((file: unknown) => {
      if (file instanceof File) {
        return file.size <= MAX_FILE_SIZE;
      }
      return false;
    }, `Max image size is 1MB.`)
    .refine((file: unknown) => {
      if (file instanceof File) {
        return ACCEPTED_IMAGE_MIME_TYPES.includes(file.type);
      }
      return false;
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});

type FormData = z.infer<typeof formSchema>;
type ResponseData = {
  status: "success" | "error";
  message: string;
  imageUrl: string | null;
};

// type DataWithoutImageFile = Omit<FormData, "imageFile">;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const CreateTask = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  //   const [brief, setBrief] = useState<string | undefined>("Default Text na awa");
  //   const [preview, setPreview] = useState<"write" | "preview">("write");
  const [selectedImage, setSelectedImage] = useState<{
    file: string | null;
    url: string;
    error: string;
    loading: boolean;
  }>({
    file: null,
    url: "",
    error: "",
    loading: false,
  });
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      imageFile: undefined,
      assets: "",
      description: "",
      brief: "",
    },
  });
  const ctx = api.useUtils();

  const { isLoading: isPosting, mutate } = api.task.create.useMutation({
    onSuccess: () => {
      form.reset();
      void ctx.task.getAll.invalidate();
      toast.success("Task created successfully");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  useEffect(() => {
    if (sessionData?.user.role !== "admin") {
      void router.replace("/");
    }
  }, [router, sessionData?.user.role]);

  if (sessionData?.user.role !== "admin") {
    return <h2 className="my-36 text-center">Not Authorized</h2>;
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const uploadImage = async (body: { imageFile: string }) => {
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
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as ResponseData;
      if (res.ok) {
        setSelectedImage({
          ...selectedImage,
          url: data.imageUrl!,
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

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!selectedImage.url || isPosting) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { imageFile, ...restData } = data;
    const taskData = {
      ...restData,
      image: selectedImage.url,
    };

    console.log(taskData, "==>");
    mutate(taskData);
  };

  return (
    <section>
      <div className="container py-28">
        <div className="border-y border-solid border-primary/50">
          <div className="container flex justify-between">
            <div className="border-x-primborder-primary/50  flex h-full w-36 items-center justify-center border-x border-solid px-2 py-3">
              <h1 className="border-primary text-lg font-bold uppercase text-primary">
                Create Task
              </h1>
            </div>
          </div>
        </div>
        <div className="py-20">
          <Form {...form} handleSubmit={() => form.handleSubmit(onSubmit)}>
            <form
              className="mx-auto flex max-w-3xl flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Task Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                {selectedImage.file && (
                  <Image
                    src={selectedImage.file}
                    width={100}
                    height={100}
                    alt="file"
                  />
                )}
                <FormField
                  name="imageFile"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {/* <Input placeholder="Task Image" {...field} type="file" /> */}
                        <div className="flex items-center gap-2">
                          <Button size="lg" type="button">
                            <input
                              type="file"
                              className="hidden"
                              id="fileInput"
                              onBlur={field.onBlur}
                              name={field.name}
                              onChange={(e) => {
                                field.onChange(e.target.files?.[0]);
                                console.log(e.target.files?.[0]?.size);
                                handleImageChange(e);
                              }}
                              ref={field.ref}
                            />
                            <label
                              htmlFor="fileInput"
                              className="text-neutral-90 inline-flex cursor-pointer items-center gap-3 rounded-md"
                            >
                              <Paperclip />
                              <span className="whitespace-nowrap">
                                choose your image
                              </span>
                            </label>
                          </Button>
                          <Button
                            type="button"
                            size="lg"
                            onClick={() => {
                              if (selectedImage.file) {
                                void uploadImage({
                                  imageFile: selectedImage.file,
                                });
                              }
                            }}
                          >
                            {selectedImage.loading
                              ? "Uploading..."
                              : "Upload Image"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="assets"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Assets</FormLabel>
                    <FormControl>
                      <Input placeholder="Task assets" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="brief"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Brief</FormLabel>
                    <FormControl>
                      <>
                        <MDEditor {...field} />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {isPosting ? "Creating task..." : "Create task"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default CreateTask;
