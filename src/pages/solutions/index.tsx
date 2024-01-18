import { useRouter } from "next/router";
import React from "react";
import PageTitle from "~/components/shared/page-title";
import SolutionCard from "~/components/solutions/solution-card";
import TaskSkeleton from "~/components/tasks/task-skeleton";
import { tasks } from "~/lib/tasks";
import { api } from "~/utils/api";

const Solutions = () => {
  const {
    data: solutionsData,
    isLoading,
    isError,
  } = api.solution.getAll.useQuery();
  const router = useRouter();
  const pathname = router.pathname;

  let solutionContent;
  if (isLoading) {
    solutionContent = tasks.map((v) => {
      return <TaskSkeleton key={v.id} />;
    });
  }

  if (isError) {
    solutionContent = (
      <p className="text-center text-xl">Hmm something went wrong </p>
    );
  }

  if (solutionsData?.length === 0 || !solutionsData) {
    solutionContent = <p className="text-center text-xl">No Solutions Yet </p>;
  } else {
    solutionContent = solutionsData.map((solution) => (
      <SolutionCard key={solution.id} solution={solution} pathname={pathname} />
    ));
  }
  return (
    <div className="pt-28">
      <PageTitle title="Solutions" />
      <section>
        <div className="container py-10">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {solutionContent}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Solutions;
