// import { type SolutionProps } from "~/lib/types";
import React, {useEffect, useState} from 'react'
import {useRouter} from "next/router"
import SinglePageSolution from "~/components/solutions/single-page-solution"
import { solutions } from "~/lib/solutions"


const Solution = () => {
  const [solution, setSolution] = useState()

  const  router = useRouter()
  const slug = router.query.slug

  useEffect(() => {
    const solution = solutions.find((sol) => sol.title.replace(/\s+/g, '-').toLowerCase() === slug)
    setSolution(solution)
  }, [slug])


  if(!solution){
     return <h1>404 page not found</h1>
  }

  return (
    <div>
        <SinglePageSolution  solution={solution}/>
    </div>
  )
}


// export const getStaticPaths: GetStaticPaths = () => {
//   // Generate paths for all solutions
//   const paths = solutions.map((solution) => ({
//     params: { slug: `${solution.title.replace(/\s+/g, '-').toLowerCase()}-${solution.id}` },
//   }));

//   return { paths, fallback: 'blocking' };
// };
 

// export const getStaticProps: GetStaticProps<{ slug: string}> = (context) => {
//   const slug = context.params?.slug;
//  console.log("==========>", context)
//   if (typeof slug !== 'string') {
//     throw new Error('No slug');
//   }
//   console.log("Slug:", slug);
//   console.log("Solutions:", solutions);
  
  
// const solution = solutions.find((sol) => `${sol.title.replace(/\s+/g, '-').toLowerCase()}-${sol.id}` === slug);


//   if (!solution) {
//     return { notFound: true };
//   }

//   return {
//     props: {
//       slug,
//       solution,
//     },
//   };
// };
export default Solution



