import React, { type ReactNode } from "react";
import Header from "./header/header";
import { ThemeProvider } from "./themes/theme-provider";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Header />
      <main>{children}</main>
    </ThemeProvider>
  );
};

export default Layout;
