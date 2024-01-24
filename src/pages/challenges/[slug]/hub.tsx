import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import ModalLayout from "~/components/modals/modal-layout";
import PageTitle from "~/components/shared/page-title";
import SinglePageHero from "~/components/shared/single-page-hero";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const Hub = () => {
  const router = useRouter();
  const slug = router.query.slug;

  const { data: sessionData } = useSession();

  const [openRemoveChallenge, setOpenRemoveChallenge] = useState(false);

  const { data: task, isLoading } = api.task.getById.useQuery({
    taskId: slug as string,
  });
  const ctx = api.useUtils();
  const { data: userTask } = api.userTask.getById.useQuery({
    taskId: slug as string,
  });

  const userId = sessionData?.user.id;
  const { data: hasSubmittedData } = api.solution.hasSubmitted.useQuery(
    {
      taskId: slug as string,
      userId: userId!,
    },
    {
      enabled: !!userId!,
    },
  );

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
      <SinglePageHero
        prop={task}
        setOpenModal={setOpenRemoveChallenge}
        type="task"
      />
      <div className="container mt-5 space-y-3">
        <h3 className="text-2xl font-semibold">Assets</h3>
        <p>
          Figma Link is{" "}
          <a href={task?.assets} target="_blank" className="text-accent">
            here
          </a>{" "}
        </p>
        <div className="relative flex flex-col items-center justify-start gap-7 rounded-2xl bg-primary-foreground py-10">
          {hasSubmittedData ? (
            <p>You have Submitted this solution</p>
          ) : (
            <>
              {" "}
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hub;
