import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge, IconButton } from "@material-tailwind/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import ProfileDrop from "./ProfileDrop";
import { useSelector } from "react-redux";

const Navigation = ({ isDrawerOpen, openDrawer, closeDrawer }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  const { profile, student } = useSelector((state) => state.profiledata);
  const studentName = localStorage.getItem("groupName");
  const type = localStorage.getItem("type");

  // Function to toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        /* Safari */
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        /* IE11 */
        document.documentElement.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullScreenChange
      );
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString();

  const notifications = useSelector(
    (state) => state.groupdata?.notifications || []
  );

  // Get unread count with proper array check
  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  return (
    <div className="header h-[70px] w-full">
      <div className="flex h-[70px] w-[100%] shadow-md fixed z-[300]">
        <div
          className={
            isDrawerOpen
              ? "flex-none lg:w-[100px]"
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
              {/* Add fullscreen toggle button */}
              <IconButton
                variant="text"
                className="relative"
                onClick={toggleFullScreen}
              >
                <FontAwesomeIcon
                  icon={isFullScreen ? faCompress : faExpand}
                  className="h-5 w-5 text-gray-600"
                />
              </IconButton>
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
                {/* Add fullscreen toggle button for mobile */}
                <IconButton
                  variant="text"
                  className="relative"
                  onClick={toggleFullScreen}
                >
                  <FontAwesomeIcon
                    icon={isFullScreen ? faCompress : faExpand}
                    className="h-5 w-5 text-gray-600"
                  />
                </IconButton>
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
  );
};

export default Navigation;
