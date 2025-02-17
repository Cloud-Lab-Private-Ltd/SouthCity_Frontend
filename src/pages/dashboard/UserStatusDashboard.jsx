import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/apiconfig";

const UserStatusDashboard = () => {
  const [users, setUsers] = useState({ members: [], students: [] });

  useEffect(() => {
    fetch(
      `${BASE_URL}/api/v1/sch/getAllUsers`
      //  {
      //   headers: {
      //     "x-access-token": localStorage.getItem("token"),
      //   },
      // }
    )
      .then((res) => res.json())
      .then((data) => setUsers(data));

    const wsUrl = localStorage.getItem("wsUrl");
    const ws = new WebSocket(`${wsUrl}/admin`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "statusUpdate") {
        updateUserStatus(data.user);
      }
    };

    return () => ws.close();
  }, []);

  const updateUserStatus = (updatedUser) => {
    setUsers((prevUsers) => {
      const newUsers = { ...prevUsers };
      ["members", "students"].forEach((type) => {
        const index = newUsers[type].findIndex((u) => u._id === updatedUser.id);
        if (index !== -1) {
          newUsers[type][index] = {
            ...newUsers[type][index],
            isOnline: updatedUser.isOnline,
            lastActive: updatedUser.lastActive,
          };
        }
      });
      return newUsers;
    });
  };

  console.log(users);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Live Users Status
      </h2>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-blue-50 rounded-lg p-4">
          <div className="stat-title text-blue-600">Total Users</div>
          <div className="stat-value text-blue-600">
            {
              [...users.members, ...users.students].filter(
                (user) => user?.Name !== "admin"
              ).length
            }
          </div>
        </div>

        <div className="stat bg-green-50 rounded-lg p-4">
          <div className="stat-title text-green-600">Online Users</div>
          <div className="stat-value text-green-600">
            {
              [...users.members, ...users.students].filter(
                (user) => user?.Name !== "admin" && user.isOnline
              ).length
            }
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...users.members, ...users.students]
          .filter((user) => user?.Name !== "admin") // Filter out admin users
          .map((user) => (
            <div
              key={user._id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.Name || user.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                                    ${
                                      user.isOnline
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                  >
                    {user.isOnline ? "Online" : "Offline"}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Last Active: {new Date(user.lastActive).toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Type:{" "}
                    {user.hasOwnProperty("fullName") ? "Student" : "Member"}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserStatusDashboard;
