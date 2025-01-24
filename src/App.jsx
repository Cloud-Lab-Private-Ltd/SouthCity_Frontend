import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Routess from "./routers/Routess";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ProfileGet } from "./features/ProfileSlice";
import {
  ActionLogsGet,
  BatchesGet,
  CoursesGet,
  DegreeTypesGet,
  GroupGet,
  MembersGet,
  NotificationsGet,
  PermissionsGet,
  StatusesGet,
  StudentsGet,
  VouchersGet,
} from "./features/GroupApiSlice";

function App() {
  const navigate = useNavigate();

  const { profile, loading } = useSelector((state) => state.profiledata);
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();

  if (profile.message === "Invalid token") {
    localStorage.clear();
    window.location.reload();
    navigate("/login");
  }

  useEffect(() => {
    dispatch(ProfileGet(userId));
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
  }, []);

  return (
    <div className="app">
      {loading ? (
        <section className="dots-container">
          <div className="dot bg-c-purple"></div>
          <div className="dot bg-c-yellow"></div>
          <div className="dot bg-c-purple"></div>
          <div className="dot bg-c-yellow"></div>
          <div className="dot bg-c-purple"></div>
        </section>
      ) : (
        ""
      )}
      <Routess />
    </div>
  );
}

export default App;
