import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import PageTitle from "~/components/shared/page-title";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { MultiSelect } from "~/components/ui/multi-select";
import { useImageUpload } from "~/hooks/useImageUpload";
import { frontendTechOptions } from "~/lib/dummyData";
import { api } from "~/utils/api";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const MAX_FILE_SIZE = 1024 * 1024 * 1;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/avif",
  "image/webp",
];

const formSchema = z.object({
  title: z.string().max(70).min(5, {
    message: "Solution Title is required",
  }),
  githubLink: z.string().min(10),
  liveSiteLink: z.string().min(10),
  tags: z.array(z.record(z.string().trim())).max(5, {
    message: "You can't select more than 5 tags",
  }),
  description: z.string().min(5, {
    message: "Ask a question or describe your solution",
  }),
  screenshot: z
    .unknown()
    .refine((file: unknown) => {
      if (file instanceof File) {
        return file;
      }
      return false;
    }, `Please choose and upload an image`)
    .refine((file: unknown) => {
      if (file instanceof File) {
        return file.size <= MAX_FILE_SIZE;
      }
      return false;
    }, `Image Max Size is 1MB`)
    .refine((file: unknown) => {
      if (file instanceof File) {
        return ACCEPTED_IMAGE_MIME_TYPES.includes(file.type);
      }
      return false;
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});

type FormData = z.infer<typeof formSchema>;

const Submit = () => {
  const { data: sessionData, status } = useSession();
  const { selectedImage, handleImageChange, uploadImage } = useImageUpload();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      githubLink: "",
      liveSiteLink: "",
      tags: [],
      description: "",
      screenshot: undefined,
    },
  });
  const router = useRouter();
  const slug = router.query.slug as string;

  const ctx = api.useUtils();

  const { isLoading: isSubmitting, mutate } = api.solution.create.useMutation({
    onSuccess: () => {
      form.reset();
      void ctx.solution.getAll.invalidate();
      toast.success("Task Submitted successfully");
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
    if (!sessionData?.user.id || status !== "authenticated") {
      void router.replace("/");
    }
  }, [router, sessionData?.user.id, status]);

  if (!sessionData?.user.id) {
    return <div>Not Authorized</div>;
  }

  const onSubmit = (data: FormData) => {
    if (!selectedImage.url || isSubmitting) {
      return;
    }
    const tags = data.tags.map((t) => t.value).join(",");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { screenshot, ...restData } = data;
    const solutionsData = {
      ...restData,
      tags,
      screenshot: selectedImage.url,
      taskId: slug,
      userId: sessionData?.user.id,
    };
    mutate(solutionsData);
  };
  return (
    <section className="py-28">
      <PageTitle title="Solution" />
      <div className="container py-20">
        <div className="mx-auto max-w-3xl rounded-md p-8  shadow-md">
          <Form {...form}>
            <form
              className="w-full space-y-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold ">
                      Solution title
                    </FormLabel>
                    <FormDescription className="italic">
                      <p>
                        Include some of the tools and techniques you used to
                        complete the challenge.
                      </p>
                    </FormDescription>
                    <FormControl>
                      <>
                        <Input
                          placeholder="e.g Responsive Landing Page Using CSS Grid"
                          {...field}
                        />
                        <p className="text-right text-xs">
                          {70 - form.watch("title").length} characters remaining
                        </p>
                      </>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold">
                      Repository Url
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="liveSiteLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold">
                      Live Site
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold">
                      Tags
                    </FormLabel>
                    <FormDescription className="italic">
                      <p>
                        Add up to 5 tags based on your tools and approaches for
                        this project. We don’t require HTML, CSS, and JavaScript
                        tags, as they are the foundational front-end languages.
                        Don’t see the tag you want? Mention it on the channel an
                        we will include them
                      </p>
                    </FormDescription>
                    <MultiSelect
                      selected={field.value}
                      options={frontendTechOptions}
                      {...field}
                      className="w-full group-hover:bg-red-500"
                    />

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
                  name="screenshot"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl font-semibold">
                        Live Site ScreenShot
                      </FormLabel>
                      <FormDescription className="italic">
                        <p>
                          Take a screenshot of your liveSiteLink app and upload
                          it here. You can easily do this on firefox by right
                          clicking and right before inspect, theres a take a
                          screenshot option.
                        </p>
                      </FormDescription>
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
                                  folderName:
                                    "nexascale-frontend-mentor-solutions",
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
                    <FormLabel className="text-xl font-semibold">
                      Questions for the community
                    </FormLabel>
                    <FormDescription className="">
                      <ul className="list-inside list-disc space-y-3 italic  [&>:not(p)]:pl-5">
                        <p>
                          Please ensure you add specific questions you&apos;d
                          like people to answer if you want feedback. Specific
                          questions are more likely to receive helpful feedback
                          than general statements like &ldquo;Feedback
                          welcome&rdquo;. Things to consider when asking for
                          specific feedback include:
                        </p>

                        <li>
                          What did you find difficult while building the
                          project?
                        </li>
                        <li>Which areas of your code are you unsure of?</li>
                        <li>Do you have any questions about best practices?</li>
                      </ul>
                    </FormDescription>
                    <FormControl>
                      <div className="pt-10">
                        <MDEditor {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="">
                {isSubmitting ? "Submitting task..." : "Submit Solution"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Submit;
