import React from "react";
import { MdDashboard, MdNotificationsActive } from "react-icons/md";
import { FaBook, FaUsers, FaLayerGroup, FaUserGraduate, FaUser, FaFileAlt } from "react-icons/fa";
import { GoPasskeyFill } from "react-icons/go";
import DashboardPieChart from '@/components/Charts/DashboardChart';
import DashboardTable from '@/components/Tables/DashboardTable';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
  buttonLabel: string;
}
const Card = ({ icon, title, count, color, buttonLabel }: CardProps) => (
  <div className="flex flex-col items-start w-full max-w-[290px] h-[150px] bg-white p-4 rounded-2xl border shadow-lg">
    <div className="flex items-center space-x-3">
      <div className="bg-gray-100 text-lg w-[3.5rem] h-[3.5rem] rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-xl font-medium mt-2">{title}</div>
        <div className="text-3xl font-bold">{count}</div>
      </div>
    </div>
    <button
      className={`mt-3 w-full px-4 py-1 text-white ${color} rounded-lg hover:opacity-90`}
    >
      {buttonLabel}
    </button>
  </div>
);

const Dashboard = () => {
  const data = [
    { title: "Course", count: 12, color: "bg-red-400", icon: <FaBook className="text-4xl text-red-500" /> },
    { title: "Batch", count: 20, color: "bg-indigo-400", icon: <FaLayerGroup className="text-4xl text-indigo-500" /> },
    { title: "Group/Role", count: 3, color: "bg-sky-400", icon: <FaUsers className="text-4xl text-sky-500" /> },
    { title: "Students", count: 2100, color: "bg-red-500", icon: <FaUserGraduate className="text-4xl text-red-600" /> },
    { title: "Member", count: 6, color: "bg-yellow-400", icon: <FaUser className="text-4xl text-yellow-500" /> },
    { title: "Voucher", count: 170, color: "bg-rose-300", icon: <FaFileAlt className="text-4xl text-rose-400" /> },
    { title: "Status", count: 9, color: "bg-green-400", icon: <GoPasskeyFill className="text-4xl text-green-500" /> },
    { title: "Notifications", count: 5, color: "bg-orange-400", icon: <MdNotificationsActive className="text-4xl text-orange-500" /> },
  ];

  const students = [
    { title: "Total Students", count: 2100, color: "bg-orange-100", icon: <MdDashboard className="text-3xl text-orange-500" /> },
    { title: "Active Students", count: 2055, color: "bg-green-100", icon: <FaUserGraduate className="text-3xl text-green-500" /> },
    { title: "Inactive Students", count: 30, color: "bg-yellow-100", icon: <FaUser className="text-3xl text-yellow-500" /> },
    { title: "Frozen Students", count: 15, color: "bg-purple-100", icon: <FaUser className="text-3xl text-purple-500" /> },
  ];

  return (
    <div className="px-4 space-y-4">
      <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700&display=swap" rel="stylesheet" />
      <h1 className="text-[33px] font-Epilogue font-semibold text-[#5d7285]">Dashboard</h1>

      {/* Top Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <Card
            key={index}
            icon={item.icon}
            title={item.title}
            count={item.count}
            color={item.color}
            buttonLabel="View All"
          />
        ))}
      </div>

      {/* Students Section */}
      <div className="p-6 bg-white rounded-2xl shadow-md border">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Students</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {students.map((student, index) => (
            <div
              key={index}
              className={`flex flex-col items-start ${student.color} p-4 rounded-lg`}
            >
              <div className="bg-gray-100 border rounded-full p-2 flex items-center justify-center">
                {student.icon}
              </div>
              <div className="text-3xl font-bold mt-2">{student.count}</div>
              <div className="text-lg font-medium text-gray-700">
                {student.title}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* dashboardChart */}
      <div className="w-[60rem] h-[27rem]">
        <DashboardPieChart/>
      </div>
      {/* DashboardTable */}
      <div className="bg-white rounded-lg drop-shadow-lg border">
        <DashboardTable/>
      </div>
    </div>
  );
};

export default Dashboard;
