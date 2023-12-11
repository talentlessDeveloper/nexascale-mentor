import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/router";
import PageTitle from "~/components/shared/page-title";
import { api } from "~/utils/api";

const Hub = () => {
  const router = useRouter();
  const slug = router.query.slug;
  console.log(slug);
  const { data, isLoading } = api.task.getById.useQuery({
    taskId: slug as string,
  });

  if (isLoading) {
    return (
      <div className="container py-28">
        <p className="text-center text-2xl">Loading...</p>
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
            {data?.title}
          </h3>
        </div>
        {data?.image.includes("cloudinary") ? (
          <CldImage
            src={data.image}
            alt={data.title}
            fill
            sizes="100vw"
            className="h-full w-full rounded-none rounded-tl-lg rounded-tr-lg object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          data?.image && (
            <Image
              fill
              src={data.image}
              alt={data.title}
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
          <a href={data?.assets} target="_blank" className="text-accent">
            here
          </a>{" "}
        </p>
      </div>
    </section>
  );
};

export default Hub;
