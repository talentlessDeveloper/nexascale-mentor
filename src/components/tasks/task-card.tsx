import { type Task } from "@prisma/client";
import { Delete, Edit } from "lucide-react";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import toast from "react-hot-toast";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

type TaskProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskProps) => {
  const { data: sessionData } = useSession();
  const ctx = api.useUtils();
  const { isLoading: isDeleting, mutate } = api.task.delete.useMutation({
    onMutate: async ({ taskId }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await ctx.task.getAll.cancel();

      // Snapshot the previous value
      const previousTasks = ctx.task.getAll.getData();

      // Optimistically update to the new value
      ctx.task.getAll.setData(
        undefined,
        (old) => old?.filter((oldTask) => oldTask.id !== taskId),
      );
      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    onSuccess: () => {
      void ctx.task.getAll.invalidate();
      void ctx.userTask.invalidate();
      toast.success("Task deleted successfully");
    },
    onError: (e, _newTodo, context) => {
      // Rollback to the previous value if mutation fails
      ctx.task.getAll.setData(undefined, context?.previousTasks);
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to delete! Please try again later.");
      }
    },
  });

  const deleteTask = (taskId: string) => {
    mutate({ taskId });
  };
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
              <button onClick={() => deleteTask(task.id)}>
                <span className="sr-only">Delete Task</span>
                <Delete
                  className={cn("text-red-500", {
                    "animate-pulse": isDeleting,
                  })}
                />
              </button>
              <Link href={`/challenges/${task.id}/edit`}>
                <span className="sr-only">Edit Task</span>
                <Edit className="text-emerald-500" />
              </Link>
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
