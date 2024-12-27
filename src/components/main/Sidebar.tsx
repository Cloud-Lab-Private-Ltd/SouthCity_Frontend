"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FaSignOutAlt,
  FaUsers,
  FaLayerGroup,
  FaUserGraduate,
  FaUser,
  FaFileAlt,
  FaBook,
} from "react-icons/fa";
import { GoPasskeyFill } from "react-icons/go";
import { IoSettingsSharp } from "react-icons/io5";
import {
  MdDashboard,
  MdInsertChart,
  MdNotificationsActive,
} from "react-icons/md";
import Image from "next/image";

const Sidebar = () => {
  const router = useRouter();

  const userType = localStorage.getItem("response.user.role");

  const sidebarRoutes = [
    {
      id: 1,
      label: "Dashboard",
      icon: <MdDashboard />,
      href: `../${userType}/dashboard`,
    },
    { id: 2, label: "Course", icon: <FaBook />, href: `../${userType}/course` },
    {
      id: 3,
      label: "Group / Role",
      icon: <FaUsers />,
      href: `../${userType}/group`,
    },
    {
      id: 4,
      label: "Batch",
      icon: <FaLayerGroup />,
      href: `../${userType}/batch `,
    },
    {
      id: 5,
      label: "Student",
      icon: <FaUserGraduate />,
      href: `../${userType}/student`,
    },
    { id: 6, label: "Member", icon: <FaUser />, href: `../${userType}/member` },
    { id: 7, label: "Voucher", icon: <FaFileAlt />, href: "/voucher" },
    {
      id: 8,
      label: "Permission",
      icon: <GoPasskeyFill />,
      href: "/permission",
    },
    {
      id: 9,
      label: "Core Setting",
      icon: <IoSettingsSharp />,
      href: "/settings",
    },
    {
      id: 10,
      label: "Notification",
      icon: <MdNotificationsActive />,
      href: "/notifications",
    },
    { id: 11, label: "Report", icon: <MdInsertChart />, href: "/report" },
  ];

  const [activeRoute, setActiveRoute] = useState("Dashboard");

  const handleRouteClick = (label: string) => {
    setActiveRoute(label);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="bg-[#f5f5f5ff]">
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <aside className="w-[250px] bg-[#ffffffff] drop-shadow-lg h-screen flex flex-col">
        <div className="flex justify-start p-4 gap-5">
          <Image
            src="/images/icon.png"
            alt="Logo"
            width={44}
            height={20}
            className="w-15 h-8 mt-2"
          />
          <Image
            src="/images/text.png"
            alt="Logo"
            width={70}
            height={80}
            className="w-14.5 h-10.5"
          />
        </div>

        <nav className="flex-1">
          <ul className="space-y-0.5 text-gray-600">
            {sidebarRoutes.map((route) => (
              <li
                key={route.id}
                className={`${
                  activeRoute === route.label
                    ? "bg-[#fff700ff] text-gray-600 m-1 font-poppins font-semibold"
                    : "hover:bg-gray-200"
                } rounded-md p-2 font-poppins`}
              >
                <Link
                  href={route.href}
                  onClick={() => handleRouteClick(route.label)}
                  className="flex py-0.5 text-[16.74px] items-center text-gray-600 font-[400] gap-6"
                >
                  <span className="text-2xl pl-2">{route.icon}</span>
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 bg-white">
          <button
            className="w-[186px] gap-[10px] h-[48px] flex items-center justify-center font-poppins px-2 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
