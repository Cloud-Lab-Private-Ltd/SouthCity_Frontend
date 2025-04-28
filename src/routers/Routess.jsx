import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Index } from "../compunent/sidebar/Sidebar";
import Navigation from "../compunent/header/Navigation";
import Private from "./Private";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/login/Login";
import Profile from "../pages/profile page/Profile";
import { useSelector } from "react-redux";
import GroupPage from "../pages/group page/Group";
import Member from "../pages/member page/Member";
import Degree from "../pages/degree type/Degree";
import Status from "../pages/status/Status";
import CoursePage from "../pages/course/Course";
import BatchPage from "../pages/batch/Batch";
import StudentPage from "../pages/student/Student";
import BulkMessagePage from "../pages/bulk message/BulkMessage";
import PermissionPage from "../pages/permission/Permission";
import Notification from "../pages/notifications/Notification";
import StudentVoucher from "../pages/student vouncher/StudentVoucher";
import TrashStudent from "../pages/student/TrashStudent";
import CreateStudent from "../pages/student/CreateStudent";
import Feespage from "../pages/fees page/Feespage";
import LedgerPage from "../pages/ledger/Ledger";
import StudentLedger from "../pages/student/StudentLedger";

const Routess = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const location = useLocation();

  // Get permissions from Redux store
  const permissions = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.permissions || []
  );

  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name || []
  );

  const studentName = localStorage.getItem("groupName");

  // Check permissions for different modules
  const coursepermissions = permissions[0]?.read;
  const ledgerpermissions = permissions[3]?.read;
  const studentpermissions = permissions[2]?.read;
  const bulkpermissions = permissions[4]?.read;
  const batchpermissions = permissions[1]?.read;
  const degreepermissions = permissions[5]?.read;
  const statuspermissions = permissions[6]?.read;
  const feespermissions = permissions[8]?.read;

  // Check permission helper function
  const checkPermission = (type) => {
    if (admin === "admins") return true;
    const studentPermission = permissions?.find(
      (p) => p.pageName === "Student"
    );
    return studentPermission?.[type] || false;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsDrawerOpen(true);
      } else {
        setIsDrawerOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openDrawer = () => {
    setIsDrawerOpen(true);
    localStorage.setItem("isDrawerOpen", true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    localStorage.setItem("isDrawerOpen", false);
  };

  const hide1 = location.pathname === "/login";

  return (
    <div>
      <div className="app">
        {!hide1 && (
          <Navigation
            isDrawerOpen={isDrawerOpen}
            openDrawer={openDrawer}
            closeDrawer={closeDrawer}
          />
        )}
        <div className="flex">
          {!hide1 && (
            <Index isDrawerOpen={isDrawerOpen} closeDrawer={closeDrawer} />
          )}
          <div
            className={`flex-1 overflow-x-hidden transition-all duration-300 ${
              isDrawerOpen && !hide1 ? "md:ml-[120px]" : "ml-0"
            }`}
          >
            <Routes>
              <Route path="/login" element={<Login />}></Route>
              <Route path="*" element={<Dashboard />}></Route>

              <Route element={<Private />}>
                <Route path="/" element={<Dashboard />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/notifications" element={<Notification />}></Route>

                {/* Admin Routes - Only for admins */}
                {admin === "admins" && (
                  <>
                    <Route path="/group-role" element={<GroupPage />} />
                    <Route path="/permission" element={<PermissionPage />} />
                    <Route path="/members" element={<Member />} />
                    <Route path="/trash-students" element={<TrashStudent />} />
                  </>
                )}

                {/* Core Settings Routes - Based on permissions */}
                {(admin === "admins" || degreepermissions) && (
                  <Route path="/degree-type" element={<Degree />} />
                )}

                {(admin === "admins" || statuspermissions) && (
                  <Route path="/status" element={<Status />} />
                )}

                {(admin === "admins" || feespermissions) && (
                  <Route path="/fees-fields" element={<Feespage />} />
                )}

                {/* Academic Routes - Based on permissions */}
                {(admin === "admins" || coursepermissions) && (
                  <Route path="/course" element={<CoursePage />} />
                )}

                {(admin === "admins" || batchpermissions) && (
                  <Route path="/batch" element={<BatchPage />} />
                )}

                {/* Student Routes - Based on permissions */}
                {(admin === "admins" || studentpermissions) && (
                  <Route path="/student" element={<StudentPage />} />
                )}

                {(admin === "admins" || checkPermission("insert")) && (
                  <Route path="/create-student" element={<CreateStudent />} />
                )}

                <Route path="/student-ledger/:id" element={<StudentLedger />} />

                {/* Voucher Routes */}
                {studentName === "Students" && (
                  <Route path="/student-voucher" element={<StudentVoucher />} />
                )}

                {(admin === "admins" || bulkpermissions) && (
                  <Route path="/bulk-message" element={<BulkMessagePage />} />
                )}

                {(admin === "admins" || ledgerpermissions) && (
                  <Route path="/ledger" element={<LedgerPage />} />
                )}
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routess;
