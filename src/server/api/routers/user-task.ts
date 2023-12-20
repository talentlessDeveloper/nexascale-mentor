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

      return ctx.db.taskStart.create({
        data: userTask,
      });
    }),
  hasStarted: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        taskId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.taskStart.findFirst({
        where: {
          userId: input.userId,
          taskId: input.taskId,
        },
      });
    }),
});
