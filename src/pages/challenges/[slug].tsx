import { type GetStaticProps, type NextPage } from "next";
import { CldImage } from "next-cloudinary";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import PageTitle from "~/components/page-title";
import { Button } from "~/components/ui/button";
import { generateSSHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const MDPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false },
);

const Challenge: NextPage<{ slug: string }> = ({ slug }) => {
  const { data } = api.task.getById.useQuery({ taskId: slug });
  const params = useParams();
  console.log("client params ==>", {
    params,
    slug,
  });
  if (!data) {
    return (
      <div className="py-28 text-center">
        <p className="lg:text-5xl">404</p>
      </div>
    );
  }

  return (
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
              <h1 className="text-3xl font-bold">{data.title}</h1>
              <p>{data.description}</p>
              <Button className="h-auto max-w-[280px] rounded-xl bg-red-400 py-3 text-xl ">
                Start Challenge
              </Button>
            </div>
            <div className=" lg:w-1/2">
              {data.image.includes("cloudinary") ? (
                <CldImage
                  src={data.image}
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
                  src={data.image}
                  alt={data.title}
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
              <MDPreview source={data.brief} />
            </div>
          </div>
          <div className="rounded-2xl border border-solid border-border px-6 py-10 lg:w-1/2">
            <h3 className="flex items-center gap-3 text-3xl font-semibold">
              <span>🗃</span>
              Assets Provided
            </h3>
            <div className="mt-6">
              <p>{data.assets}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Challenge;

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
