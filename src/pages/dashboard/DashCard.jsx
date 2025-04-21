import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AreaChartHero } from "./AreaChart";
// import UserStatusDashboard from "./UserStatusDashboard";

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

  const memberpermissions = permissions[0]?.read;
  const coursepermissions = permissions[1]?.read;
  const batchpermissions = permissions[2]?.read;
  const studentpermissions = permissions[3]?.read;
  const actionlogpermissions = permissions[5]?.read;

  const { vouchers } = useSelector((state) => state.profiledata);
  const studentName = localStorage.getItem("groupName");

  return (
    <div>
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
                      {vouchers?.length || 0}
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
                      {vouchers?.filter((v) => v.status === "unpaid").length ||
                        0}
                    </h3>
                    <p className="text-c-grays mt-1 text-sm">
                    unpaid Vouchers
                    </p>
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
                      {vouchers?.filter((v) => v.status === "Paid").length || 0}
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
                      {vouchers?.filter((v) => v.status === "Processing")
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
                      {vouchers?.reduce(
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
        </>
      ) : (
        <>
          <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 my-4">
            {admin === "admins" ? (
              <>
                <div
                  onClick={() => navigate("/group-role")}
                  className="transform hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#5570F1]/10 p-3 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-[#5570F1]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </div>
                      <span className="text-[#5570F1] text-sm font-medium px-2.5 py-0.5 rounded-lg bg-[#5570F1]/10">
                        Active
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-3xl font-bold text-gray-700">
                        {groups?.groups?.length || 0}
                      </h3>
                      <p className="text-c-grays mt-1 text-sm">Total Groups</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            {admin === "admins" ? (
              <>
                <div
                  onClick={() => navigate("/members")}
                  className="transform hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#5570F1]/10 p-3 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-[#5570F1]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                      </div>
                      <span className="text-[#5570F1] text-sm font-medium px-2.5 py-0.5 rounded-lg bg-[#5570F1]/10">
                        Active
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-3xl font-bold text-gray-700">
                        {members?.members?.length || 0}
                      </h3>
                      <p className="text-c-grays mt-1 text-sm">Total Faculty</p>
                    </div>
                  </div>
                </div>
              </>
            ) : memberpermissions ? (
              <>
                <div
                  onClick={() => navigate("/members")}
                  className="transform hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#5570F1]/10 p-3 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-[#5570F1]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                      </div>
                      <span className="text-[#5570F1] text-sm font-medium px-2.5 py-0.5 rounded-lg bg-[#5570F1]/10">
                        Active
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-3xl font-bold text-gray-700">
                        {members?.members?.length || 0}
                      </h3>
                      <p className="text-c-grays mt-1 text-sm">Total Faculty</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            {admin === "admins" ? (
              <>
                {/* Batches Card */}
                <div
                  onClick={() => navigate("/batch")}
                  className="transform hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#5570F1]/10 p-3 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-[#5570F1]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                      </div>
                      <span className="text-[#5570F1] text-sm font-medium px-2.5 py-0.5 rounded-lg bg-[#5570F1]/10">
                        Active
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-3xl font-bold text-gray-700">
                        {batches?.batches?.length || 0}
                      </h3>
                      <p className="text-c-grays mt-1 text-sm">Total Batches</p>
                    </div>
                  </div>
                </div>
              </>
            ) : batchpermissions ? (
              <>
                {/* Batches Card */}
                <div
                  onClick={() => navigate("/batch")}
                  className="transform hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#5570F1]/10 p-3 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-[#5570F1]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                      </div>
                      <span className="text-[#5570F1] text-sm font-medium px-2.5 py-0.5 rounded-lg bg-[#5570F1]/10">
                        Active
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-3xl font-bold text-gray-700">
                        {batches?.batches?.length || 0}
                      </h3>
                      <p className="text-c-grays mt-1 text-sm">Total Batches</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            {admin === "admins" ? (
              <>
                {/* Courses Card */}
                <div
                  onClick={() => navigate("/course")}
                  className="transform hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#5570F1]/10 p-3 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-[#5570F1]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                      <span className="text-[#5570F1] text-sm font-medium px-2.5 py-0.5 rounded-lg bg-[#5570F1]/10">
                        Active
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-3xl font-bold text-gray-700">
                        {courses?.courses?.length || 0}
                      </h3>
                      <p className="text-c-grays mt-1 text-sm">
                        Total Programs
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : coursepermissions ? (
              <>
                {/* Courses Card */}
                <div
                  onClick={() => navigate("/course")}
                  className="transform hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#5570F1]/10 p-3 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-[#5570F1]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                      <span className="text-[#5570F1] text-sm font-medium px-2.5 py-0.5 rounded-lg bg-[#5570F1]/10">
                        Active
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-3xl font-bold text-gray-700">
                        {courses?.courses?.length || 0}
                      </h3>
                      <p className="text-c-grays mt-1 text-sm">
                        Total Programs
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            {admin === "admins" ? (
              <>
                <div
                  onClick={() => navigate("/student")}
                  className="transform hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#5570F1]/10 p-3 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-[#5570F1]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                      </div>
                      <span className="text-[#5570F1] text-sm font-medium px-2.5 py-0.5 rounded-lg bg-[#5570F1]/10">
                        Active
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-3xl font-bold text-gray-700">
                        {students?.students?.length || 0}
                      </h3>
                      <p className="text-c-grays mt-1 text-sm">
                        Total Students
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : studentpermissions ? (
              <>
                <div
                  onClick={() => navigate("/student")}
                  className="transform hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#5570F1]/10 p-3 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-[#5570F1]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                      </div>
                      <span className="text-[#5570F1] text-sm font-medium px-2.5 py-0.5 rounded-lg bg-[#5570F1]/10">
                        Active
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-3xl font-bold text-gray-700">
                        {students?.students?.length || 0}
                      </h3>
                      <p className="text-c-grays mt-1 text-sm">
                        Total Students
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </>
      )}

      {/* {admin === "admins" ? (
        <>
          <UserStatusDashboard />
        </>
      ) : (
        ""
      )} */}

      {admin === "admins" ? (
        <>
          <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
            <AreaChartHero />
          </div>
        </>
      ) : actionlogpermissions ? (
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
