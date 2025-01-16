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

  // Function to toggle dark mode
  const handleToggle = () => {
    if (isDarkMode) {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "disabled");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "enabled");
    }
  };

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

                    <div className="pt-1">
                      <label className="swap swap-rotate">
                        {/* this hidden checkbox controls the state */}
                        <input
                          type="checkbox"
                          className="theme-controller hidden"
                          checked={isDarkMode}
                          onChange={handleToggle}
                        />
                      </label>
                    </div>

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
                      <div className="pt-1 dark:text-d-text">
                        <label className="swap swap-rotate">
                          {/* this hidden checkbox controls the state */}
                          <input
                            type="checkbox"
                            className="theme-controller hidden"
                            checked={isDarkMode}
                            onChange={handleToggle}
                          />

                          {!isDarkMode ? (
                            <>
                              {/* sun icon */}
                              <svg
                                className="swap-off h-8 w-8 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                              </svg>
                            </>
                          ) : (
                            <>
                              {/* moon icon */}
                              <svg
                                className="swap-on h-8 w-8 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                              </svg>
                            </>
                          )}
                        </label>
                      </div>
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

                <Route path="/profile" element={<Profile />}></Route>
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routess;
