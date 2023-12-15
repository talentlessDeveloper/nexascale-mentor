import { type Task } from "@prisma/client";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";

type TaskProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskProps) => {
  return (
    <div className="overflow-hidden rounded-tl-lg rounded-tr-lg shadow-lg shadow-black/10 dark:shadow-white/10">
      <div className="relative h-80 lg:h-96 ">
        <Link href={`/challenges/${task.id}`}>
          {task.image.includes("cloudinary") ? (
            <CldImage
              src={task.image}
              alt={task.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="h-full w-full rounded-none rounded-tl-lg rounded-tr-lg object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <Image
              fill
              src={task.image}
              alt={task.title}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="h-full w-full rounded-none rounded-tl-lg rounded-tr-lg object-cover transition-transform duration-300 hover:scale-105"
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col gap-5 p-6">
        <Link href={`/challenges/${task.id}`}>
          <h2 className="text-2xl font-semibold text-accent">{task.title}</h2>
        </Link>
        <ul className="flex gap-1 font-bold ">
          <li>Html</li>
          <li>CSS</li>
          <li>JavaScript</li>
        </ul>
        <div>
          <p>{task.description}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
