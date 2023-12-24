import {
  Code,
  Globe,
  Home,
  LogOut,
  TabletSmartphone,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import SignInBtn from "../shared/signin-button";
import { Button } from "../ui/button";

type HeaderMenuProps = {
  isLoggedIn: boolean;
};

const HeaderMenu = ({ isLoggedIn }: HeaderMenuProps) => {
  const { data: sessionData } = useSession();
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
            <li className="pt-4">
              <Button
                className="flex items-center gap-4 bg-transparent px-0 hover:bg-transparent"
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
          </div>
        </>
      ) : (
        <SignInBtn />
      )}
    </ul>
  );
};

export default HeaderMenu;
