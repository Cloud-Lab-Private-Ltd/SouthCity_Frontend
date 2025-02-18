import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProfileGet, StudentGet } from "../../features/ProfileSlice";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";

const Profile = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const studentName = localStorage.getItem("groupName");
  const { profile, student } = useSelector((state) => state.profiledata);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (studentName === "Students") {
      dispatch(StudentGet());
    } else {
      dispatch(ProfileGet(userId));
    }
  }, [dispatch, userId, studentName]);

  const handlePasswordChange = async () => {
    if (!newPassword) {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Please enter new password",
        confirmButtonColor: "#5570F1",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/v1/sch/students/${student?.student?._id}`,
        { password: newPassword },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password updated successfully",
          confirmButtonColor: "#5570F1",
        });
        setShowPasswordModal(false);
        setNewPassword("");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update password",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add this handler for member password change
  const handleMemberPasswordChange = async () => {
    if (!newPassword) {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Please enter new password",
        confirmButtonColor: "#5570F1",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/v1/sch/member/${profile?.member?._id}`,
        { password: newPassword },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password updated successfully",
          confirmButtonColor: "#5570F1",
        });
        setShowPasswordModal(false);
        setNewPassword("");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update password",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

        {studentName === "Students" ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex items-center space-x-4">
                  <div className="avatar">
                    <div className="w-24 rounded-full ring ring-white">
                      <img src={student?.student?.profileImage} alt="Profile" />
                    </div>
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">
                      {student?.student?.fullName}
                    </h2>
                    <p className="text-blue-100">
                      {student?.student?.registrationId}
                    </p>
                  </div>
                </div>

                {studentName === "Students" && (
                  <div className="mt-4 md:mt-0">
                    <Button
                      onClick={() => setShowPasswordModal(true)}
                      className="bg-white text-blue-500 hover:bg-blue-50 flex items-center gap-2 shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                      Change Password
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-gray-700 mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">
                          Father's Name
                        </label>
                        <p className="font-medium">
                          {student?.student?.fatherName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <p className="font-medium">{student?.student?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Phone</label>
                        <p className="font-medium">
                          {student?.student?.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-gray-700 mb-4">
                      Academic Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">Course</label>
                        <p className="font-medium">
                          {student?.student?.course[0]?.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Batch</label>
                        <p className="font-medium">
                          {student?.student?.batch?.batchName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">
                          Current Semester
                        </label>
                        <p className="font-medium">
                          {student?.student?.currentSemester}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-gray-700 mb-4">
                      Contact Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">Address</label>
                        <p className="font-medium">
                          {student?.student?.address}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">City</label>
                        <p className="font-medium">{student?.student?.city}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Country</label>
                        <p className="font-medium">
                          {student?.student?.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Staff Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex items-center space-x-4">
                  <div className="avatar">
                    <div className="w-24 rounded-full ring ring-white">
                      <img src={profile?.member?.profileImage} alt="Profile" />
                    </div>
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">
                      {profile?.member?.Name}
                    </h2>
                    <p className="text-indigo-100">
                      {profile?.member?.staffId}
                    </p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <Button
                    onClick={() => setShowPasswordModal(true)}
                    className="bg-white text-blue-500 hover:bg-blue-50 flex items-center gap-2 shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                    Change Password
                  </Button>
                </div>
              </div>
            </div>

            {/* Staff Profile Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-gray-700 mb-4">
                      Professional Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <p className="font-medium">{profile?.member?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Group</label>
                        <p className="font-medium">
                          {profile?.member?.group?.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Phone</label>
                        <p className="font-medium">
                          {profile?.member?.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-gray-700 mb-4">
                      Location Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">City</label>
                        <p className="font-medium">{profile?.member?.city}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Country</label>
                        <p className="font-medium">
                          {profile?.member?.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      <Dialog
        open={showPasswordModal}
        handler={() => setShowPasswordModal(false)}
      >
        <DialogHeader>Change Password</DialogHeader>
        <DialogBody>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
            placeholder="Enter new password"
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowPasswordModal(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            className="bg-c-purple h-[40px] flex items-center justify-center overflow-hidden"
            onClick={
              studentName === "Students"
                ? handlePasswordChange
                : handleMemberPasswordChange
            }
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Change Password"
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Profile;
