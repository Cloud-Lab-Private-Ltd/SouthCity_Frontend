import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Routess from "./routers/Routess";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ProfileGet, StudentGet, VoucherGet } from "./features/ProfileSlice";
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
import { DotLoader } from "react-spinners";

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
  }, []);

  return (
    <div className="app">
      {loading ? (
        <>
          <div className="w-full h-[100vh] z-[1000] fixed bg-white flex items-center justify-center">
            <DotLoader color="#5570F1" />
          </div>
        </>
      ) : (
        ""
      )}
      <Routess />
    </div>
  );
}

export default App;
