import { type GetStaticProps, type NextPage } from "next";
import SinglePageTask from "~/components/tasks/single-page-task";
import { generateSSHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const Challenge: NextPage<{ slug: string }> = ({ slug }) => {
  const { data } = api.task.getById.useQuery({ taskId: slug });

  if (!data) {
    return (
      <div className="py-28 text-center">
        <p className="lg:text-5xl">404</p>
      </div>
    );
  }

  return (
    <>
      <SinglePageTask task={data} />
    </>
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
