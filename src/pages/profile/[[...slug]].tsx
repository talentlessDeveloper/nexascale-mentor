import { type GetStaticProps, type NextPage } from "next";
import { useRouter } from "next/router";
import OverView from "~/components/profile/overview";
import PageTitle from "~/components/shared/page-title";
import SolutionCard from "~/components/solutions/solution-card";
import { generateSSHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const Profile: NextPage<{ slug: string }> = ({ slug }) => {
  console.log("client slug ==>", slug);
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
      <PageTitle
        title="Profile"
        links={[
          { title: "Overview", href: `/profile/${slug}` },
          { title: "Solutions", href: `/profile/${slug}/solutions` },
          // { title: "My Challange", href: `/profile/${slug}/challenges` },
        ]}
      />
      {router.asPath === `/profile/${slug}` ? (
        <OverView userData={userData} solutionContent={solutionContent} />
      ) : router.asPath === `/profile/${slug}/solutions` ? (
        <div className="container py-12">
          <div className="grid grid-cols-1 gap-5 pt-10 md:grid-cols-2 lg:grid-cols-3">
            {solutionContent}
          </div>
        </div>
      ) : router.asPath === `/profile/${slug}/challenges` ? (
        <div className="py-28">This is Challenges</div>
      ) : (
        <div className="py-28">Page Does not exist</div>
      )}
    </section>
  );
};

export default Profile;

export const getStaticProps: GetStaticProps = async (context) => {
  let slug = context.params?.slug;

  if (typeof slug === "object") {
    slug = slug[0];
  }

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
