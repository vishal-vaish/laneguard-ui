"use client"

import { dashboardItems, tabs } from "@/lib/constant";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import classNames from "classnames";

const Sidebar = () => {
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState(tabs.DASHBOARD);

  useEffect(() => {
    const currentTab = dashboardItems.find(item => item.route === pathname);
    if (currentTab) {
      setSelectedTab(currentTab.name);
    }
  }, [pathname]);

  return (
    <div className="w-[15rem] p-2 bg-primary">
      <div className="text-3xl text-center w-full pt-5 text-white">
        Lane Guard
      </div>
      <hr className="mt-4" />
      <div className="mt-3">
        {dashboardItems.map((item) => (
          <Link
            key={item.name}
            href={item.route}
            className={classNames("p-4 text-white rounded-md flex gap-4", {
              "bg-[#1730a8]": selectedTab === item.name,
            })}>
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
