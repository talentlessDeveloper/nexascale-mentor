import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import PageTitle from "~/components/shared/page-title";
import TaskCard from "~/components/tasks/task-card";
import TaskSkeleton from "~/components/tasks/task-skeleton";
import { tasks } from "~/lib/tasks";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

const Home = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const userId = sessionData?.user.id;
  console.log(router);

  const {
    data: userTasks,
    isLoading,
    error,
  } = api.userTask.getAll.useQuery(
    { userId: userId! },
    { enabled: !!sessionData?.user.id },
  );

  let content;
  const isCompletedTab = router.query.tab === "completed";

  if (isLoading) {
    content = tasks.map((v) => <TaskSkeleton key={v.id} />);
  }

  if (error) {
    content = <p>Something Went Wrong</p>;
  }

  if (userTasks) {
    const filteredTasks = userTasks.filter(
      (t) => t.isStarted && (isCompletedTab ? t.isSubmitted : !t.isSubmitted),
    );

    content =
      filteredTasks.length > 0 ? (
        filteredTasks.map((t) => {
          const taskData = {
            ...t.task!,
            id: t.taskId!,
            userId: t.userId,
          };
          return <TaskCard key={t.id} task={taskData} />;
        })
      ) : (
        <p>
          {isCompletedTab
            ? "You have not completed any tasks."
            : "You do not have any incomplete tasks."}
        </p>
      );
  }

  return (
    <section className="py-28">
      <PageTitle
        title="Home"
        links={[
          {
            title: "My Challenges",
            href: "/home",
          },
        ]}
      />
      <div className="container py-10">
        <div className="flex items-center justify-between">
          <h2>My Challenge</h2>
          <div className="mb-5 flex gap-3 text-sm font-semibold">
            <Link
              href="/home"
              className={cn(
                "relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:scale-0 after:bg-accent after:transition-transform after:duration-500 hover:after:scale-100",
                {
                  "after:scale-100": router.asPath === "/home",
                },
              )}
            >
              Incomplete
            </Link>
            <Link
              href={{ pathname: "/home", query: { tab: "completed" } }}
              className={cn(
                "relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:scale-0 after:bg-accent after:transition-transform after:duration-500 hover:after:scale-100",
                {
                  "after:scale-100": router.asPath === "/home?tab=completed",
                },
              )}
            >
              Completed
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 pt-10 md:grid-cols-2 lg:grid-cols-3">
          {content}
        </div>
      </div>
    </section>
  );
};

export default Home;
