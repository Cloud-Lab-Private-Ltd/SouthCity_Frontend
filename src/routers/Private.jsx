import React from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

const Pravate = () => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { profile } = useSelector((state) => state.profiledata);

  // if (profile.message === "Invalid token") {
  //   localStorage.clear();
  //   window.location.reload();
  //   navigate("/login");
  // }

  const auth = localStorage.getItem("token");
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default Pravate;
