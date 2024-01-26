import { type Task } from "@prisma/client";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import LoggedInModal from "../modals/logged-in";
import PageTitle from "../shared/page-title";
import { Button } from "../ui/button";
import Link from "next/link";
import ModalLayout from "../modals/modal-layout";

const MDPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false },
);

type SinglePageTaskProps = {
  task: Task;
};

const SinglePageTask = ({ task }: SinglePageTaskProps) => {
  const [openLoggedInModal, setOpenLoggedInModal] = useState(false);
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const userId = sessionData?.user.id;
  const { data: userTaskData } = api.userTask.hasStarted.useQuery(
    {
      userId: userId!,
      taskId: task.id,
    },
    {
      enabled: !!userId,
    },
  );

  const ctx = api.useUtils();

  const { isLoading: isStartingUserTask, mutate } =
    api.userTask.create.useMutation({
      onSuccess: (data) => {
        toast.success("Challenge Successfully Started");
        void router.push(`/challenges/${task.id}/${data.id}/hub`);
        // TODO: ensure you invalidate all userTasks
        void ctx.userTask.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage?.[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to post! Please try again later.");
        }
      },
    });

  const handleStartChallenge = () => {
    if (status === "unauthenticated" || !sessionData) {
      setOpenLoggedInModal(true);
      return;
    }

    const userTask = {
      userId: sessionData.user.id,
      taskId: task.id,
    };

    mutate(userTask);
  };
  return (
    <>
      <ModalLayout
        openModal={openLoggedInModal}
        setOpenModal={setOpenLoggedInModal}
      >
        <LoggedInModal />
      </ModalLayout>
      <div className="py-28 font-inter">
        <PageTitle title="Challenge" />
        <div className="container">
          <section className="mt-10">
            <div className="flex flex-col justify-between gap-10 rounded-2xl border border-solid border-border px-5 py-10 lg:flex-row lg:items-center lg:px-10">
              <div className="flex flex-col  gap-7  lg:w-1/2">
                <div className="flex justify-between">
                  <ul className="flex gap-1 font-bold ">
                    <li>Html</li>
                    <li>CSS</li>
                    <li>JavaScript</li>
                  </ul>
                  <p>NewBie</p>
                </div>
                <h1 className="text-3xl font-bold">{task.title}</h1>
                <p>{task.description}</p>
                {userTaskData?.isStarted ? (
                  <div className="flex flex-col gap-3">
                    <p>Seems Like you have started this challenge</p>

                    <Link
                      href={`/challenges/${task.id}/hub`}
                      className="flex h-auto max-w-[280px] items-center justify-center rounded-xl bg-accent py-3 text-xl hover:bg-accent/75 "
                    >
                      Visit Challenge Hub
                    </Link>
                  </div>
                ) : (
                  <Button
                    className="h-auto max-w-[280px] rounded-xl bg-accent py-3 text-xl "
                    onClick={handleStartChallenge}
                  >
                    {isStartingUserTask ? "Starting..." : " Start Challenge"}
                  </Button>
                )}
              </div>
              <div className=" lg:w-1/2">
                {task.image.includes("cloudinary") ? (
                  <CldImage
                    src={task.image}
                    alt=""
                    sizes="100vw"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "410px",
                    }}
                    width={559}
                    height={409}
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src={task.image}
                    alt={task.title}
                    sizes="100vw"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "410px",
                    }}
                    width={559}
                    height={409}
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          </section>

          <section className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="rounded-2xl border border-solid border-border px-6 py-10 lg:w-1/2">
              <h3 className="flex items-center gap-3 text-3xl font-semibold">
                <span>📝</span>
                Brief
              </h3>
              <div className="prose- mt-6">
                <MDPreview source={task.brief} />
              </div>
            </div>
            <div className="rounded-2xl border border-solid border-border px-6 py-10 lg:w-1/2">
              <h3 className="flex items-center gap-3 text-3xl font-semibold">
                <span>🗃</span>
                Assets Provided
              </h3>
              <div className="mt-6">
                <p>{task.assets}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default SinglePageTask;
