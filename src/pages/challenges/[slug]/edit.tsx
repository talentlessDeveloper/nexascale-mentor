import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import PageTitle from "~/components/shared/page-title";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
// import { taskFormSchema as formSchema } from "~/lib/form-schemas";
import dynamic from "next/dynamic";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { CldImage } from "next-cloudinary";
import { useImageUpload } from "~/hooks/useImageUpload";
import { Paperclip } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import toast from "react-hot-toast";
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from "~/lib/form-schemas";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

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
    .optional()
    .refine((file: unknown) => {
      if (file instanceof File) {
        return ACCEPTED_IMAGE_MIME_TYPES.includes(file.type);
      }
      return false;
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional(),
});

type FormData = z.infer<typeof formSchema>;
const Edit = () => {
  const { handleImageChange, uploadImage, selectedImage } = useImageUpload();
  const router = useRouter();
  const slug = router.query.slug;

  const { data: task, isLoading } = api.task.getById.useQuery({
    taskId: slug as string,
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
    values: task,
  });

  const ctx = api.useUtils();

  const { isLoading: isEditing, mutate } = api.task.edit.useMutation({
    onSuccess: () => {
      form.reset();
      void ctx.task.getAll.invalidate();
      void ctx.task.getById.invalidate({
        taskId: task?.id,
      });
      toast.success("Task Edited successfully");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to edit! Please try again later.");
      }
    },
  });

  // const onSubmit: SubmitHandler<FormData> = (data) => {
  //   console.log(data);
  //   if (!isEditing) {
  //     return;
  //   }
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const { imageFile, ...restData } = data;
  //   const taskData = {
  //     ...restData,
  //     image: selectedImage.url ?? task.image,
  //   };
  //   mutate(taskData)
  // };

  if (isLoading) {
    return (
      <div className="container py-28">
        <p className="text-center text-2xl">Loading...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="py-28 text-center">
        <p className="lg:text-5xl">404</p>
      </div>
    );
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    if (isEditing) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { imageFile, ...restData } = data;
    const taskData = {
      ...restData,
      image: selectedImage.url ?? task.image,
      taskId: task.id,
    };
    mutate(taskData);
  };

  return (
    <section>
      <div className="py-28">
        <PageTitle title="Edit Task" />
        <div className="container">
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
                {selectedImage.file ? (
                  <Image
                    src={selectedImage.file}
                    width={100}
                    height={100}
                    alt="file"
                  />
                ) : (
                  <CldImage
                    src={task?.image}
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
                {isEditing ? "Editing task..." : "Edit task"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Edit;
