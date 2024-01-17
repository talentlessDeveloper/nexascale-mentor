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
});
