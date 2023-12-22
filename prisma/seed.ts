import { PrismaClient } from "@prisma/client";
import { tasks, userTasks, users } from "./data";

const prisma = new PrismaClient();

async function main() {
  await prisma.userTask.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.user.createMany({ data: users });

  await prisma.task.createMany({
    data: tasks,
  });

  await prisma.userTask.createMany({
    data: userTasks,
  });
  console.log("Database connected successfully 🙌");
}

try{
  main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
}
finally{
  await prisma.$disconnect();
}