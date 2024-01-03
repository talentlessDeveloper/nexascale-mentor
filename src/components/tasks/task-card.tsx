import { type Task } from "@prisma/client";
import { Delete, Edit } from "lucide-react";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

type TaskProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskProps) => {
  const { data: sessionData } = useSession();
  return (
    <div className="overflow-hidden rounded-tl-lg rounded-tr-lg shadow-lg shadow-black/10 dark:shadow-white/10">
      <div className="h-80 lg:h-96">
        <Link
          href={`/challenges/${task.id}`}
          className="relative block h-80 lg:h-96"
        >
          <CldImage
            src={task.image}
            alt={task.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full rounded-none rounded-tl-lg rounded-tr-lg object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </div>
      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-center justify-between gap-2">
          <Link href={`/challenges/${task.id}`}>
            <h2 className="text-2xl font-semibold text-accent">{task.title}</h2>
          </Link>
          {sessionData?.user.role === "admin" ? (
            <div className="flex items-center gap-1 ">
              <button>
                <Delete className="text-red-500" />
              </button>
              <button>
                <Edit className="text-emerald-500" />
              </button>
            </div>
          ) : null}
        </div>
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
