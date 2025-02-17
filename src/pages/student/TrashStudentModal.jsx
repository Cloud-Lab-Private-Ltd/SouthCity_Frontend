import React, { useState, useEffect } from "react";
import { Button, Dialog, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { StudentsGet } from "../../features/GroupApiSlice";

const TrashStudentModal = ({ open, handleOpen, token }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { trashedStudents, trashedStudentsLoading } = useSelector(
    (state) => state.groupdata
  );

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
        fetchTrashedStudents();
        dispatch(StudentsGet());
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
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete permanently",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${BASE_URL}/api/v1/sch/student/${id}`, {
            headers: {
              "x-access-token": token,
            },
          })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Student has been permanently deleted.",
              confirmButtonColor: "#5570F1",
            });
            fetchTrashedStudents();
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response?.data?.message || "Failed to delete student",
              confirmButtonColor: "#5570F1",
            });
          });
      }
    });
  };

  return (
    <Dialog
      size="xl"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none z-[1000]" // Added z-index
    >
      <Card className="mx-auto w-full p-6 max-h-[80vh] overflow-y-auto">
        <Typography variant="h5" className="mb-6 text-c-grays">
          Trashed Students
        </Typography>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-dots loading-lg"></span>
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
                {trashedStudents?.students?.map((student) => (
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
          </div>
        )}
      </Card>
    </Dialog>
  );
};

export default TrashStudentModal;
