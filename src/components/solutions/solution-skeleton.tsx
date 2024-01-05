import React from "react";
import { Skeleton } from "../ui/skeleton";

const SolutionSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg shadow-lg shadow-black/10 dark:shadow-white/10">
      <div className="relative h-60 lg:h-72 ">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className="flex flex-col gap-5 p-6">
        <Skeleton className="h-8 text-2xl font-semibold text-accent" />
        <ul className="flex gap-1 font-bold ">
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-6 w-10" />
        </ul>
        <div>
          <Skeleton className="h-36" />
        </div>
      </div>
    </div>
  );
};

export default SolutionSkeleton