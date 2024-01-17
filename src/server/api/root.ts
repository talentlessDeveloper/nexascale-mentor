import { taskRouter } from "~/server/api/routers/task";
import { createTRPCRouter } from "~/server/api/trpc";
import { userTaskRouter } from "./routers/user-task";
import { solutionsRouter } from "./routers/solutions";
import { usersRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  task: taskRouter,
  userTask: userTaskRouter,
  solution: solutionsRouter,
  user: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
