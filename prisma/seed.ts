/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { PrismaClient } from "@prisma/client";
import { tasks, userTasks, users } from "./data";

const prisma = new PrismaClient();

async function main() {
  await prisma.taskStart.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.user.createMany({ data: users });

  await prisma.task.createMany({
    data: tasks, 
  });

  await prisma.taskStart.createMany({
    data: userTasks,
  });
  console.log("Database connected successfully 🙌");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })

 // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
