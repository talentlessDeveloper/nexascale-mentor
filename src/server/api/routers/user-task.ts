import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userTaskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const userTask = {
        ...input,
      };
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.db.userTask.create({
        data: userTask,
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        userTaskId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.db.$transaction([
        ctx.db.task.update({
          where: { id: input.taskId },
          data: {
            userTasks: {
              disconnect: { id: input.userTaskId },
            },
          },
        }),

        ctx.db.userTask.delete({
          where: {
            id: input.userTaskId,
            userId: input.userId,
          },
        }),
      ]);
    }),
  hasStarted: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        taskId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.userTask.findFirst({
        where: {
          userId: input.userId,
          taskId: input.taskId,
        },
        select: {
          isStarted: true,
        },
      });
    }),
  getById: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const task = await ctx.db.userTask.findFirst({
        where: {
          taskId: input.taskId,
        },
      });
      if (!task) throw new TRPCError({ code: "NOT_FOUND" });
      return task;
    }),
});
