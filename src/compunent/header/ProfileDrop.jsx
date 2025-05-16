import React, { useState } from "react";
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import {
  PowerIcon,
  UserCircleIcon,
  UserGroupIcon,
  LockClosedIcon,
  UserIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfileDrop = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile, student } = useSelector((state) => state.profiledata);
  const studentName = localStorage.getItem("groupName");

  // Get permissions from Redux store
  const permissions = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.permissions || []
  );

  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name || []
  );

  // Check permissions
  const progamspermissions = permissions[0]?.read;
  const batchpermissions = permissions[1]?.read;
  const degreepermissions = permissions[5]?.read;
  const statuspermissions = permissions[6]?.read;
  const feespermissions = permissions[8]?.read;

  // Check if a menu item is active based on current path
  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMenu = (label, path) => {
    if (label === "Sign Out") {
      localStorage.clear();
      navigate("/login");
      setIsMenuOpen(false);
    } else if (label === "My Profile") {
      navigate("/profile");
      setIsMenuOpen(false);
    } else if (path) {
      navigate(path);
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(false);
    }
  };

  // Basic profile menu items
  const profileMenuItems = [
    {
      label: "My Profile",
      icon: UserCircleIcon,
      path: "/profile",
    },
  ];

  // Admin menu items
  const adminMenuItems = [];

  if (admin === "admins") {
    adminMenuItems.push(
      {
        label: "Group / Role",
        icon: UserGroupIcon,
        path: "/group-role",
      },
      {
        label: "Permission",
        icon: LockClosedIcon,
        path: "/permission",
      },
      {
        label: "Member",
        icon: UserIcon,
        path: "/members",
      }
    );
  }

  // Core settings menu items
  const coreSettingsItems = [];

  if (admin === "admins" || degreepermissions) {
    coreSettingsItems.push({
      label: "Degree Type",
      icon: Cog6ToothIcon,
      path: "/degree-type",
    });
  }

  if (admin === "admins" || statuspermissions) {
    coreSettingsItems.push({
      label: "Status",
      icon: Cog6ToothIcon,
      path: "/status",
    });
  }

  // Program and batch menu items
  const programBatchItems = [];

  if (admin === "admins" || progamspermissions) {
    programBatchItems.push({
      label: "Programs",
      icon: BookOpenIcon,
      path: "/course",
    });
  }

  if (admin === "admins" || batchpermissions) {
    programBatchItems.push({
      label: "Batch",
      icon: ListBulletIcon,
      path: "/batch",
    });
  }

  // Sign out should always be the last item
  const signOutItem = [
    {
      label: "Sign Out",
      icon: PowerIcon,
    },
  ];

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center rounded-full p-0"
        >
          <Avatar
            variant="circular"
            size="md"
            alt="profile"
            withBorder={true}
            color="blue-gray"
            className="p-0.5"
            src={
              studentName === "Students"
                ? student?.student?.profileImage
                : profile?.member?.profileImage ||
                  "https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png"
            }
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1 max-h-[80vh] overflow-y-auto custom-scrollbar">
        {/* Profile Section */}
        {profileMenuItems.map(({ label, icon, path }, key) => (
          <MenuItem
            key={label}
            onClick={() => closeMenu(label, path)}
            className={`flex items-center gap-2 rounded ${
              isActive(path) ? "bg-c-purple/10 text-c-purple" : ""
            }`}
          >
            {React.createElement(icon, {
              className: `h-4 w-4 ${isActive(path) ? "text-c-purple" : ""}`,
              strokeWidth: 2,
            })}
            <Typography
              as="span"
              variant="small"
              className={`font-normal ${
                isActive(path) ? "text-c-purple font-medium" : ""
              }`}
            >
              {label}
            </Typography>
          </MenuItem>
        ))}

        {/* Admin Section - only show if there are items */}
        {adminMenuItems.length > 0 && (
          <>
            <hr className="my-2 border-blue-gray-50" />
            <Typography className="text-xs font-semibold text-blue-gray-500 px-3 py-1.5">
              Administration
            </Typography>
            {adminMenuItems.map(({ label, icon, path }, key) => (
              <MenuItem
                key={label}
                onClick={() => closeMenu(label, path)}
                className={`flex items-center gap-2 rounded ${
                  isActive(path) ? "bg-c-purple/10 text-c-purple" : ""
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${isActive(path) ? "text-c-purple" : ""}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className={`font-normal ${
                    isActive(path) ? "text-c-purple font-medium" : ""
                  }`}
                >
                  {label}
                </Typography>
              </MenuItem>
            ))}
          </>
        )}

        {/* Core Settings Section - only show if there are items */}
        {coreSettingsItems.length > 0 && (
          <>
            <hr className="my-2 border-blue-gray-50" />
            <Typography className="text-xs font-semibold text-blue-gray-500 px-3 py-1.5">
              Core Settings
            </Typography>
            {coreSettingsItems.map(({ label, icon, path }, key) => (
              <MenuItem
                key={label}
                onClick={() => closeMenu(label, path)}
                className={`flex items-center gap-2 rounded ${
                  isActive(path) ? "bg-c-purple/10 text-c-purple" : ""
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${isActive(path) ? "text-c-purple" : ""}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className={`font-normal ${
                    isActive(path) ? "text-c-purple font-medium" : ""
                  }`}
                >
                  {label}
                </Typography>
              </MenuItem>
            ))}
          </>
        )}

        {/* Program and Batch Section - only show if there are items */}
        {programBatchItems.length > 0 && (
          <>
            <hr className="my-2 border-blue-gray-50" />
            <Typography className="text-xs font-semibold text-blue-gray-500 px-3 py-1.5">
              Academic
            </Typography>
            {programBatchItems.map(({ label, icon, path }, key) => (
              <MenuItem
                key={label}
                onClick={() => closeMenu(label, path)}
                className={`flex items-center gap-2 rounded ${
                  isActive(path) ? "bg-c-purple/10 text-c-purple" : ""
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${isActive(path) ? "text-c-purple" : ""}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className={`font-normal ${
                    isActive(path) ? "text-c-purple font-medium" : ""
                  }`}
                >
                  {label}
                </Typography>
              </MenuItem>
            ))}
          </>
        )}

        {/* Sign Out Section */}
        <hr className="my-2 border-blue-gray-50" />
        {signOutItem.map(({ label, icon }, key) => (
          <MenuItem
            key={label}
            onClick={() => closeMenu(label)}
            className="flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
          >
            {React.createElement(icon, {
              className: "h-4 w-4 text-red-500",
              strokeWidth: 2,
            })}
            <Typography
              as="span"
              variant="small"
              className="font-normal"
              color="red"
            >
              {label}
            </Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ProfileDrop;
