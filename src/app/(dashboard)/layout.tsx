import React from 'react';
import Navbar from "@/components/Navbar/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  return (
    <main className="w-[calc(100vw-15rem)]">
      <Navbar/>
        {children}
    </main>
  );
};

export default Layout;
