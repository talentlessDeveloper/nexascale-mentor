import {
  ChevronDown,
  ChevronUp,
  Github,
  Home,
  Loader2,
  LogOut,
  Menu,
  Pen,
  User,
  X,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "../themes/toggle-theme";
import { Button } from "../ui/button";
import HeaderMenu from "./header-menu";

const Header = () => {
  const { status, data: sessionData } = useSession();
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [mobile, setMobile] = useState<boolean>(false);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const menuToggle = () => {
    setMobile(!mobile);
  };

  const isLoggedin = status === "authenticated";
  console.log(sessionData);
  return (
    <header
      className="fixed left-0 
    right-0 z-[5] bg-primary-foreground font-inter"
    >
      {/* Desktop vew */}
      <nav className="container flex items-center justify-between py-5  max-lg:px-6">
        <Link href="/">
          <Image
            src="/images/nexascale-logo.png"
            alt="Nexascale logo"
            width={123}
            height={30}
            className="dark:text-white dark:mix-blend-screen"
          />
        </Link>
        <div className="flex items-center justify-center gap-4">
          <div className=" flex items-center justify-center gap-5 text-base font-semibold max-lg:hidden">
            <ul className=" flex items-center justify-center gap-5 uppercase italic  max-lg:hidden">
              <li className="relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:scale-0 after:bg-accent after:transition-transform after:duration-500 hover:after:scale-100">
                <Link href="/challenges">Challenges</Link>
              </li>
              <li className="relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:scale-0 after:bg-accent after:transition-transform after:duration-500 hover:after:scale-100">
                <Link href="/solutions">Solutions</Link>
              </li>
              <li className="relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:scale-0 after:bg-accent after:transition-transform after:duration-500 hover:after:scale-100">
                <Link href="/resources">Resources</Link>
              </li>
            </ul>
            {isLoggedin ? (
              <>
                <div>
                  <Image
                    src={
                      sessionData?.user.image
                        ? sessionData.user.image
                        : "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                    }
                    width={48}
                    height={48}
                    alt="avatar"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                {dropdown ? (
                  <ul className="absolute right-24 top-24 flex  flex-col  divide-y-2  rounded-lg bg-primary-foreground text-xs uppercase italic shadow-lg">
                    {sessionData?.user.role?.toLowerCase() === "admin" ? (
                      <li>
                        <Link
                          href="/create-task"
                          className="flex w-full items-center gap-1 p-3"
                        >
                          <span>
                            <Pen />
                          </span>
                          <span>Create Task</span>
                        </Link>
                      </li>
                    ) : null}
                    <li className="flex items-center gap-1 px-3 py-3">
                      <span>
                        <Home size={30} />
                      </span>
                      <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li className="flex items-center gap-1 px-3 py-3">
                      <span>
                        <User size={30} />
                      </span>
                      <Link href="/profile">Profile</Link>
                    </li>
                    <li className="px-3 py-3">
                      <Button
                        className="flex items-center gap-1 bg-transparent px-0 hover:bg-transparent"
                        onClick={() => {
                          void signOut({
                            callbackUrl: "/",
                          });
                        }}
                      >
                        <LogOut
                          className="text-red-500 hover:text-red-500/60"
                          size={30}
                        />
                        <span className="text-xs font-bold uppercase italic text-primary hover:text-primary/60">
                          Logout
                        </span>
                      </Button>
                    </li>
                  </ul>
                ) : null}
                <button onClick={toggleDropdown}>
                  {dropdown ? <ChevronUp /> : <ChevronDown />}
                </button>
              </>
            ) : (
              <Button
                className="flex gap-2  rounded-full bg-accent/90 p-8 text-accent-foreground hover:bg-accent"
                onClick={() => {
                  void signIn("github", {
                    callbackUrl: "/profile",
                  });
                }}
              >
                <span className="font-semibold uppercase italic">
                  {status === "loading" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Log in with Github"
                  )}
                </span>{" "}
                <span>
                  <Github />
                </span>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={menuToggle} className="lg:hidden">
              {mobile ? <X size={40} /> : <Menu size={40} />}
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Navigation */}
      {mobile && <HeaderMenu isLoggedIn={isLoggedin} />}
    </header>
  );
};

export default Header;
