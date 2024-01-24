import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const solutionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().max(70, {
          message: "Title cannot be empty characters",
        }),
        description: z.string().min(5, {
          message: "Ask a question or describe your solution",
        }),
        githubLink: z.string().min(10),
        liveSiteLink: z.string().min(10),
        tags: z.string(),
        screenshot: z.string(),
        taskId: z.string(),
        userId: z.string(),
        username: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const solution = {
        ...input,
      };
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.db.solution.create({
        data: solution,
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.solution.findMany({
      orderBy: { createdAt: "asc" },
    });
  }),
  getByUserName: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.solution.findMany({
        where: {
          username: input.username,
        },
      });
    }),
  getById: publicProcedure
    .input(
      z.object({
        solutionId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.solution.findUnique({
        where: {
          id: input.solutionId,
        },
      });
    }),
  hasSubmitted: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        userId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.solution.findFirst({
        where: {
          userId: input.userId,
          taskId: input.taskId,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        solutionId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.session.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      return ctx.db.solution.delete({
        where: {
          id: input.solutionId,
        },
      });
    }),
});
