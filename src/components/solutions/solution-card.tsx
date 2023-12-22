import {type Solution} from "@prisma/client"

type SolutionProps = {
    solution: Solution;
}



const SolutionCard = ({solution}) =>{
    return(
        <h1>Hello SolutionCard</h1>
    )
}
export default SolutionCard;