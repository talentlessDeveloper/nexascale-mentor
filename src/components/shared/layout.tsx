import React, { type ReactNode } from "react";
import Header from "../header/header";
import { ThemeProvider } from "../themes/theme-provider";
import { Inter } from "next/font/google";
import { cn } from "~/lib/utils";

const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className={cn("flex flex-col", interFont.variable)}>
        <Header />
        <main className="flex-grow">{children}</main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
