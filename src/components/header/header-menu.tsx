import Link from "next/link";
import {
  Code,
  Github,
  Globe,
  Home,
  LogOut,
  TabletSmartphone,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

type HeaderMenuProps = {
  isLoggedIn: boolean;
};

const HeaderMenu = ({ isLoggedIn }: HeaderMenuProps) => {
  return (
    <div
      className="absolute left-0 flex w-full flex-col gap-10 divide-y 
         divide-accent bg-primary-foreground p-6 text-xl uppercase italic lg:hidden
         "
    >
      <Link href="/challenges" className="flex items-center gap-4">
        <span>
          <TabletSmartphone size={30} />
        </span>
        Challenges
      </Link>
      <Link href="/solutions" className="flex items-center gap-4 pt-4">
        <span>
          <Code size={30} />
        </span>
        Solutions
      </Link>
      <Link href="/resources" className="flex items-center gap-4 pt-4">
        <span>
          <Globe size={30} />
        </span>
        Resources
      </Link>
      {isLoggedIn ? (
        <>
          <div className="pt-4">
            <Image
              src="https://plus.unsplash.com/premium_photo-1675626492183-865d6d8e2e8a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHVzZXJ8ZW58MHx8MHx8fDA%3D"
              width={48}
              height={48}
              alt="avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
          <div className="ml-10 flex flex-col gap-6 divide-y divide-accent">
            <Link href={"/dashboard"} className="flex items-center gap-4 pt-4">
              <span>
                <Home size={30} />
              </span>
              Dashboard
            </Link>
            <Link href={"/profile"} className="flex items-center gap-4 pt-4">
              <span>
                <User size={30} />
              </span>
              Profile
            </Link>
            <Link href="" className="flex items-center gap-4 pt-4">
              <span>
                <LogOut className="text-red-500" size={30} />
              </span>
              Logout
            </Link>
          </div>
        </>
      ) : (
        <Button className="flex gap-2  rounded-full bg-accent/90 p-8 text-accent-foreground hover:bg-accent">
          <span className="font-semibold uppercase italic">
            Log in with Github
          </span>{" "}
          <span>
            <Github />
          </span>
        </Button>
      )}
    </div>
  );
};

export default HeaderMenu;
