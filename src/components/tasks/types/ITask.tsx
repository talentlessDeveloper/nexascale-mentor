import { type RouterOutputs } from "~/utils/api";

export type Task = RouterOutputs["task"]["getAll"][number];
export type Solution = RouterOutputs["solution"]["getAll"][number];
