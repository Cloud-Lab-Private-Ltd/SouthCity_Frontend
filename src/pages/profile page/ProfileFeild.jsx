import React, { useState } from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { ProfileGet } from "../../features/ProfileSlice";
import { BASE_URL } from "../../config/apiconfig";

const ProfileField = () => {
  const [openRight, setOpenRight] = useState(false);
  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  // Form state
  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [loader, setloader] = useState(false);


  const submit = () => {
    if (currentPassword && newPassword) {
      setloader(true);
      axios
        .put(
          `${BASE_URL}/api/users/me/password`,
          {currentPassword,newPassword},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.message === "Password updated successfully") {
            Swal.fire({
              title: "Thank You!",
              text: "Password updated successfully",
              icon: "success",
              confirmButtonColor: "#115640",
            });
            setcurrentPassword("");
            setnewPassword("");
            closeDrawerRight();
            setloader(false);
            dispatch(ProfileGet());
          } else {
            console.log("post profile fields", res.data);
            setloader(false);
          }
        })
        .catch((e) => {
          if (e.response.data.message === "Current password is incorrect") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Current password is incorrect",
              confirmButtonColor: "#115640",
            });
            setloader(false);
          } else {
            console.log("post password", e);
            setloader(false);
          }
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Fill Input",
        confirmButtonColor: "#115640",
      });
      setloader(false);
    }
  };

  return (
    <div>
      <div>
        <Button
          className="flex items-center gap-3 bg-c-green dark:bg-d-back dark:text-d-text"
          size="sm"
          onClick={openDrawerRight}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-4"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
              clipRule="evenodd"
            />
          </svg>
          Change Password
        </Button>
      </div>

      <Drawer
        placement="right"
        open={openRight}
        className="p-4 bg-white z-[500] dark:bg-d-back2"
        overlay={false}
        size={500}
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography
            variant="h5"
            color="blue-gray"
            className="flex gap-2 items-center dark:text-d-text"
          >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
              clipRule="evenodd"
            />
          </svg>

            Change Password
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={closeDrawerRight}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <div className="w-full h-[82vh] overflow-auto">
          <div className="grid grid-cols-1">
            <div className="mb-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-[1rem] dark:text-d-text">Current Password</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full rounded-md dark:bg-d-back dark:text-white"
                  value={currentPassword}
                  onChange={(e) => setcurrentPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-2">
              <label className="form-control w-full">
                <div className="label">
                <span className="label-text text-[1rem] dark:text-d-text">New Password</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full rounded-md dark:bg-d-back dark:text-white"
                  value={newPassword}
                  onChange={(e) => setnewPassword(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="my-3">
            {loader ? (
              <Button className="bg-c-green dark:bg-d-back dark:text-d-text h-[48px] overflow-hidden flex items-center justify-center">
                <span className="loading loading-dots loading-lg"></span>
              </Button>
            ) : (
              <>
                <Button
                  className="bg-c-green dark:bg-d-back dark:text-d-text h-[48px] overflow-hidden flex items-center justify-center"
                  onClick={submit}
                >
                  Submit
                </Button>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ProfileField;
