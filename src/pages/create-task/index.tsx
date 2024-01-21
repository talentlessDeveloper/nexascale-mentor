import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip } from "lucide-react";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { taskFormSchema as formSchema } from "~/lib/form-schemas";
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
import { useImageUpload } from "~/hooks/useImageUpload";
import { api } from "~/utils/api";
import { type z } from "zod";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
// const MDPreview = dynamic(
//   () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
//   { ssr: false },
// );

type FormData = z.infer<typeof formSchema>;

// type DataWithoutImageFile = Omit<FormData, "imageFile">;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const CreateTask = () => {
  const { data: sessionData } = useSession();
  const { handleImageChange, uploadImage, selectedImage } = useImageUpload();
  const router = useRouter();
  //   const [brief, setBrief] = useState<string | undefined>("Default Text na awa");
  //   const [preview, setPreview] = useState<"write" | "preview">("write");
  // const [selectedImage, setSelectedImage] = useState<{
  //   file: string | null;
  //   url: string;
  //   error: string;
  //   loading: boolean;
  // }>({
  //   file: null,
  //   url: "",
  //   error: "",
  //   loading: false,
  // });
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
    if (sessionData?.user.role?.toLowerCase() !== "admin") {
      void router.replace("/");
    }
  }, [router, sessionData?.user.role]);

  if (sessionData?.user.role?.toLowerCase() !== "admin") {
    return <h2 className="my-36 text-center">Not Authorized</h2>;
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!selectedImage.url || isPosting) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { imageFile, ...restData } = data;
    const taskData = {
      ...restData,
      image: selectedImage.url,
      userId: sessionData.user.id,
    };

    // console.log(taskData, "==>");
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
                                  folderName: "nexascale-frontend-mentor-tasks",
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
