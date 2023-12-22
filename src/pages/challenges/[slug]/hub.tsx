import { CldImage } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import PageTitle from "~/components/shared/page-title";
import { api } from "~/utils/api";

const Hub = () => {
  const router = useRouter();
  const slug = router.query.slug;

  const { data: task, isLoading } = api.task.getById.useQuery({
    taskId: slug as string,
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

  return (
    <section className="py-28">
      <PageTitle title="Hub" />
      <div className="relative  h-80  lg:h-96">
        <div className="relative z-[2] flex h-full w-full flex-col items-center justify-center gap-5 bg-black/80">
          <h2 className="text-2xl font-semibold text-white lg:text-3xl">
            Challenge Hub
          </h2>
          <h3 className="text-2xl font-semibold text-white lg:text-4xl">
            {task?.title}
          </h3>
        </div>
        {task?.image.includes("cloudinary") ? (
          <CldImage
            src={task.image}
            alt={task.title}
            fill
            sizes="100vw"
            className="h-full w-full rounded-none rounded-tl-lg rounded-tr-lg object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          task?.image && (
            <Image
              fill
              src={task.image}
              alt={task.title}
              sizes="100vw"
              className="h-full w-full rounded-none rounded-tl-lg rounded-tr-lg object-cover transition-transform duration-300 hover:scale-105"
            />
          )
        )}
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
