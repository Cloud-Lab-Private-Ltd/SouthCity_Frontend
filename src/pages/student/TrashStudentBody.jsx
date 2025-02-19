import React, { useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { StudentsGet, TrashedStudentsGet } from "../../features/GroupApiSlice";
import { useNavigate } from "react-router-dom";
import StudentDetailsModal from "./StudentDetailsModal";

const TrashStudentBody = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { trashedStudents, trashedStudentsLoading } = useSelector(
    (state) => state.groupdata
  );

  // Add this state near the top of your component
  const [searchTerm, setSearchTerm] = useState("");

  // Add this filter function
  const filteredStudents = trashedStudents?.students?.filter(
    (student) =>
      student.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add these state variables
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

  // Add this handler function
  const handleViewDetails = (student) => {
    setSelectedStudentDetails(student);
    setViewDetailsOpen(true);
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  // Update the records calculation to use filtered students
  const records = filteredStudents?.slice(firstIndex, lastIndex);
  const npage = Math.ceil((filteredStudents?.length || 0) / recordsPerPage);

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

  const handleRestore = (id) => {
    axios
      .put(
        `${BASE_URL}/api/v1/sch/student-restore/${id}`,
        {},
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Student restored successfully!",
          confirmButtonColor: "#5570F1",
        });
        dispatch(StudentsGet());
        dispatch(TrashedStudentsGet());
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to restore student",
          confirmButtonColor: "#5570F1",
        });
      });
  };

  const handlePermanentDelete = (id) => {
    Swal.fire({
      title: "Enter Admin Password",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Enter admin password",
        autocomplete: "new-password",
        name: "admin-delete-password",
      },
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#5570F1",
      cancelButtonColor: "#d33",
      showLoaderOnConfirm: true,
      preConfirm: (adminPassword) => {
        if (!adminPassword) {
          Swal.showValidationMessage("Please enter admin password");
          return false;
        }
        return axios
          .delete(`${BASE_URL}/api/v1/sch/students/${id}`, {
            headers: {
              "x-access-token": token,
            },
            data: {
              adminPassword,
            },
          })
          .then((response) => {
            dispatch(StudentsGet());
            dispatch(TrashedStudentsGet());
            return response;
          })
          .catch((error) => {
            Swal.showValidationMessage(
              error.response?.data?.message || "Failed to delete student"
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Student has been permanently deleted.",
          icon: "success",
          confirmButtonColor: "#5570F1",
        });
      }
    });
  };

  return (
    <div className="bg-[#F5F5F5]">
      <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <div className="relative w-full md:w-auto">
          <h2 className="text-[1.5rem] font-semibold text-c-grays">
            TRASHED STUDENTS
          </h2>
        </div>
        <Button
          className="bg-red-500 flex items-center gap-2 min-w-[140px] shadow-md"
          onClick={() => navigate("/student")}
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
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>
          Back
        </Button>
      </div>
      <Card className="overflow-hidden bg-white">
        <div className="p-6">
          <div className="mb-4">
            <input
              type="text"
              className="w-full md:w-72 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              name="trash-student-search"
            />
          </div>
          {trashedStudentsLoading ? (
            <div className="flex justify-center items-center h-40">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : trashedStudents?.students?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              <Typography variant="h5" className="text-gray-700">
                No Items in Trash
              </Typography>
              <Typography className="text-gray-500 text-center">
                When you delete students, they will appear here
              </Typography>
            </div>
          ) : (
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
                        Actions
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records?.map((student) => (
                    <tr key={student?._id} className="hover:bg-gray-50">
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {student?.registrationId}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {student?.fullName}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {student?.email}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <div className="flex gap-2">
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
                          <Button
                            size="sm"
                            className="bg-green-500"
                            onClick={() => handleRestore(student._id)}
                          >
                            Restore
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-500"
                            onClick={() => handlePermanentDelete(student._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
          )}
        </div>
      </Card>
      {/* // Add the modal component at the bottom of the return statement */}
      <StudentDetailsModal
        open={viewDetailsOpen}
        handleOpen={() => setViewDetailsOpen(!viewDetailsOpen)}
        studentData={selectedStudentDetails}
      />
    </div>
  );
};

export default TrashStudentBody;
