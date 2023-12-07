import Image from "next/image";
import React from "react";
import { RouterOutputs } from "~/utils/api";

type TaskProps = {
  task: RouterOutputs["task"]["getTasks"][number];
};

const TaskCard = ({ task }: TaskProps) => {
  return (
    <div className="overflow-hidden rounded-tl-lg rounded-tr-lg shadow-lg shadow-black/10 dark:shadow-white/10">
      <div className="relative h-60 lg:h-72 ">
        <Image
          fill
          src={task.image}
          alt={task.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full rounded-none rounded-tl-lg rounded-tr-lg object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-5 p-6">
        <h2 className="text-2xl font-semibold text-accent">{task.title}</h2>
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
