import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AreaChartHero } from "./AreaChart";

const DashCard = () => {
  const navigate = useNavigate();
  const { groups, members, batches, courses, students } = useSelector(
    (state) => state.groupdata
  );

  return (
    <div>
      <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 my-4">
        {/* Groups Card */}
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

        {/* Members Card */}
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
              <p className="text-c-grays mt-1 text-sm">Total Members</p>
            </div>
          </div>
        </div>

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
              <p className="text-c-grays mt-1 text-sm">Total Courses</p>
            </div>
          </div>
        </div>
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
              <p className="text-c-grays mt-1 text-sm">Total Students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
        <AreaChartHero />
      </div>
    </div>
  );
};

export default DashCard;
