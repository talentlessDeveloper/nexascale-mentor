"use client"
import {useState} from "react"
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "../themes/toggle-theme";



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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 
                    24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" 
                    stroke-linejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/>
                </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" 
                    className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/>
                    </svg>

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
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" 
              y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
      </nav>
      {/* Mobile Navigation */}
      {mobile && (
        <div className="absolute w-full flex flex-col gap-10 bg-primary-foreground left-0 px-6 py-10 text-xl md:hidden">
          <Link href="" className="hover:after-content">Challenges</Link>
          <Link href="">Solutions</Link>
          <Link href="" className="flex gap-4 items-center">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/>
             <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg></span>
            Resources</Link>
          {isLoggedin ?
          (
            <>
              <div className="w-[50px] h-[50px] rounded-full bg-white"></div>
                  <div className="ml-10 flex flex-col gap-6">
                    <Link href={"/dashboard"} className="flex gap-4 items-center">
                      <span><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" 
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                      stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline 
                        points="9 22 9 12 15 12 15 22"/></svg></span>
                      Dashboard</Link>
                    <Link href={"/profile"} className="flex gap-4 items-center">
                      <span><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" 
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide 
                      lucide-user-2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg></span>
                      Profile</Link>
                    <Link href={"/sgn-out"} className="flex gap-4 items-center">
                      <span><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 
                      21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
                      </svg></span>
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
