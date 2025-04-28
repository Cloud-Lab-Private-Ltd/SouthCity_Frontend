import React, { useEffect } from "react";
import "./Dashboard.css";
import DashCard from "./DashCard";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.profiledata);
  if (profile.message === "Invalid token") {
    localStorage.clear();
    window.location.reload();
    navigate("/login");
  }

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token");
      const loginTime = localStorage.getItem("loginTime");

      if (!token || !loginTime) {
        localStorage.clear(); // Clear the localStorage after 24 hours
        console.warn("No token or login time found.");
        navigate("/login"); // Redirect to login page if no token or login time is found
        return;
      }

      const currentTime = new Date().getTime();
      const timeDifference = currentTime - loginTime;

      // 24 hours in milliseconds
      const expiryTime = 24 * 60 * 60 * 1000; // 86,400,000 milliseconds

      if (timeDifference > expiryTime) {
        localStorage.clear(); // Clear the localStorage after 24 hours
        navigate("/login"); // Redirect to login page
        console.warn("Token expired after 24 hours. Clearing localStorage.");
        return;
      }

      console.warn("Token is still valid.");
    };

    // Check the token immediately
    checkTokenExpiry();

    // Set an interval to check the token every 10 seconds (10000 milliseconds)
    const intervalId = setInterval(checkTokenExpiry, 10000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [location, navigate]); // Include navigate in dependencies

  return (
    <div>
      <div className="flex h-[100vh w-[100%]">
        <div className={"w-full "}>
          <div className="w-[100%] bg-c-back dark:bg-d-back min-h-[90vh] px-6 py-5 dash-body">

            <div>
              <DashCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
