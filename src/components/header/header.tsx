"use client"
import {useState} from "react"
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "../themes/toggle-theme";
import { ChevronUp,ChevronDown,X ,Menu, Home, User, LogOut, Globe, Code, TabletSmartphone} from 'lucide-react';



const Header = () => {
  const isLoggedin = true
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [mobile, setMobile] = useState<boolean>(false)

  const toggleDropdown = () => {
    setDropdown(!dropdown)
  }

  const menuToggle = () =>{
    setMobile(!mobile)
  }
  return (
    <header className="md:container fixed 
    right-0 left-0 bg-primary-foreground max-md:px-6">

      {/* Desktop vew */}
      <nav className="flex items-center justify-between py-5 ">
          <Link href="/">
            <Image
              src="/images/nexascale-logo.png"
              alt="Nexascale logo"
              width={123}
              height={30}
              className="dark:text-white dark:mix-blend-screen"
            />
          </Link>
        <div className=" flex items-center justify-center max-md:hidden text-lg font-semibold gap-5">
          <Link href="" className="hover:after-content">Challenges</Link>
          <Link href="">Solutions</Link>
          <Link href="">Resources</Link>
          {isLoggedin ?
          (
            <>
              <div className="w-[50px] h-[50px] rounded-full bg-white"></div>
              {dropdown && (
                <div className="absolute top-24 flex flex-col gap-4 rounded-md  right-24 px-7 py-5 shadow-lg bg-primary-foreground ">
                  <Link href={"/dashboard"}>Dashboard</Link>
                  <Link href={"/profile"}>Profile</Link>
                  <Link href={"/sgn-out"}>Logout</Link>
                </div>
              )}
              <button onClick={toggleDropdown}>
              {dropdown ? (
                 <ChevronUp />
                ) : (
                  <ChevronDown />
                )
              }
              </button>
            </> 
          ) :
          (
            <button className="bg-accent/90 px-4 py-2 text-accent-foreground rounded-full hover:bg-accent">
            Log in with Github
            </button>
            )
          }
          <ThemeToggle />
        </div>
        <button onClick={menuToggle} className="md:hidden">
            {mobile ? (
                <X size={40}/>
            ) : (
              <Menu size={40}/>
            )}
          </button>
      </nav>
      {/* Mobile Navigation */}
      {mobile && (
        <div className="absolute w-full flex flex-col gap-10 bg-primary-foreground left-0 p-6 text-xl md:hidden">
          <Link href="" className="flex gap-4 items-center">
            <span><TabletSmartphone size={30}/></span>
            Challenges</Link>
          <Link href="" className="flex gap-4 items-center">
            <span>< Code size={30}/></span>
            Solutions</Link>
          <Link href="" className="flex gap-4 items-center">
            <span><Globe size={30}/></span>
            Resources</Link>
          {isLoggedin ?
          (
            <>
              <div className="w-[50px] h-[50px] rounded-full bg-white"></div>
                  <div className="ml-10 flex flex-col gap-6">
                    <Link href={"/dashboard"} className="flex gap-4 items-center">
                      <span><Home size={30}/></span>
                      Dashboard</Link>
                    <Link href={"/profile"} className="flex gap-4 items-center">
                      <span><User size={30}/></span>
                      Profile</Link>
                    <Link href={"/sgn-out"} className="flex gap-4 items-center">
                      <span>
                        <LogOut size={30} />
                        </span>
                      Logout</Link>
                  </div>
            </> 
          ) :
          (
            <button className="bg-accent/90 px-4 py-2 text-accent-foreground rounded-full hover:bg-accent">
            Log in with Github
            </button>
            )
          }
        </div>
      )}
    </header>
  );
};

export default Header;
