import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Routess from "./routers/Routess";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ProfileGet, StudentGet, VoucherGet } from "./features/ProfileSlice";
import {
  ActionLogsGet,
  BatchesGet,
  CoursesGet,
  DegreeTypesGet,
  FeesGet,
  GroupGet,
  MembersGet,
  NotificationsGet,
  PermissionsGet,
  StatusesGet,
  StudentsGet,
  TrashedStudentsGet,
  VouchersGet,
} from "./features/GroupApiSlice";
import { DotLoader } from "react-spinners";
import ActivityDetector from "./routers/ActivityDetector";

function App() {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const { profile, loading } = useSelector((state) => state.profiledata);
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("token");
  let wsUrl = localStorage.getItem("wsUrl");
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && wsUrl) {
      // Ensure WebSocket uses WSS for HTTPS
      // if (window.location.protocol === "https:") {
      //   wsUrl = wsUrl.replace("ws://", "wss://");
      // }

      try {
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket Connected");
          const message = {
            type: "userActivity",
            userId: userId,
            userType: userType,
            status: "online",
          };
          ws.send(JSON.stringify(message));
        };

        ws.onmessage = (event) => {
          console.log("WebSocket message received:", event.data);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
        };
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [token, wsUrl]);

  if (profile?.message === "Invalid token") {
    localStorage.clear();
    window.location.reload();
    navigate("/login");
  }

  useEffect(() => {
    if (token) {
      try {
        dispatch(ProfileGet(userId));
        dispatch(StudentGet());
        dispatch(VoucherGet());
        dispatch(GroupGet());
        dispatch(MembersGet());
        dispatch(DegreeTypesGet());
        dispatch(StatusesGet());
        dispatch(CoursesGet());
        dispatch(BatchesGet());
        dispatch(StudentsGet());
        dispatch(VouchersGet());
        dispatch(ActionLogsGet());
        dispatch(PermissionsGet());
        dispatch(NotificationsGet());
        dispatch(TrashedStudentsGet());
        dispatch(FeesGet());
      } catch (error) {
        console.error("Error dispatching API calls:", error);
      }
    }
  }, []);

  return (
    <div className="app">
      {loading && (
        <div className="w-full h-[100vh] z-[1000] fixed bg-white flex items-center justify-center">
          <DotLoader color="#5570F1" />
        </div>
      )}
      <Routess />
      <ActivityDetector />
    </div>
  );
}

export default App;
