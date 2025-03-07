import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/apiconfig";

const UserStatusDashboard = () => {
  const [users, setUsers] = useState({ members: [], students: [] });

  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/sch/getAllUsers`)
      .then((res) => res.json())
      .then((data) => {
        setUsers({
          members: data.members,
          students: [],
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    let wsUrl = localStorage.getItem("wsUrl");

    if (!wsUrl) {
      console.warn("WebSocket URL not found in localStorage.");
      return;
    }

    if (window.location.protocol === "https:") {
      wsUrl = wsUrl.replace("ws://", "wss://");
    }

    try {
      const ws = new WebSocket(`${wsUrl}/admin`);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "statusUpdate") {
            updateUserStatus(data.user);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => ws.close();
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
    }
  }, []);

  const updateUserStatus = (updatedUser) => {
    setUsers((prevUsers) => {
      const newUsers = { ...prevUsers };
      const index = newUsers.members.findIndex((u) => u._id === updatedUser.id);
      if (index !== -1) {
        newUsers.members[index] = {
          ...newUsers.members[index],
          isOnline: updatedUser.isOnline,
          lastActive: updatedUser.lastActive,
        };
      }
      return newUsers;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Live Users Status
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-blue-50 rounded-lg p-4">
          <div className="stat-title text-blue-600">Total Users</div>
          <div className="stat-value text-blue-600">
            {users.members.filter((user) => user?.Name !== "admin").length}
          </div>
        </div>

        <div className="stat bg-green-50 rounded-lg p-4">
          <div className="stat-title text-green-600">Online Users</div>
          <div className="stat-value text-green-600">
            {users.members.filter(
              (user) => user?.Name !== "admin" && user.isOnline
            ).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatusDashboard;
