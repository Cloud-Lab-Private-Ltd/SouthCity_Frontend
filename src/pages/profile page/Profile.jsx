import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProfileGet } from "../../features/ProfileSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    dispatch(ProfileGet(userId));
  }, []);

  const { profile } = useSelector((state) => state.profiledata);
  if (profile.message === "Invalid token") {
    localStorage.clear();
    window.location.reload();
    navigate("/login");
  }

  return (
    <div>
      <div className="flex h-[100vh w-[100%]">
        <div className="w-[100%] bg-c-back dark:bg-d-back min-h-[90vh] px-6 py-5 dash-body">
          {/* Header matching Dashboard style */}
          <div className="grid grid-cols-2 mb-8">
            <div>
              <h2 className="text-c-grays dark:text-d-text font-semibold text-[1.5rem] uppercase">
                PROFILE
              </h2>
            </div>
          </div>

          {/* Profile Content */}
          <div className="bg-white dark:bg-d-back2 rounded-xl p-6 shadow-tremor-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm">Name</label>
                  <p className="text-gray-900 dark:text-d-text font-medium">{profile.member?.Name}</p>
                </div>
                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm">Email</label>
                  <p className="text-gray-900 dark:text-d-text font-medium">{profile.member?.email}</p>
                </div>
                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm">Staff ID</label>
                  <p className="text-gray-900 dark:text-d-text font-medium">{profile.member?.staffId}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm">Group</label>
                  <p className="text-gray-900 dark:text-d-text font-medium">{profile.member?.group?.name}</p>
                </div>
                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm">Phone</label>
                  <p className="text-gray-900 dark:text-d-text font-medium">{profile.member?.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm">Location</label>
                  <p className="text-gray-900 dark:text-d-text font-medium">
                    {profile.member?.city}, {profile.member?.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
