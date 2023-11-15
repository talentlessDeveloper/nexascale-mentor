import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>NexaScale Frontend Mentor</title>
        <meta name="description" content="NexaSale Frontend Mentor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" flex min-h-screen flex-col items-center justify-center ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center ">
          <h1 className="max-w-3xl text-center text-5xl font-extrabold tracking-tight  sm:text-[5rem]">
            Welcome to <span className="text-accent">Nexascale</span>{" "}
            <span className="text-primary">Frontend Mentor</span>
          </h1>
          <p className="">Lorem ipsum dolor sit amet.</p>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-accent-foreground">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </div>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-accent px-10 py-3 font-semibold text-accent-foreground no-underline transition hover:bg-accent/80"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
