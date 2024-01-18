import React from "react";
import { Button } from "../ui/button";
import { GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";

const LoggedInModal = () => {
  return (
    <>
      <p className="text-2xl font-semibold">Oops! 😬</p>
      <p className="text-lg">
        You need to be logged in before you can do that.
      </p>
      <Button
        className="flex gap-2  rounded-full bg-accent/90 p-8 text-accent-foreground hover:bg-accent"
        onClick={() => {
          void signIn("github", {
            callbackUrl: "/profile",
          });
        }}
      >
        <span className="font-semibold uppercase italic">
          Log in with Github
        </span>{" "}
        <span>
          <GithubIcon />
        </span>
      </Button>
    </>
  );
};

export default LoggedInModal;
