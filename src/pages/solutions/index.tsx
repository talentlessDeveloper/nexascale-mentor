import React from 'react'
import { solutions } from "~/lib/solutions"
import SolutionCard from '~/components/solutions/solution-card'

const index = () => {

  const result = solutions.map(solution => {
    return <SolutionCard key= {solution.id} solution={solution}/> 
  })

  return (
    <section className="py-28">
      <div className="border-y border-solid border-primary/50">
        <div className="container flex justify-between">
          <div className="border-x-primborder-primary/50  flex h-full w-36 items-center justify-center border-x border-solid px-2 py-3">
            <h1 className="border-primary text-lg font-bold uppercase text-primary">
              Solutions
            </h1>
          </div>
        </div>
      </div>
      <div className="container pt-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {result}
        </div>
      </div>
    </section>
  )
}

export default index
