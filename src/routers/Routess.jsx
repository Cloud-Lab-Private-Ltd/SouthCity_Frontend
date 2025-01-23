import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Index } from "../compunent/sidebar/Sidebar";
import ProfileDrop from "../compunent/header/ProfileDrop";
import { IconButton } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Private from "./Private";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/login/Login";
import Profile from "../pages/profile page/Profile";
import { useSelector } from "react-redux";
import GroupPage from "../pages/group page/Group";
import Member from "../pages/member page/Member";
import Degree from "../pages/degree type/Degree";
import Status from "../pages/status/Status";
import CoursePage from "../pages/course/Course";
import BatchPage from "../pages/batch/Batch";
import StudentPage from "../pages/student/Student";
import VoucherPage from "../pages/voucher/Voucher";
import ActionLogPage from "../pages/action log/ActionLog";
import BulkMessagePage from "../pages/bulk message/BulkMessage";
import PermissionPage from "../pages/permission/Permission";

const Routess = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsDrawerOpen(true);
      } else {
        setIsDrawerOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openDrawer = () => {
    setIsDrawerOpen(true);
    localStorage.setItem("isDrawerOpen", true);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    localStorage.setItem("isDrawerOpen", false);
  };

  const hide1 = location.pathname === "/login";

  const type = localStorage.getItem("type");

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString();

  const { profile } = useSelector((state) => state.profiledata);

  // State to manage dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check localStorage for dark mode preference on initial load
  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div>
      <div className="app">
        {!hide1 && (
          <div className="header h-[70px] w-full">
            <div className="flex h-[70px] w-[100%] shadow-md fixed z-[300]">
              <div
                className={
                  isDrawerOpen
                    ? "flex-none lg:w-[260px]"
                    : "hidden transition-all ease-in"
                }
              ></div>
              <div className="lg:block hidden w-[100%] bg-white dark:bg-d-back2">
                <div className="grid grid-cols-2 px-6 flex-initial w-[100%]">
                  <div className="flex items-center gap-3">
                    <div className="h-[70px] flex items-center">
                      <IconButton
                        variant="text"
                        size="lg"
                        className="dark:text-d-text"
                      >
                        {isDrawerOpen ? (
                          <XMarkIcon
                            className="h-8 w-8 stroke-2"
                            onClick={closeDrawer}
                          />
                        ) : (
                          <Bars3Icon
                            className="h-8 w-8 stroke-2"
                            onClick={openDrawer}
                          />
                        )}
                      </IconButton>
                    </div>
                    <div className="avatar online placeholder">
                      <div className="bg-neutral text-neutral-content w-10 rounded-full">
                        <span className="text-lg">
                          {profile?.member?.Name?.[0]}
                        </span>
                      </div>
                    </div>
                    <h1 className="text-[#282F3E] font-semibold dark:text-d-text">
                      {profile?.member?.Name}
                    </h1>
                  </div>
                  <div className="h-[70px] flex items-center justify-end gap-4 dark:text-d-text">
                    <span>{formattedDate}</span>
                    <span>{formattedTime}</span>

                    {/* <NotificationsMenu /> */}
                    <ProfileDrop />
                  </div>
                </div>
              </div>
              <div className="lg:hidden block bg-white w-[100%] dark:bg-d-back2">
                <div className="grid grid-cols-2 px-3 flex-initial w-[100%]">
                  <div className="h-[70px] flex items-center justify-start gap-2">
                    <ProfileDrop />
                    {/* <NotificationsMenu /> */}
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <h1 className="text-[#282F3E] font-medium text-[0.9rem]">
                      {type}
                    </h1>
                    <div className="h-[70px] flex items-center">
                      <IconButton
                        variant="text"
                        size="lg"
                        className="dark:text-d-text"
                      >
                        {isDrawerOpen ? (
                          <XMarkIcon
                            className="h-8 w-8 stroke-2"
                            onClick={closeDrawer}
                          />
                        ) : (
                          <Bars3Icon
                            className="h-8 w-8 stroke-2"
                            onClick={openDrawer}
                          />
                        )}
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex">
          {!hide1 && (
            <div
              className={
                isDrawerOpen
                  ? "sidebar flex-none lg:w-[280px]  overflow-hidden"
                  : ""
              }
            >
              <Index isDrawerOpen={isDrawerOpen} />
            </div>
          )}
          <div className="flex-initial w-[100%] overflow-x-hidden">
            <Routes>
              <Route path="/login" element={<Login />}></Route>
              <Route path="*" element={<Dashboard />}></Route>
              <Route element={<Private />}>
                <Route path="/" element={<Dashboard />}></Route>
                <Route path="/group-role" element={<GroupPage />}></Route>
                <Route path="/members" element={<Member />}></Route>
                <Route path="/degree-type" element={<Degree />}></Route>
                <Route path="/status" element={<Status />}></Route>
                <Route path="/course" element={<CoursePage />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/batch" element={<BatchPage />}></Route>
                <Route path="/student" element={<StudentPage />}></Route>
                <Route path="/voucher" element={<VoucherPage />}></Route>
                <Route path="/action-log" element={<ActionLogPage />}></Route>
                <Route path="/permission" element={<PermissionPage />}></Route>
                <Route
                  path="/bulk-message"
                  element={<BulkMessagePage />}
                ></Route>
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routess;
