import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

import * as commands from "@uiw/react-md-editor/lib/commands";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
// const MDPreview = dynamic(
//   () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
//   { ssr: false },
// );

const formSchema = z.object({
  title: z.string().max(255, {
    message: "Title cannot be empty characters",
  }),
  description: z.string().min(15, {
    message: "Description must be at least 15 characters",
  }),
  image: z.string(),
  assets: z.string(),
  brief: z.string(),
});

type FormData = z.infer<typeof formSchema>;

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
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",
      assets: "",
      description: "",
      brief: "",
    },
  });

  console.log("==> ===>", sessionData?.user.role);
  useEffect(() => {
    if (sessionData?.user.role !== "admin") {
      console.log("not Authorized", sessionData?.user.role);
      router.replace("/");
    }
  }, []);

  if (sessionData?.user.role !== "admin") {
    return <h2 className="my-36 text-center">Not Authorized</h2>;
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data, "==>");
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
              <FormField
                name="image"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Image</FormLabel>
                    <FormControl>
                      <Input placeholder="Task Image" {...field} type="file" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

              <Button type="submit">Create Task</Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default CreateTask;
