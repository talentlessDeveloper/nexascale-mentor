import { GithubIcon } from "lucide-react";
import { type GetStaticProps, type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import PageTitle from "~/components/shared/page-title";
import SolutionCard from "~/components/solutions/solution-card";
import { generateSSHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const Profile: NextPage<{ slug: string }> = ({ slug }) => {
  const router = useRouter();
  const pathname = router.pathname;
  const { data: userData } = api.user.getByUsername.useQuery({
    username: slug,
  });

  const { data: solutionsData } = api.solution.getByUserName.useQuery({
    username: slug,
  });

  let solutionContent;

  if (!userData) {
    return (
      <div className="py-28 text-center">
        <p className="lg:text-5xl">404</p>
      </div>
    );
  }

  if (!solutionsData) {
    solutionContent = (
      <p className="text-center text-xl">Hmm something went wrong </p>
    );
  } else if (solutionsData?.length === 0) {
    console.log(solutionsData.length, "length");
    solutionContent = <p className="text-center text-xl">No Solutions Yet </p>;
  } else {
    solutionContent = solutionsData.map((solution) => (
      <SolutionCard key={solution.id} solution={solution} pathname={pathname} />
    ));
  }

  return (
    <section className="py-28">
      <PageTitle title="Profile" />
      <div className="container py-12">
        <section className="flex flex-col justify-between gap-8 lg:flex-row">
          <div className="flex flex-col items-center gap-3 lg:flex-row lg:gap-6">
            <div className="flex items-center justify-center">
              <Image
                src={userData.image!}
                alt={userData.username!}
                width={150}
                height={150}
                className="h-[8.5rem] w-[8.5rem] rounded-full lg:h-[9.5rem] lg:w-[9.5rem]"
              />
            </div>
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <div className="flex flex-col items-center gap-2 lg:items-start">
                <p className="text-3xl font-semibold">{userData.username}</p>
                <small className="text-sm">@{userData.username}</small>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold lg:text-6xl">
                  {userData.points}
                </span>
                <span className="text-sm">points</span>
              </div>
              <a href={`https://github.com/${userData.username}`}>
                <span className="sr-only">
                  Github Link for ${userData.username}
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <GithubIcon />
                </span>
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-start">
            <p className=" max-w-[50ch] text-center lg:text-left">
              I&apos;m a mysterious individual who has yet to fill out my bio.
              One thing&apos;s for certain: I love writing front-end code!
            </p>
          </div>
        </section>
      </div>
      <section className="bg-secondary py-8">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Latest Solutions</h2>
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {solutionContent}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Profile;

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug;

  const ssh = generateSSHelper();
  if (typeof slug !== "string") throw new Error("No profile Slug");

  await ssh.user.getByUsername.prefetch({ username: slug });

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
