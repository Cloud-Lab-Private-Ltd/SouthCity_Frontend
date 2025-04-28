import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faLayerGroup,
  faBook,
  faGraduationCap,
  faMoneyBill,
  faCreditCard,
  faMoneyBillTransfer,
} from "@fortawesome/free-solid-svg-icons";
import backImg from "../../assets/img/backgorund-card.jpg";
import bulkMessage from "../../assets/img/Bulk-Message.png";
import ledgerManagement from "../../assets/img/Ledger-Management.png";
import studentManagement from "../../assets/img/Student-Management.png";
import { useSelector } from "react-redux";

const AdminDashboard = ({
  groups,
  members,
  batches,
  courses,
  students,
  admin,
  batchpermissions,
  coursepermissions,
  studentpermissions,
  ledgerpermissions,
  bulkpermissions,
}) => {
  const navigate = useNavigate();

  // Get ledger data from Redux store
  const { allLedgers, allLedgersLoading } = useSelector(
    (state) => state.ledgerdata
  );

  // Filter out parent vouchers with isSplit: true (same logic as in LedgerBody.jsx)
  const nonSplitVouchers =
    allLedgers?.data?.filter((item) => !item.isSplit) || [];

  // Calculate totals (same logic as in LedgerBody.jsx)
  const totalAmount = nonSplitVouchers.reduce(
    (sum, item) => sum + (item.totalFee || 0),
    0
  );

  const totalPaid = nonSplitVouchers.reduce(
    (sum, item) => sum + (item.paidAmount || 0),
    0
  );

  const totalRemaining = nonSplitVouchers.reduce(
    (sum, item) => sum + (item.remainingAmount || 0),
    0
  );

  return (
    <>


      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 my-4">
        {(admin === "admins" || studentpermissions) && (
          <>
            <div
              onClick={() => navigate("/student")}
              className="transform hover:scale-105 transition-all cursor-pointer rounded-xl p-6 shadow-sm overflow-hidden"
              style={{
                backgroundImage: `url(${backImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-red-600 rounded-full p-4 w-24 h-24 flex items-center justify-center">
                    <img
                      src={studentManagement}
                      alt="Student Management"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium text-gray-600 drop-shadow-lg">
                    Student
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 drop-shadow-lg">
                    Management
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {(admin === "admins" || ledgerpermissions) && (
          <>
            {/* Ledger Management Card */}
            <div
              onClick={() => navigate("/ledger")}
              className="transform hover:scale-105 transition-all cursor-pointer rounded-xl p-6 shadow-sm overflow-hidden"
              style={{
                backgroundImage: `url(${backImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-red-600 rounded-full p-4 w-24 h-24 flex items-center justify-center">
                    <img
                      src={ledgerManagement}
                      alt="Ledger Management"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium text-gray-600 drop-shadow-lg">
                    Ledger
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 drop-shadow-lg">
                    Management
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {(admin === "admins" || bulkpermissions) && (
          <>
            {/* Bulk Message Card */}
            <div
              onClick={() => navigate("/bulk-message")}
              className="transform hover:scale-105 transition-all cursor-pointer rounded-xl p-6 shadow-sm overflow-hidden"
              style={{
                backgroundImage: `url(${backImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-red-600 rounded-full p-4 w-24 h-24 flex items-center justify-center">
                    <img
                      src={bulkMessage}
                      alt="Bulk Message"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium text-gray-600 drop-shadow-lg">
                    Bulk
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 drop-shadow-lg">
                    Message
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {(admin === "admins" || ledgerpermissions) && (
          <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {/* Total Amount */}
            <div
              className="bg-[#1EBC8C] rounded-xl p-6 shadow-lg text-white cursor-pointer transform hover:scale-105 transition-all"
              onClick={() => navigate("/ledger")}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">Total Amount</p>
                  <h3 className="text-2xl font-bold mt-2 truncate">
                    {allLedgersLoading ? (
                      <span className="text-xl">Loading...</span>
                    ) : (
                      `Rs. ${totalAmount.toLocaleString()}`
                    )}
                  </h3>
                </div>
                <div className="bg-white rounded-full p-3 flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faMoneyBill}
                    className="text-[#1EBC8C] text-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Total Paid */}
            <div
              className="bg-indigo-600 rounded-xl p-6 shadow-lg text-white cursor-pointer transform hover:scale-105 transition-all"
              onClick={() => navigate("/ledger")}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">Total Paid</p>
                  <h3 className="text-2xl font-bold mt-2 truncate">
                    {allLedgersLoading ? (
                      <span className="text-xl">Loading...</span>
                    ) : (
                      `Rs. ${totalPaid.toLocaleString()}`
                    )}
                  </h3>
                </div>
                <div className="bg-white rounded-full p-3 flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="text-indigo-600 text-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Total Remaining */}
            <div
              className="bg-cyan-500 rounded-xl p-6 shadow-lg text-white cursor-pointer transform hover:scale-105 transition-all"
              onClick={() => navigate("/ledger")}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">Total Remaining</p>
                  <h3 className="text-2xl font-bold mt-2 truncate">
                    {allLedgersLoading ? (
                      <span className="text-xl">Loading...</span>
                    ) : (
                      `Rs. ${totalRemaining.toLocaleString()}`
                    )}
                  </h3>
                </div>
                <div className="bg-white rounded-full p-3 flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faMoneyBillTransfer}
                    className="text-cyan-500 text-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {admin === "admins" && (
            <>
              {/* Total Groups */}
              <div
                onClick={() => navigate("/group-role")}
                className="transform hover:scale-105 transition-all cursor-pointer bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="text-red-600 text-2xl"
                    />
                  </div>
                  <span className="text-red-600 text-sm font-medium px-2.5 py-0.5 rounded-lg bg-red-100">
                    Active
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-3xl font-bold text-gray-700">
                    {groups?.groups?.length || 0}
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm">Total Groups</p>
                </div>
              </div>
            </>
          )}

          {admin === "admins" && (
            <>
              {/* Total Faculty */}
              <div
                onClick={() => navigate("/members")}
                className="transform hover:scale-105 transition-all cursor-pointer bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="text-red-600 text-2xl"
                    />
                  </div>
                  <span className="text-red-600 text-sm font-medium px-2.5 py-0.5 rounded-lg bg-red-100">
                    Active
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-3xl font-bold text-gray-700">
                    {members?.members?.length || 0}
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm">Total Faculty</p>
                </div>
              </div>
            </>
          )}

          {(admin === "admins" || coursepermissions) && (
            <>
              {/* Total Programs */}
              <div
                onClick={() => navigate("/course")}
                className="transform hover:scale-105 transition-all cursor-pointer bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <FontAwesomeIcon
                      icon={faBook}
                      className="text-red-600 text-2xl"
                    />
                  </div>
                  <span className="text-red-600 text-sm font-medium px-2.5 py-0.5 rounded-lg bg-red-100">
                    Active
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-3xl font-bold text-gray-700">
                    {courses?.courses?.length || 0}
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm">Total Programs</p>
                </div>
              </div>
            </>
          )}
          {(admin === "admins" || batchpermissions) && (
            <>
              {/* Batches Card */}
              <div
                onClick={() => navigate("/batch")}
                className="transform hover:scale-105 transition-all cursor-pointer bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <FontAwesomeIcon
                      icon={faLayerGroup}
                      className="text-red-600 text-2xl"
                    />
                  </div>
                  <span className="text-red-600 text-sm font-medium px-2.5 py-0.5 rounded-lg bg-red-100">
                    Active
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-3xl font-bold text-gray-700">
                    {batches?.batches?.length || 0}
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm">Total Batches</p>
                </div>
              </div>
            </>
          )}

          {(admin === "admins" || studentpermissions) && (
            <div
              onClick={() => navigate("/student")}
              className="transform hover:scale-105 transition-all cursor-pointer bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div className="bg-red-100 p-3 rounded-lg">
                  <FontAwesomeIcon
                    icon={faGraduationCap}
                    className="text-red-600 text-2xl"
                  />
                </div>
                <span className="text-red-600 text-sm font-medium px-2.5 py-0.5 rounded-lg bg-red-100">
                  Active
                </span>
              </div>
              <div className="mt-6">
                <h3 className="text-3xl font-bold text-gray-700">
                  {students?.students?.length || 0}
                </h3>
                <p className="text-gray-500 mt-1 text-sm">Total Students</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
