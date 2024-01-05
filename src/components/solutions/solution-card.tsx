import { type SolutionProps } from "~/lib/types";
import {useState, useEffect} from "react"
import dayjs , {type Dayjs} from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from 'next/image'
import Link from 'next/link'


const SolutionCard: React.FC<{solution:SolutionProps}> = ({solution}) =>{

  const [relativeTimer, setRelativeTimer] = useState<Dayjs | null>(null);
  
  useEffect(() => {
    dayjs.extend(relativeTime);
    
    const interval = setInterval(() => {
      const createdDate = solution.createdAt
      const submittedTime = dayjs(createdDate).fromNow();
      setRelativeTimer(submittedTime);  
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  }, [setRelativeTimer, solution.createdAt]);
  
  

    return(
        <div className="overflow-hidden rounded-tl-lg rounded-tr-lg shadow-lg shadow-black/10 dark:shadow-white/10">
          <div className="relative h-80 lg:h-96 ">
            <Link href={`/solutions/${solution.title.replace(/\s+/g, '-').toLowerCase()}`}>
                <Image
                  fill
                  src={solution.screenshot }
                  alt={solution.title}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="h-full w-full rounded-none rounded-tl-lg rounded-tr-lg object-cover transition-transform duration-300 hover:scale-105"
                />
            </Link>
          </div>
          <div className="flex flex-col gap-5 p-6">
            <p>Submitted {relativeTimer }</p>
            <Link href={`/solutions/${solution.title.replace(/\s+/g, '-').toLowerCase()}`}>
              <h2 className="divide-y-2 divide-accent text-2xl font-semibold text-accent capitalize ">{solution.title}</h2>
            </Link>
            <h1 className="divide-y-2 divide-accent">{solution.tags}</h1>
            <div>
              <p>{solution.description}</p>
            </div>
          </div>
        </div>
    )
}
export default SolutionCard;