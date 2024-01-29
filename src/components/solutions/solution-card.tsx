import dayjs from "dayjs";
import { HeartIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { type Solution } from "../tasks/types/ITask";

import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import UserCardInfo from "../shared/user-card-info";
import dynamic from "next/dynamic";
dayjs.extend(relativeTime);

const MDPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false },
);

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
              {solution.tags.split(",").map((t: string, index) => (
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
        {!pathname.includes("profile") && userData ? (
          <UserCardInfo userData={userData} />
        ) : null}
        <div className="py-3">
          <MDPreview source={solution.description} />
          {/* <p>{solution.description}</p> */}
        </div>
      </div>
    </div>
  );
};

export default SolutionCard;
