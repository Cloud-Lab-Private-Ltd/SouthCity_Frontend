import { useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { StudentsGet } from "../../features/GroupApiSlice";
import { useNavigate } from "react-router-dom";
import StudentDetailsModal from "./StudentDetailsModal";
import Swal from "sweetalert2";
import axios from "axios";

const StudentBody = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { students, studentLoading } = useSelector((state) => state.groupdata);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

  // Add permission check
  const { permissions } = useSelector(
    (state) => state.profiledata?.profile?.member?.group || {}
  );
  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name
  );

  const checkPermission = (type) => {
    if (admin === "admins") return true;
    const studentPermission = permissions?.find(
      (p) => p.pageName === "Student"
    );
    return studentPermission?.[type] || false;
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  const filteredStudents = students?.students?.filter(
    (item) =>
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.registrationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const records = filteredStudents?.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredStudents?.length / recordsPerPage);

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudentDetails(student);
    setViewDetailsOpen(true);
  };

  const handleExport = () => {
    window.open(`${BASE_URL}/api/v1/sch/student-export`, "_blank");
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This student will be moved to trash!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, move to trash",
      confirmButtonColor: "#5570F1",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `${BASE_URL}/api/v1/sch/student-trash/${id}`,
            {},
            {
              headers: {
                "x-access-token": token,
              },
            }
          )
          .then(() => {
            Swal.fire({
              title: "Moved to Trash!",
              text: "Student has been moved to trash successfully",
              icon: "success",
              confirmButtonColor: "#5570F1",
            });
            dispatch(StudentsGet());
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text:
                error.response?.data?.message ||
                "Failed to move student to trash",
              confirmButtonColor: "#5570F1",
            });
          });
      }
    });
  };

  return (
    <div className="bg-[#F5F5F5]">
      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">STUDENTS</h2>
      </div>

      <Card className="overflow-hidden bg-white">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <Typography className="text-xl font-semibold text-c-grays">
              Students List
            </Typography>

            <div className="flex flex-wrap items-center gap-3">
              {(admin === "admins" || checkPermission("insert")) && (
                <Button
                  className="bg-c-purple flex items-center gap-2 min-w-[140px] shadow-md"
                  onClick={() => navigate("/create-student")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Create Student
                </Button>
              )}

              <Button
                className="bg-c-purple flex items-center gap-2 min-w-[140px] shadow-md"
                onClick={handleExport}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Export
              </Button>

              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Registration ID
                    </Typography>
                  </th>
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Full Name
                    </Typography>
                  </th>
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Email
                    </Typography>
                  </th>
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Phone Number
                    </Typography>
                  </th>
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Verified Student
                    </Typography>
                  </th>
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Actions
                    </Typography>
                  </th>
                </tr>
              </thead>
              {studentLoading ? (
                <tbody>
                  {[1, 2, 3, 4, 5].map((index) => (
                    <tr key={index}>
                      <td className="p-4 border-b border-gray-100">
                        <div className="skeleton h-4 w-32"></div>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <div className="skeleton h-4 w-48"></div>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <div className="skeleton h-4 w-48"></div>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <div className="skeleton h-4 w-32"></div>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <div className="skeleton h-4 w-24"></div>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <div className="flex gap-2">
                          <div className="skeleton h-8 w-16"></div>
                          <div className="skeleton h-8 w-16"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  {records?.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {student.registrationId}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {student.fullName}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {student.email}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {student.phoneNumber}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.verified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {student.verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-500 flex items-center gap-1"
                            onClick={() => handleViewDetails(student)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            View
                          </Button>
                          {(admin === "admins" ||
                            checkPermission("delete")) && (
                            <Button
                              size="sm"
                              className="bg-red-500 flex items-center gap-1"
                              onClick={() => handleDelete(student._id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          <div className="p-4 flex items-center justify-between border-t border-gray-100">
            <Typography className="text-c-grays">
              Page {currentPage} of {npage}
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                size="sm"
                className="text-c-purple border-c-purple"
                onClick={prePage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                size="sm"
                className="text-c-purple border-c-purple"
                onClick={nextPage}
                disabled={currentPage === npage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <StudentDetailsModal
        open={viewDetailsOpen}
        handleOpen={() => setViewDetailsOpen(!viewDetailsOpen)}
        studentData={selectedStudentDetails}
      />
    </div>
  );
};

export default StudentBody;
