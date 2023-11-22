import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "../themes/toggle-theme";
import {
  ChevronUp,
  ChevronDown,
  X,
  Menu,
  Home,
  User,
  LogOut,
  Globe,
  Code,
  TabletSmartphone,
  Github,
} from "lucide-react";
import { Button } from "../ui/button";

const Header = () => {
  const isLoggedin = true;
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [mobile, setMobile] = useState<boolean>(false);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const menuToggle = () => {
    setMobile(!mobile);
  };
  return (
    <header
      className="fixed left-0 
    right-0 bg-primary-foreground font-inter "
    >
      {/* Desktop vew */}
      <nav className="flex items-center justify-between py-5 container  max-lg:px-6">
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
                <Link href="/challenges" >
                  Challenges
                </Link>
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
                <div >
                  <Image src="https://plus.unsplash.com/premium_photo-1675626492183-865d6d8e2e8a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHVzZXJ8ZW58MHx8MHx8fDA%3D" width={48} height={48} alt="avatar" className="object-cover rounded-full w-12 h-12" />
                </div>
                {dropdown && (
                  <ul className="absolute right-24 top-24 flex  flex-col  divide-y-2  rounded-lg bg-primary-foreground text-xs uppercase italic shadow-lg">
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
                    <li className="flex items-center gap-1 px-3 py-3">
                      <span>
                        <LogOut className="text-red-500" size={30} />
                      </span>
                      <Link href="/sign-out">Logout</Link>
                    </li>
                  </ul>
                )}
                <button onClick={toggleDropdown}>
                  {dropdown ? <ChevronUp /> : <ChevronDown />}
                </button>
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={menuToggle} className="lg:hidden">
              {mobile ? <X size={40} /> : <Menu size={40} />}
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Navigation */}
      {mobile && (
        <div className="absolute left-0 flex w-full flex-col uppercase italic 
         gap-10 bg-primary-foreground divide-y divide-accent p-6 text-xl lg:hidden
         ">
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
          {isLoggedin ? (
            <>
              <div className="pt-4">
                  <Image src="https://plus.unsplash.com/premium_photo-1675626492183-865d6d8e2e8a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHVzZXJ8ZW58MHx8MHx8fDA%3D" width={48} height={48} alt="avatar" className="object-cover rounded-full w-12 h-12" />
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
      )}
    </header>
  );
};

export default Header;
