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
import { signIn } from "next-auth/react";

type HeaderMenuProps = {
  isLoggedIn: boolean;
};

const HeaderMenu = ({ isLoggedIn }: HeaderMenuProps) => {
  return (
    <ul
      className="t absolute left-0 flex w-full flex-col gap-5 
         divide-y divide-accent bg-primary-foreground p-6 text-sm uppercase italic lg:hidden
         "
    >
      <li>
        <Link href="/challenges" className="flex items-center gap-4">
          <span>
            <TabletSmartphone size={20} />
          </span>
          Challenges
        </Link>
      </li>
      <li>
        <Link href="/solutions" className="flex items-center gap-4 pt-4">
          <span>
            <Code size={20} />
          </span>
          Solutions
        </Link>
      </li>
      <li>
        <Link href="/resources" className="flex items-center gap-4 pt-4">
          <span>
            <Globe size={20} />
          </span>
          Resources
        </Link>
      </li>
      {isLoggedIn ? (
        <>
          <li className="pt-4">
            <Image
              src="https://plus.unsplash.com/premium_photo-1675626492183-865d6d8e2e8a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHVzZXJ8ZW58MHx8MHx8fDA%3D"
              width={48}
              height={48}
              alt="avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
          </li>
          <div className="ml-10 flex flex-col gap-6 divide-y divide-accent">
            <li>
              <Link
                href={"/dashboard"}
                className="flex items-center gap-4 pt-4"
              >
                <span>
                  <Home size={20} />
                </span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href={"/profile"} className="flex items-center gap-4 pt-4">
                <span>
                  <User size={20} />
                </span>
                Profile
              </Link>
            </li>
            <li>
              <Link href="" className="flex items-center gap-4 pt-4">
                <span>
                  <LogOut className="text-red-500" size={20} />
                </span>
                Logout
              </Link>
            </li>
          </div>
        </>
      ) : (
        <Button
          className="flex gap-2  rounded-full bg-accent/90 p-8 text-accent-foreground hover:bg-accent"
          onClick={() => signIn("github")}
        >
          <span className="font-semibold uppercase italic">
            Log in with Github
          </span>{" "}
          <span>
            <Github />
          </span>
        </Button>
      )}
    </ul>
  );
};

export default HeaderMenu;
