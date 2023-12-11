import React, { type SetStateAction, useRef } from "react";
import Portal from "../shared/portal";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { Github, X } from "lucide-react";

type LoggedInProps = {
  openLoggedInModal: boolean;
  setOpenLoggedInModal: React.Dispatch<SetStateAction<boolean>>;
};

const LoggedInModal = ({
  openLoggedInModal,
  setOpenLoggedInModal,
}: LoggedInProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const pageClickedElement = e.target as Node;
    if (!modalRef.current?.contains(pageClickedElement)) {
      setOpenLoggedInModal(false);
    }
  };

  if (!openLoggedInModal) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        onClick={handlePageClick}
      >
        <Button className="absolute right-10 top-5 bg-primary-foreground hover:bg-primary-foreground/80">
          <X
            className="text-primary"
            onClick={() => setOpenLoggedInModal(false)}
          />
        </Button>
        <div
          className="flex w-[95%] max-w-lg flex-col items-center justify-center gap-7 rounded-2xl bg-primary-foreground p-6"
          ref={modalRef}
        >
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
              <Github />
            </span>
          </Button>
        </div>
      </div>
    </Portal>
  );
};

export default LoggedInModal;
