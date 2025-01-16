import React from "react";
import { AreaChartHero } from "./AreaChart";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DashCard = () => {
  const navigate = useNavigate();
  // const { profile } = useSelector((state) => state.profiledata);

  return (
    <div>
      <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 my-4">
        <div>
          <div className="w-[100%] mx-auto mb-3">
            <div className="bg-white shadow-lg dark:bg-d-back2 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-200 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-600 text-sm dark:text-d-text">
                    Total Users
                  </div>
                  <div className="text-gray-900 dark:text-white text-2xl font-semibold">
                    0
                    <span className="text-green-500 text-sm font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      122
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="w-full text-purple-600 bg-purple-100 hover:bg-purple-200 text-sm py-2 px-4 rounded-md transition duration-300 ease-in-out"
                onClick={() => navigate("/users")}
              >
                View all
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="w-[100% mx-auto mb-3">
            <div className="bg-white shadow-lg dark:bg-d-back2 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-200 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-600 text-sm dark:text-d-text">
                    Total Districts
                  </div>
                  <div className="text-gray-900 dark:text-white text-2xl font-semibold">
                 0
                    <span className="text-green-500 text-sm font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      122
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="w-full text-green-600 bg-green-100 hover:bg-green-200 text-sm py-2 px-4 rounded-md transition duration-300 ease-in-out"
                onClick={() => navigate("/district")}
              >
                View all
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="w-[100% mx-auto mb-3">
            <div className="bg-white shadow-lg dark:bg-d-back2 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-200 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-600 text-sm dark:text-d-text">
                    Total Bulletin Card
                  </div>
                  <div className="text-gray-900 dark:text-white text-2xl font-semibold">
                   0
                    <span className="text-green-500 text-sm font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      122
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="w-full text-red-600 bg-red-100 hover:bg-red-200 text-sm py-2 px-4 rounded-md transition duration-300 ease-in-out"
                onClick={() => navigate("/bulletin-card")}
              >
                View all
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="w-[100% mx-auto mb-3">
            <div className="bg-white shadow-lg dark:bg-d-back2 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-200 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.867 19.125h.008v.008h-.008v-.008Z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-600 text-sm dark:text-d-text">
                    Total Reconstruction
                  </div>
                  <div className="text-gray-900 dark:text-white text-2xl font-semibold">
                    0
                    <span className="text-green-500 text-sm font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      122
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="w-full text-yellow-900 bg-yellow-100 hover:bg-yellow-200 text-sm py-2 px-4 rounded-md transition duration-300 ease-in-out"
                onClick={() => navigate("/reconstruction-card")}
              >
                View all
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-c-white dark:bg-d-back2 w-[100%] rounded-lg min-h-[300px] mt-4 shadow-lg px-6 py-10">
        <div className="grid grid-cols-1">
          <AreaChartHero />
        </div>
      </div>
    </div>
  );
};

export default DashCard;
