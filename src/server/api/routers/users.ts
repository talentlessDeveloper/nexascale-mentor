import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  getByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          username: input.username,
        },
      });
    }),
});
