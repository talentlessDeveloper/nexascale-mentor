import React from 'react'
import Image from 'next/image' 
import {type SolutionProps} from "~/lib/types"
import {useState, useEffect} from "react"
import dayjs , {type Dayjs} from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
import PageTitle from "../shared/page-title";
import {Button} from "../ui/Button"

const SinglePageSolution:React.FC<{ solution:SolutionProps}> = ({solution}) => {

  const {title, createdAt, liveSiteLink, githubLink} = solution

  const [relativeTimer, setRelativeTimer] = useState<Dayjs | null>(null);
  
  useEffect(() => {
    dayjs.extend(relativeTime); 
    
    const interval = setInterval(() => {
      const createdDate = createdAt
      const submittedTime = dayjs(createdDate).fromNow();
      setRelativeTimer(submittedTime);  
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  }, [setRelativeTimer, createdAt]);
  
  return ( 
    <div className="py-28 font-inter">
      <PageTitle  title="solution"/>
        <div className=" relative">
          <section className="mt-10 relative">
            <Image  
            src="/images/bg-solution.png"
            alt="A background picture"
            sizes="100vw"
               style={{
                 width: "100%",
                 height: "auto",
                 maxHeight: "410px",
                }}
                width={559}
                height={409}
                className="object-cover"   
                priority
            />
            <div className="absolute top-0 bottom-0 w-full h-full bg-black opacity-70"></div>
            <div className="absolute inset-0 flex flex-col items-center top-10 max-w-[50rem] mx-auto">
              <p className="font-inter text-base">Submitted {relativeTimer}</p>
              <h1 className="text-5xl font-semibold text-accent capitalize my-8 text-center leading-tight">{title}</h1>
              <div className="flex items-center gap-20">
                <Button
                className="rounded-full bg-accent/90 p-8 text-accent-foreground hover:bg-accent 
                uppercase  font-medium text-lg"
                onClick={() => window.open(liveSiteLink, "_blank")}
                >
                  preview site
                </Button> 
                <Button
                className="flex gap-2  rounded-full bg-white p-8 text-primary-foreground hover:bg-accent 
                uppercase text-lg font-medium"
                onClick={() => window.open(githubLink, "_blank")}
                >
                  View Code
                </Button> 
              </div>
            </div>
          </section>
        </div>
    </div>
  )
}

export default SinglePageSolution
