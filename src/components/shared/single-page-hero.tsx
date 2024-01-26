import { ArrowUpRightSquare, HeartIcon, MoreVerticalIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useState, type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import type { Solution, Task } from "../tasks/types/ITask";
import { Button } from "../ui/button";
import UserCardInfo from "./user-card-info";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
dayjs.extend(relativeTime);

type AllowedTypes = Task | Solution;

type SinglePageHeroProps<T extends AllowedTypes> = {
  prop: T;
  setOpenModal: Dispatch<SetStateAction<boolean>>;

  type: "solution" | "task";
};

const SinglePageHero = <T extends AllowedTypes>({
  prop,
  setOpenModal,
  type,
}: SinglePageHeroProps<T>) => {
  const [showOptions, setShowOptions] = useState(false);
  const { data: sessionData } = useSession();

  const imageUrl = "screenshot" in prop ? prop.screenshot : prop.image;
  const liveSiteLink = "liveSiteLink" in prop ? prop.liveSiteLink : "";
  const githubLink = "githubLink" in prop ? prop.githubLink : "";
  const taskId = "taskId" in prop ? prop.taskId : prop.id;
  const tags = "tags" in prop ? prop.tags : null;
  const username =
    "username" in prop && prop.username !== null ? prop.username : "";
  const { data: userData } = api.user.getByUsername.useQuery(
    {
      username,
    },
    {
      enabled: !!username,
    },
  );
  const formatDate = dayjs(prop.createdAt).fromNow();
  const canYouDelete = sessionData?.user.id === prop.userId;
  return (
    <div className="relative  h-screen">
      <div className="relative z-[2] h-full w-full  bg-black/90 px-5 py-8 lg:px-10 lg:py-20">
        {canYouDelete || type === "task" ? (
          <Button
            className="absolute right-7 top-7 h-12 w-12 rounded-full"
            onClick={() => setShowOptions((prev) => !prev)}
          >
            <MoreVerticalIcon />
          </Button>
        ) : null}
        {showOptions ? (
          <ul className="absolute right-9 top-20 divide-y rounded-md bg-white px-5">
            <li className="py-3">
              <Link href={`/challenges/${taskId}`}>Visit Challenge Page</Link>
            </li>
            {type === "solution" ? (
              <li>
                <Link className="py-3" href={`/solutions/${prop.id}/edit`}>
                  Edit Solution
                </Link>
              </li>
            ) : null}
            <li className="py-3">
              <button
                className="p-0 font-normal text-red-500"
                onClick={() => setOpenModal(true)}
              >
                {type === "solution"
                  ? "Delete Solution"
                  : "Remove From My Challenges"}
              </button>
            </li>
          </ul>
        ) : null}
        <div className="flex flex-col items-center gap-3 py-7 text-center lg:gap-5 lg:py-14">
          {type === "solution" ? (
            <p className="text-center text-white">Submitted {formatDate}</p>
          ) : null}
          {type === "task" ? (
            <>
              <h2 className="text-2xl font-semibold text-white lg:text-3xl">
                Challenge Hub
              </h2>
              <h2 className="text-2xl font-semibold text-white lg:text-4xl">
                {prop?.title}
              </h2>
            </>
          ) : (
            <h2 className="text-2xl font-semibold text-white lg:text-4xl">
              {prop?.title}
            </h2>
          )}

          {tags ? (
            <div className="flex items-center gap-1 text-white">
              {tags.split(",").map((t, i) => (
                <span key={`${type}-${i}`}>#{t}</span>
              ))}
            </div>
          ) : null}
          {userData ? (
            <div className="text-white">
              <UserCardInfo userData={userData} />
            </div>
          ) : null}
        </div>
        {type === "solution" ? (
          <div className="flex  items-center justify-around gap-2 ">
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <a
                href={liveSiteLink}
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-1 text-lg text-white lg:px-5 lg:py-3"
              >
                <span>Preview Site</span>
                <span>
                  <ArrowUpRightSquare />
                </span>
              </a>
              <a
                href={githubLink}
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-xl bg-white/60 px-3 py-1 text-lg text-black lg:px-5 lg:py-3"
              >
                <span>View Code</span>{" "}
                <span>
                  <ArrowUpRightSquare />
                </span>
              </a>
            </div>
            <div>
              <Button className="rounded-xl px-5 py-3">
                <HeartIcon />
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <CldImage
        src={imageUrl}
        alt={prop.title}
        fill
        sizes="100vw"
        className="h-full w-full rounded-none rounded-tl-lg rounded-tr-lg object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
};

export default SinglePageHero;
