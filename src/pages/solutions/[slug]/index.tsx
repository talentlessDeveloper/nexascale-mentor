import { type GetStaticProps, type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import ModalLayout from "~/components/modals/modal-layout";
import PageTitle from "~/components/shared/page-title";
import SinglePageHero from "~/components/shared/single-page-hero";
import { Button } from "~/components/ui/button";
import { generateSSHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const Solution: NextPage<{ slug: string }> = ({ slug }) => {
  const [openDeleteSolution, setOpenDeleteSolution] = useState(false);
  const router = useRouter();
  const { data: sessionData } = useSession();

  const {
    data: solutionData,
    isLoading,
    error,
  } = api.solution.getById.useQuery({
    solutionId: slug,
  });
  const ctx = api.useUtils();
  const username = solutionData?.username;
  const { isLoading: isDeleting, mutate } = api.solution.delete.useMutation({
    onSuccess: () => {
      void ctx.solution.invalidate();
      void ctx.solution.getByUserName.invalidate({ username: username! });
      setOpenDeleteSolution(false);
      const screenshotUrl = solutionData?.screenshot.match(
        /\/([^/]+)\.[a-zA-Z0-9]+$/,
      );
      const body = {
        folderName: "nexascale-frontend-mentor-solutions",
        imagePublicId: screenshotUrl ? screenshotUrl[1] : null,
      };

      fetch("/api/deleteImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => {
          console.log("Image deleted", res);
        })
        .catch((err) => {
          console.error(err, "errror deleting image");
        });
      void router.push(`/profile/${username}`);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to delete solution! Please try again later.");
      }
    },
  });

  if (!slug) {
    return (
      <div className="py-28 text-center">
        <p className="lg:text-5xl">404</p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="py-28 text-center">
        <p className="lg:text-5xl">Hmmm Something went wrong</p>
      </div>
    );
  }

  const deleteSolution = () => {
    if (isDeleting || !solutionData?.id || !sessionData?.user.id) {
      return;
    }

    mutate({
      solutionId: solutionData.id,
      userId: sessionData?.user.id,
      userTaskId: solutionData.userTaskId!,
    });
  };

  return (
    <section className="py-28">
      <ModalLayout
        openModal={openDeleteSolution}
        setOpenModal={setOpenDeleteSolution}
      >
        <>
          <h3 className="text-3xl font-semibold">
            Are you sure you want to do this?
          </h3>
          <p className="text-center ">
            This will permanently delete your solution and remove any awarded
            points for submitting this solution from your Mentor Score.
          </p>
          <Button
            className="rounded-lg bg-red-500 text-white hover:bg-red-800"
            onClick={deleteSolution}
          >
            {isDeleting ? "Deleting Solution..." : "Delete Solution"}
          </Button>
        </>
      </ModalLayout>
      <PageTitle title="Solution" />
      {solutionData ? (
        <SinglePageHero
          prop={solutionData}
          setOpenModal={setOpenDeleteSolution}
          type="solution"
        />
      ) : null}
      <div></div>

      {/* <div className="relative flex flex-col items-center justify-center gap-7 rounded-2xl bg-primary-foreground py-10">
        <p>{solutionData.description}</p>
      </div> */}
    </section>
  );
};

export default Solution;

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug;
  console.log("==================================>", context);

  const ssh = generateSSHelper();

  if (typeof slug !== "string") throw new Error("no slug");

  await ssh.task.getById.prefetch({ taskId: slug });

  return {
    props: {
      trpcState: ssh.dehydrate(),
      slug,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
