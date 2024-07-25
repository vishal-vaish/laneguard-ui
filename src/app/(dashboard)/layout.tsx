import React from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({children}) => {
  return (
    <main>
      <div className="w-[calc(100vw-15rem)]">
        <Navbar/>
        {children}
      </div>
        <Footer/>
    </main>
  );
};

export default Layout;
