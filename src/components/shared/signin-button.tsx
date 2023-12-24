import React, { useState } from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { Github, Loader2 } from "lucide-react";
import { useRouter } from "next/router";

const SignInBtn = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <Button
      className="flex gap-2  rounded-full bg-accent/90 p-8 text-accent-foreground hover:bg-accent"
      onClick={async () => {
        if (loading) {
          return;
        }
        setLoading(true);
        await signIn("github", {
          callbackUrl: "/profile",
        });
        // if (login && login?.ok) {
        //   void router.push(login.url);
        //   setLoading(false);
        // }

        setLoading(false);
      }}
    >
      <span className="font-semibold uppercase italic">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Log In With Github"
        )}
      </span>{" "}
      <span>
        <Github />
      </span>
    </Button>
  );
};

export default SignInBtn;
