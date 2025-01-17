import { useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import BatchDetailsModal from "./BatchDetailsModal";
import { BatchesGet } from "../../features/GroupApiSlice";
import EditBatchModal from "./EditBatchModal";

const BatchBody = () => {
  const [formData, setFormData] = useState({
    batchName: "",
    course: "",
    startDate: "",
    endDate: "",
    totalSeats: "",
    availableSeats: "",
    currentSemester: "",
    status: "",
    schedule: [{ day: "", time: "" }],
    sessionType: "",
    batchCoordinator: "",
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  // Get courses data from Redux
  const { courses } = useSelector((state) => state.groupdata);
  // Get statuses data from Redux
  const { statuses } = useSelector((state) => state.groupdata);
  // Get members data from Redux
  const { members } = useSelector((state) => state.groupdata);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index][field] = value;
    setFormData({
      ...formData,
      schedule: updatedSchedule,
    });
  };

  const addSchedule = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: "", time: "" }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = {
      ...formData,
      course: [formData.course], // Convert to array as per API requirement
      availableSeats: formData.totalSeats, // Set initially equal to totalSeats
    };

    setLoading(true);
    axios
      .post(`${BASE_URL}/api/v1/sch/batches`, formDataToSend, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Batch created successfully!",
          confirmButtonColor: "#5570F1",
        });
        setLoading(false);
        dispatch(BatchesGet());
        setFormData({
          batchName: "",
          course: "",
          startDate: "",
          endDate: "",
          totalSeats: "",
          availableSeats: "",
          currentSemester: "",
          status: "",
          schedule: [{ day: "", time: "" }],
          sessionType: "",
          batchCoordinator: "",
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to create batch",
          confirmButtonColor: "#5570F1",
        });
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Enter Admin Password",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Enter admin password",
        autocomplete: "new-password",
        name: "batch-admin-delete-password",
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
          .delete(`${BASE_URL}/api/v1/sch/batches/${id}`, {
            headers: {
              "x-access-token": token,
            },
            data: {
              adminPassword,
            },
          })
          .then((response) => {
            dispatch(BatchesGet());
            return response;
          })
          .catch((error) => {
            Swal.showValidationMessage(
              error.response?.data?.message || "Failed to delete batch"
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Batch has been deleted successfully",
          icon: "success",
          confirmButtonColor: "#5570F1",
        });
      }
    });
  };

  const { batches, batchLoading } = useSelector((state) => state.groupdata);
  console.log(batches);

  // Add states for search and modal
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedBatchDetails, setSelectedBatchDetails] = useState(null);

  // Add handler for view details
  const handleViewDetails = (batch) => {
    setSelectedBatchDetails(batch);
    setViewDetailsOpen(true);
  };

  // Add filtered batches logic
  const filteredBatches = batches?.batches?.filter(
    (item) =>
      item.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Add handler
  const handleEdit = (batch) => {
    setSelectedBatch(batch);
    setEditModalOpen(true);
  };

  // Add pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredBatches?.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredBatches?.length / recordsPerPage);

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

  return (
    <div className="bg-[#F5F5F5]">
      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">BATCHES</h2>
      </div>
      <EditBatchModal
        open={editModalOpen}
        handleOpen={() => setEditModalOpen(!editModalOpen)}
        batchData={selectedBatch}
        token={token}
        onSuccess={() => dispatch(BatchesGet())}
      />
      <Card className="p-6 mb-8 bg-white">
        <Typography className="text-xl font-semibold text-c-grays mb-6">
          Add Batch
        </Typography>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Batch Name *
              </label>
              <input
                type="text"
                name="batchName"
                value={formData.batchName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Course *
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              >
                <option value="">Select Course</option>
                {courses?.courses?.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name} - {course.Status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              >
                <option value="">Select Status</option>
                {statuses?.statuses?.map((status) => (
                  <option key={status._id} value={status.name}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Batch Coordinator *
              </label>
              <select
                name="batchCoordinator"
                value={formData.batchCoordinator}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              >
                <option value="">Select Coordinator</option>
                {members?.members?.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.Name} - {member.group?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add other fields */}
            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Total Seats *
              </label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Current Semester *
              </label>
              <input
                type="number"
                name="currentSemester"
                value={formData.currentSemester}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Session Type *
              </label>
              <select
                name="sessionType"
                value={formData.sessionType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              >
                <option value="">Select Session Type</option>
                <option value="Regular">Regular</option>
                <option value="Weekend">Weekend</option>
              </select>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <Typography className="text-lg font-semibold text-c-grays">
                Schedule
              </Typography>
              <Button
                type="button"
                onClick={addSchedule}
                className="bg-c-purple"
              >
                Add Schedule
              </Button>
            </div>

            {formData.schedule.map((item, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-c-grays text-sm font-medium mb-2">
                      Day
                    </label>
                    <select
                      value={item.day}
                      onChange={(e) =>
                        handleScheduleChange(index, "day", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                    >
                      <option value="">Select Day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-c-grays text-sm font-medium mb-2">
                      Time
                    </label>
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) =>
                        handleScheduleChange(index, "time", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                      placeholder="e.g. 09:00 AM - 11:00 AM"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="bg-c-purple h-[45px] overflow-hidden flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-dots loading-lg"></span>
              ) : (
                "Add Batch"
              )}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden bg-white">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography className="text-xl font-semibold text-c-grays">
            Batches List
          </Typography>
          <div className="w-full md:w-72">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              name="batch-search"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Batch Name
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Course
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Status
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Session Type
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            {batchLoading ? (
              <tbody>
                {[1, 2, 3, 4, 5].map((index) => (
                  <tr key={index}>
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
                      <div className="skeleton h-4 w-32"></div>
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
                {records?.map((batch, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {batch.batchName}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {batch.course[0]?.name || "N/A"}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {batch.status}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {batch.sessionType}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-500"
                          onClick={() => handleViewDetails(batch)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-c-purple"
                          onClick={() => handleEdit(batch)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500"
                          onClick={() => handleDelete(batch._id)}
                        >
                          Delete
                        </Button>
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
      </Card>

      <BatchDetailsModal
        open={viewDetailsOpen}
        handleOpen={() => setViewDetailsOpen(!viewDetailsOpen)}
        batchData={selectedBatchDetails}
      />
    </div>
  );
};

export default BatchBody;
