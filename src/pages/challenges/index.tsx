import TaskCard from "~/components/tasks/task-card";
import TaskSkeleton from "~/components/tasks/task-skeleton";
import { tasks } from "~/lib/tasks";
import { api } from "~/utils/api";

const Challenges = () => {
  const { isLoading, data } = api.task.getAll.useQuery();
  let content;
  if (!data) {
    content = <p>Something went wrong</p>;
  }
  if (isLoading) {
    content = tasks.map((v) => {
      return <TaskSkeleton key={v.id} />;
    });
  }

  if (data) {
    content = data.map((task) => {
      return <TaskCard key={task.id} task={task} />;
    });
  }
  return (
    <section className="py-28">
      <div className="border-y border-solid border-primary/50">
        <div className="container flex justify-between">
          <div className="border-x-primborder-primary/50  flex h-full w-36 items-center justify-center border-x border-solid px-2 py-3">
            <h1 className="border-primary text-lg font-bold uppercase text-primary">
              Challenges
            </h1>
          </div>
        </div>
      </div>
      <div className="container pt-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {content}
        </div>
      </div>
    </section>
  );
};

export default Challenges;
