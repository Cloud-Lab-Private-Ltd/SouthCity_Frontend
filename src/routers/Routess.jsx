import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Index } from "../compunent/sidebar/Sidebar";
import ProfileDrop from "../compunent/header/ProfileDrop";
import { Badge, IconButton } from "@material-tailwind/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/solid";
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
import Notification from "../pages/notifications/Notification";
import StudentVoucher from "../pages/student vouncher/StudentVoucher";

const Routess = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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
  const { profile, student } = useSelector((state) => state.profiledata);
  const studentName = localStorage.getItem("groupName");

  const notifications = useSelector(
    (state) => state.groupdata?.notifications || []
  );

  // Get unread count with proper array check
  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  const permissions = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.permissions || []
  );

  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name || []
  );

  const coursepermissions = permissions[0]?.read;
  const batchpermissions = permissions[1]?.read;
  const studentpermissions = permissions[2]?.read;
  const voucherpermissions = permissions[3]?.read;
  const actionlogpermissions = permissions[4]?.read;
  const bulkpermissions = permissions[5]?.read;
  const degreepermissions = permissions[6]?.read;
  const statuspermissions = permissions[7]?.read;

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
                          {studentName === "Students" ? (
                            <>{student?.student?.fullName?.[0]}</>
                          ) : (
                            <>{profile?.member?.Name?.[0]}</>
                          )}
                        </span>
                      </div>
                    </div>
                    <h1 className="text-[#282F3E] font-semibold dark:text-d-text">
                      {studentName === "Students" ? (
                        <>{student?.student?.fullName}</>
                      ) : (
                        <>{profile?.member?.Name}</>
                      )}
                    </h1>
                  </div>
                  <div className="h-[70px] flex items-center justify-end gap-4 dark:text-d-text">
                    <span>{formattedDate}</span>
                    <span>{formattedTime}</span>
                    <div
                      className="relative cursor-pointer"
                      onClick={() => navigate("/notifications")}
                    >
                      <Badge
                        content={unreadCount}
                        color="red"
                        invisible={unreadCount === 0}
                        className={`${
                          unreadCount > 9 ? "rounded-full px-2" : ""
                        }`}
                      >
                        <IconButton variant="text" className="relative">
                          <BellIcon className="h-6 w-6 text-gray-600" />
                        </IconButton>
                      </Badge>
                    </div>
                    <ProfileDrop />
                  </div>
                </div>
              </div>
              <div className="lg:hidden block bg-white w-[100%] dark:bg-d-back2">
                <div className="grid grid-cols-2 px-3 flex-initial w-[100%]">
                  <div className="h-[70px] flex items-center justify-start gap-2">
                    <ProfileDrop />
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <h1 className="text-[#282F3E] font-medium text-[0.9rem]">
                      {type}
                    </h1>
                    <div className="h-[70px] flex items-center">
                      <div
                        className="relative cursor-pointer"
                        onClick={() => navigate("/notifications")}
                      >
                        <Badge
                          content={unreadCount}
                          color="red"
                          invisible={unreadCount === 0}
                          className={`${
                            unreadCount > 9 ? "rounded-full px-2" : ""
                          }`}
                        >
                          <IconButton variant="text" className="relative">
                            <BellIcon className="h-6 w-6 text-gray-600" />
                          </IconButton>
                        </Badge>
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
                {studentName === "Students" ? (
                  <>
                    <Route
                      path="/student-voucher"
                      element={<StudentVoucher />}
                    ></Route>
                  </>
                ) : (
                  ""
                )}

                <Route path="/" element={<Dashboard />}></Route>
                {admin === "admins" ? (
                  <>
                    <Route path="/group-role" element={<GroupPage />}></Route>
                    <Route
                      path="/permission"
                      element={<PermissionPage />}
                    ></Route>
                  </>
                ) : (
                  ""
                )}

                {admin === "admins" ? (
                  <>
                    <Route path="/members" element={<Member />}></Route>
                  </>
                ) : (
                  ""
                )}

                {admin === "admins" ? (
                  <>
                    <Route path="/degree-type" element={<Degree />}></Route>
                  </>
                ) : degreepermissions ? (
                  <>
                    <Route path="/degree-type" element={<Degree />}></Route>
                  </>
                ) : (
                  ""
                )}

                {admin === "admins" ? (
                  <>
                    <Route path="/status" element={<Status />}></Route>
                  </>
                ) : statuspermissions ? (
                  <>
                    <Route path="/status" element={<Status />}></Route>
                  </>
                ) : (
                  ""
                )}

                {admin === "admins" ? (
                  <>
                    <Route path="/course" element={<CoursePage />}></Route>
                  </>
                ) : coursepermissions ? (
                  <>
                    <Route path="/course" element={<CoursePage />}></Route>
                  </>
                ) : (
                  ""
                )}

                {admin === "admins" ? (
                  <>
                    <Route path="/batch" element={<BatchPage />}></Route>
                  </>
                ) : batchpermissions ? (
                  <>
                    <Route path="/batch" element={<BatchPage />}></Route>
                  </>
                ) : (
                  ""
                )}

                {admin === "admins" ? (
                  <>
                    <Route path="/student" element={<StudentPage />}></Route>
                  </>
                ) : studentpermissions ? (
                  <>
                    <Route path="/student" element={<StudentPage />}></Route>
                  </>
                ) : (
                  ""
                )}

                {admin === "admins" ? (
                  <>
                    <Route path="/voucher" element={<VoucherPage />}></Route>
                  </>
                ) : voucherpermissions ? (
                  <>
                    <Route path="/voucher" element={<VoucherPage />}></Route>
                  </>
                ) : (
                  ""
                )}

                {admin === "admins" ? (
                  <>
                    <Route
                      path="/action-log"
                      element={<ActionLogPage />}
                    ></Route>
                  </>
                ) : actionlogpermissions ? (
                  <>
                    <Route
                      path="/action-log"
                      element={<ActionLogPage />}
                    ></Route>
                  </>
                ) : (
                  ""
                )}

                {admin === "admins" ? (
                  <>
                    <Route
                      path="/bulk-message"
                      element={<BulkMessagePage />}
                    ></Route>
                  </>
                ) : bulkpermissions ? (
                  <>
                    <Route
                      path="/bulk-message"
                      element={<BulkMessagePage />}
                    ></Route>
                  </>
                ) : (
                  ""
                )}

                <Route path="/profile" element={<Profile />}></Route>

                <Route path="/notifications" element={<Notification />}></Route>
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routess;
