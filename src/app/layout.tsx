import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lane Guard",
  description: "ANPR Based Traffic Regulating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
    <head>
      <link rel="icon" href="/favicon.png" sizes="any" />
    </head>
      <body className={inter.className}>
        <div className="flex h-screen w-screen">
            <Sidebar/>
            <div className="">
            {children}
            </div>
            <ToastContainer/>
        </div>
      </body>
    </html>
  );
}
