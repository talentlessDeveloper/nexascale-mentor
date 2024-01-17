import { MoreVerticalIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import ModalLayout from "~/components/modals/modal-layout";
import PageTitle from "~/components/shared/page-title";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const Hub = () => {
  const router = useRouter();
  const slug = router.query.slug;

  const { data: sessionData } = useSession();

  const [openRemoveChallenge, setOpenRemoveChallenge] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const { data: task, isLoading } = api.task.getById.useQuery({
    taskId: slug as string,
  });
  const ctx = api.useUtils();
  const { data: userTask } = api.userTask.getById.useQuery({
    taskId: slug as string,
  });
  const { isLoading: isRemoving, mutate } = api.userTask.delete.useMutation({
    onSuccess: () => {
      void ctx.userTask.hasStarted.invalidate({
        taskId: slug as string,
      });
      toast.success("Challenge removed successfully");
      router.back();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to remove challenge! Please try again later.");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="container py-28">
        <p className="text-center text-2xl">Loading...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="py-28 text-center">
        <p className="lg:text-5xl">404</p>
      </div>
    );
  }

  const removeChallenge = () => {
    if (userTask?.id && sessionData?.user.id) {
      mutate({
        taskId: slug as string,
        userTaskId: userTask.id,
        userId: sessionData?.user.id,
      });
      return;
    }
    toast.error("You are not Authorized");
  };

  return (
    <section className="py-28">
      <ModalLayout
        openModal={openRemoveChallenge}
        setOpenModal={setOpenRemoveChallenge}
      >
        <>
          <h3 className="text-3xl font-semibold">
            Are you sure you want to do this?
          </h3>
          <p className="text-center ">
            This will remove this challenge from my challenges. You’ll need to
            restart the challenge to access this Challenge Hub again.
          </p>
          <Button
            className="rounded-lg bg-red-500 text-white hover:bg-red-800"
            onClick={removeChallenge}
          >
            {isRemoving ? "Removing Challenge..." : "Remove Challenge"}
          </Button>
        </>
      </ModalLayout>
      <PageTitle title="Hub" />
      <div className="relative  h-80  lg:h-96">
        <div className="relative z-[2] flex h-full w-full flex-col items-center justify-center gap-5 bg-black/80">
          <Button
            className="absolute right-7 top-7 h-12 w-12 rounded-full"
            onClick={() => setShowOptions((prev) => !prev)}
          >
            <MoreVerticalIcon />
          </Button>
          {showOptions ? (
            <ul className="absolute right-9 top-20 divide-y rounded-md bg-white px-5">
              <li className="py-3">
                <Link href={`/challenges/${slug as string}`}>
                  Visit Challenge Page
                </Link>
              </li>
              <li className="py-3">
                <button
                  className="p-0 font-normal text-red-500"
                  onClick={() => setOpenRemoveChallenge(true)}
                >
                  Remove From My Challenges
                </button>
              </li>
            </ul>
          ) : null}

          <h2 className="text-2xl font-semibold text-white lg:text-3xl">
            Challenge Hub
          </h2>

          <h3 className="text-2xl font-semibold text-white lg:text-4xl">
            {task?.title}
          </h3>
        </div>

        <CldImage
          src={task.image}
          alt={task.title}
          fill
          sizes="100vw"
          className="h-full w-full rounded-none rounded-tl-lg rounded-tr-lg object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="container mt-5 space-y-3">
        <h3 className="text-2xl font-semibold">Assets</h3>
        <p>
          Figma Link is{" "}
          <a href={task?.assets} target="_blank" className="text-accent">
            here
          </a>{" "}
        </p>
        <div className="relative flex flex-col items-center justify-start gap-7 rounded-2xl bg-primary-foreground py-10">
          <h2 className="text-3xl font-semibold">Submit Your Solution</h2>
          <p>
            Once you’ve completed this challenge, click the button below and
            fill in the form to submit your solution.
          </p>

          <Link
            href={`/challenges/${task.id}/submit`}
            className="flex items-center justify-center rounded-md bg-orange-300 px-8 py-2 text-xl font-semibold uppercase italic text-black duration-300 hover:bg-orange-500"
          >
            Submit Solution
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hub;
