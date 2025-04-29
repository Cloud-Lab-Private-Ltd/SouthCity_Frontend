import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AreaChartHero } from "./AreaChart";
import StudentFeeLedger from "./StudentFeeLedger";
import AdminDashboard from "./AdminDashboard";
import doctorImage from "../../assets/img/doctor.png"; // Add this image to your assets folder
import nurseImage from "../../assets/img/nurse.png"; // Add this image to your assets folder
import backImg from "../../assets/img/backgorund-card.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital } from "@fortawesome/free-solid-svg-icons";

const DashCard = () => {
  const navigate = useNavigate();
  const { groups, members, batches, courses, students } = useSelector(
    (state) => state.groupdata
  );

  const permissions = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.permissions || []
  );

  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name || []
  );

  // Check permissions for different modules
  const coursepermissions = permissions[0]?.read;
  const batchpermissions = permissions[1]?.read;
  const studentpermissions = permissions[2]?.read;
  const ledgerpermissions = permissions[3]?.read;
  const bulkpermissions = permissions[4]?.read;

  const { vouchers } = useSelector((state) => state.profiledata);
  const studentName = localStorage.getItem("groupName");

  // Filter out vouchers where isSplit is true
  const filteredVouchers = vouchers ? vouchers.filter((v) => !v.isSplit) : [];

  return (
    <div>
      {/* Enhanced Header Banner */}
      <div
        className="relative rounded-xl overflow-hidden shadow-lg mb-6"
        style={{
          backgroundImage: `url(${backImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "180px",
        }}
      >
        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/70 via-red-600/40 to-red-600/70"></div>

        {/* Left side doctor image - hidden on mobile */}
        <div className="absolute left-0 bottom-0 h-full hidden md:flex items-end">
          <img
            src={doctorImage}
            alt="Doctor"
            className="h-[160px] object-contain"
          />
        </div>

        {/* Right side nurse image - hidden on mobile
        <div className="absolute right-0 bottom-0 h-full hidden md:flex items-end">
          <img
            src={nurseImage}
            alt="Medical Staff"
            className="h-[160px] object-contain"
          />
        </div> */}

        {/* Center content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white rounded-full p-3 h-14 w-14 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faHospital}
                className="text-red-600 text-2xl"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center drop-shadow-lg">
            South City Institute of Medical Sciences
          </h1>
          <h2 className="text-lg text-white text-center drop-shadow-lg">
            Course Fee Management System
          </h2>
        </div>
      </div>
      {studentName === "Students" ? (
        <>
          {studentName === "Students" && (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mt-5">
              {/* Total Vouchers Card */}
              <div
                className="transform hover:scale-105 transition-all cursor-pointer"
                onClick={() => navigate("/student-voucher")}
              >
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div className="bg-[#5570F1]/10 p-3 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#5570F1]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-[#5570F1] text-sm font-medium px-2.5 py-0.5 rounded-lg bg-[#5570F1]/10">
                      Active
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-3xl font-bold text-gray-700">
                      {filteredVouchers.length || 0}
                    </h3>
                    <p className="text-c-grays mt-1 text-sm">Total Vouchers</p>
                  </div>
                </div>
              </div>
              {/* Pending Vouchers */}
              <div
                className="transform hover:scale-105 transition-all cursor-pointer"
                onClick={() => navigate("/student-voucher")}
              >
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-red-600 text-sm font-medium px-2.5 py-0.5 rounded-lg bg-red-100">
                      unpaid
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-3xl font-bold text-gray-700">
                      {filteredVouchers.filter((v) => v.status === "unpaid")
                        .length || 0}
                    </h3>
                    <p className="text-c-grays mt-1 text-sm">unpaid Vouchers</p>
                  </div>
                </div>
              </div>

              {/* Paid Vouchers */}
              <div
                className="transform hover:scale-105 transition-all cursor-pointer"
                onClick={() => navigate("/student-voucher")}
              >
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-green-600 text-sm font-medium px-2.5 py-0.5 rounded-lg bg-green-100">
                      Paid
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-3xl font-bold text-gray-700">
                      {filteredVouchers.filter((v) => v.status === "Paid")
                        .length || 0}
                    </h3>
                    <p className="text-c-grays mt-1 text-sm">Paid Vouchers</p>
                  </div>
                </div>
              </div>

              {/* Processing Vouchers Card */}
              <div
                className="transform hover:scale-105 transition-all cursor-pointer"
                onClick={() => navigate("/student-voucher")}
              >
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                    <span className="text-blue-600 text-sm font-medium px-2.5 py-0.5 rounded-lg bg-blue-100">
                      Processing
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-3xl font-bold text-gray-700">
                      {filteredVouchers.filter((v) => v.status === "Processing")
                        .length || 0}
                    </h3>
                    <p className="text-c-grays mt-1 text-sm">
                      Processing Vouchers
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Fee Amount */}
              <div
                className="transform hover:scale-105 transition-all cursor-pointer"
                onClick={() => navigate("/student-voucher")}
              >
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-purple-600 text-sm font-medium px-2.5 py-0.5 rounded-lg bg-purple-100">
                      Total
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-3xl font-bold text-gray-700">
                      Rs.{" "}
                      {filteredVouchers.reduce(
                        (sum, v) => sum + Number(v.totalFee),
                        0
                      ) || 0}
                    </h3>
                    <p className="text-c-grays mt-1 text-sm">
                      Total Fee Amount
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Use the StudentFeeLedger component with filtered vouchers */}
          {studentName === "Students" &&
            filteredVouchers &&
            filteredVouchers.length > 0 && (
              <StudentFeeLedger vouchers={filteredVouchers} />
            )}
        </>
      ) : (
        <AdminDashboard
          groups={groups}
          members={members}
          batches={batches}
          courses={courses}
          students={students}
          admin={admin}
          batchpermissions={batchpermissions}
          coursepermissions={coursepermissions}
          studentpermissions={studentpermissions}
          ledgerpermissions={ledgerpermissions}
          bulkpermissions={bulkpermissions}
        />
      )}

      {admin === "admins" ? (
        <>
          <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
            <AreaChartHero />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default DashCard;
