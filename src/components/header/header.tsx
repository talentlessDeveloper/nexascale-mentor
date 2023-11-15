import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "../themes/toggle-theme";

const Header = () => {
  return (
    <header>
      <nav className="container flex items-center justify-between py-4">
        <div>
          <Link href="/">
            <Image
              src="/images/nexascale-logo.png"
              alt="Nexascale logo"
              width={123}
              height={30}
              className="dark:text-white dark:mix-blend-screen"
            />
          </Link>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
