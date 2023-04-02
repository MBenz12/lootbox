import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <>
      <Header />
      <main className={"min-h-screen"}>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;