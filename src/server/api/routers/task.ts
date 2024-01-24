import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //         createdBy: { connect: { id: ctx.session.user.id } },
  //       },
  //     });
  //   }),

  // getLatest: protectedProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //     where: { createdBy: { id: ctx.session.user.id } },
  //   });
  // }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().max(255, {
          message: "Title cannot be empty characters",
        }),
        description: z.string().min(15, {
          message: "Description must be at least 15 characters",
        }),
        assets: z.string(),
        brief: z.string(),
        image: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const taskData = {
        ...input,
      };

      if (ctx.session.user.role?.toLowerCase() !== "admin")
        throw new TRPCError({ code: "UNAUTHORIZED" });

      return ctx.db.task.create({
        data: taskData,
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    return ctx.db.task.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: publicProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const task = await ctx.db.task.findUnique({
        where: {
          id: input.taskId,
        },
      });
      if (!task) throw new TRPCError({ code: "NOT_FOUND" });
      return task;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role?.toLowerCase() !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      return ctx.db.$transaction([
        ctx.db.taskStart.deleteMany({
          where: {
            taskId: input.taskId,
          },
        }),
        ctx.db.task.delete({
          where: {
            id: input.taskId,
          },
        }),
      ]);
    }),
  edit: protectedProcedure
    .input(
      z.object({
        title: z.string().max(255, {
          message: "Title cannot be empty characters",
        }),
        description: z.string().min(15, {
          message: "Description must be at least 15 characters",
        }),
        assets: z.string(),
        brief: z.string(),
        image: z.string(),
        taskId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { taskId, ...taskData } = input;

      if (ctx.session.user.role?.toLowerCase() !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.db.task.update({
        where: {
          id: taskId,
        },
        data: taskData,
      });
    }),
});
