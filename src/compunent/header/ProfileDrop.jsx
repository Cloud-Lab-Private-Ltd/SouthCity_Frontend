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
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfileDrop = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile, student } = useSelector((state) => state.profiledata);
  const studentName = localStorage.getItem("groupName");

  const closeMenu = (label) => {
    if (label === "Sign Out") {
      localStorage.clear();
      navigate("/login");
      setIsMenuOpen(false);
    } else if(label === "My Profile") {
      navigate("/profile");
    } else {
      setIsMenuOpen(false);
    }
  };

  const profileMenuItems = [
    {
      label: "My Profile",
      icon: UserCircleIcon,
    },
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
            src={studentName === "Students" 
              ? student?.student?.profileImage 
              : profile?.member?.profileImage || "https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png"}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={() => closeMenu(label)}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default ProfileDrop;
