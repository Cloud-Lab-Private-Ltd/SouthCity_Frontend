import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProfileGet, StudentGet } from "../../features/ProfileSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const studentName = localStorage.getItem("groupName");
  const { profile, student } = useSelector((state) => state.profiledata);

  useEffect(() => {
    if (studentName === "Students") {
      dispatch(StudentGet());
    } else {
      dispatch(ProfileGet(userId));
    }
  }, [dispatch, userId, studentName]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

        {studentName === "Students" ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
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
                  <p className="text-indigo-100">{profile?.member?.staffId}</p>
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
    </div>
  );
};

export default Profile;
