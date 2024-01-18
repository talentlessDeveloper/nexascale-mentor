import dayjs from "dayjs";
import { HeartIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";
import { type Solution } from "../tasks/types/ITask";

import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
dayjs.extend(relativeTime);

type SolutionCardProps = {
  solution: Solution;
  pathname: string;
};

const SolutionCard = ({ solution, pathname }: SolutionCardProps) => {
  const { data: userData } = api.user.getByUsername.useQuery({
    username: solution.username!,
  });

  const formatDate = dayjs(solution.createdAt).fromNow();

  return (
    <div className="overflow-hidden rounded-tl-lg rounded-tr-lg shadow-lg shadow-black/10 dark:shadow-white/10">
      <div className="h-80 lg:h-96">
        <Link
          href={`/solutions/${solution.id}`}
          className="relative block h-80 lg:h-96"
        >
          <CldImage
            src={solution.screenshot}
            alt={solution.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full rounded-none rounded-tl-lg rounded-tr-lg object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </div>
      <div className="flex flex-col gap-5 divide-y p-6 ">
        <div>
          <div className="flex flex-col items-start justify-between gap-2">
            <small>Submitted {formatDate}</small>
            <Link href={`/solutions/${solution.id}`}>
              <h2 className="text-2xl font-semibold text-accent">
                {solution.title}
              </h2>
            </Link>
            <div className="flex gap-1 text-blue-500">
              {solution.tags.split(",").map((t, index) => (
                <span key={`tags-${index}-${t}`}>#{t}</span>
              ))}
            </div>
          </div>
          <div className="flex justify-between ">
            <ul className="flex gap-1 font-semibold">
              <li>Html</li>
              <li>CSS</li>
              <li>JavaScript</li>
            </ul>
            <button>
              <HeartIcon />
            </button>
          </div>
        </div>
        {!pathname.includes("profile") ? (
          <div className="flex items-center gap-2 py-3">
            {userData ? (
              <Link href={`/profile/${userData?.username}`}>
                <Image
                  width={48}
                  height={48}
                  src={userData.image!}
                  alt={"Ope"}
                  className="h-12 w-12 rounded-full"
                />
              </Link>
            ) : null}
            {userData ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-[2px]">
                  <Link
                    href={`/profile/${userData?.username}`}
                    className="text-sm font-bold hover:underline"
                  >
                    {userData?.name}
                  </Link>
                  <span className="font-bold">.</span>
                  <span className="text-bold text-blue-900">
                    {userData?.points}
                  </span>
                </div>
                <span>@{userData?.username}</span>
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="py-3">
          <p>{solution.description}</p>
        </div>
      </div>
    </div>
  );
};

export default SolutionCard;
