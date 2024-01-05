export type FolderName =
  | "nexascale-frontend-mentor-tasks"
  | "nexascale-frontend-mentor-solutions";

  export type SolutionProps = {
      id: string,
      title: string,
      githubLink: string,
      liveSiteLink: string,
      description: string
      tags: string,
      screenshot: string,
      taskId: string,
      userId: string,
      createdAt:Date,
      updatedAt: Date
  }
