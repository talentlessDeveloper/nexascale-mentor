import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";

type PageTitleProps = {
  title: string;
  links?: Array<{ title: string; href: string }>;
};

const PageTitle = ({ title, links }: PageTitleProps) => {
  const router = useRouter();

  return (
    <>
      <div className="border-y border-solid border-primary/50">
        <div className="container flex items-center justify-between gap-3">
          <div className="border-x-primborder-primary/50  flex h-full w-36 items-center justify-center border-x border-solid px-2 py-2 lg:py-3">
            <h1 className="border-primary text-sm font-bold uppercase text-primary lg:text-lg">
              {title}
            </h1>
          </div>
          {links ? (
            <ul className="flex items-center gap-5 text-xs lg:w-1/2 lg:px-36 lg:text-base">
              {links.map((l) => (
                <li
                  key={`${l.href}`}
                  className={cn(
                    "relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:scale-0 after:bg-accent after:transition-transform after:duration-500 hover:after:scale-100",
                    {
                      "after:scale-100": router.asPath === l.href,
                    },
                  )}
                >
                  <Link
                    href={l.href}
                    className="whitespace-nowrap font-semibold uppercase italic"
                  >
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default PageTitle;
