import { useRef, useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import BatchDetailsModal from "./BatchDetailsModal";
import { BatchesGet, NotificationsGet } from "../../features/GroupApiSlice";
import EditBatchModal from "./EditBatchModal";

const BatchBody = () => {
  const [formData, setFormData] = useState({
    batchName: "",
    course: [],
    startDate: "",
    endDate: "",
    status: "",
    sessionType: "",
    batchCoordinator: "",
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  // Get members data from Redux
  const { members } = useSelector((state) => state.groupdata);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = {
      ...formData,
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
        dispatch(NotificationsGet());
        setFormData({
          batchName: "",
          course: [],
          startDate: "",
          endDate: "",
          status: "",
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
      confirmButtonText: "Next",
      confirmButtonColor: "#5570F1",
      cancelButtonColor: "#d33",
      showLoaderOnConfirm: true,
      preConfirm: (adminPassword) => {
        if (!adminPassword) {
          Swal.showValidationMessage("Please enter admin password");
          return false;
        }
        // Store the password for the next step
        return adminPassword;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        // Second confirmation step
        Swal.fire({
          title: "Permanent Deletion",
          text: "This batch will be permanently deleted. This action cannot be undone. Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel",
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
        }).then((finalResult) => {
          if (finalResult.isConfirmed) {
            // Now proceed with the actual deletion
            Swal.showLoading();
            axios
              .delete(`${BASE_URL}/api/v1/sch/batches/${id}`, {
                headers: {
                  "x-access-token": token,
                },
                data: {
                  adminPassword: result.value, // Use the password from the first step
                },
              })
              .then((response) => {
                dispatch(BatchesGet());
                dispatch(NotificationsGet());

                Swal.fire({
                  title: "Deleted!",
                  text: "Batch has been deleted successfully",
                  icon: "success",
                  confirmButtonColor: "#5570F1",
                });
              })
              .catch((error) => {
                Swal.fire({
                  title: "Error!",
                  text:
                    error.response?.data?.message || "Failed to delete batch",
                  icon: "error",
                  confirmButtonColor: "#5570F1",
                });
              });
          }
        });
      }
    });
  };

  const [csvFile, setCSVFile] = useState(null);
  const fileInputRef = useRef(null);

  // Add this function to handle file upload
  const handleBulkUpload = async () => {
    if (!csvFile) {
      Swal.fire({
        icon: "warning",
        title: "File Required",
        text: "Please select a CSV file",
        confirmButtonColor: "#5570F1",
      });
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", csvFile);

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/sch/import/batch`,
        formData,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Batches imported successfully!",
          confirmButtonColor: "#5570F1",
        });
        dispatch(BatchesGet());
        setCSVFile(null);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to import batches",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

  const { batches, batchLoading } = useSelector((state) => state.groupdata);
  const { member } = useSelector((state) => state?.profiledata?.profile);
  const isAdmin = member?.group?.name === "admins";
  const currentUserId = member?._id;

  // Add states for search and modal
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedBatchDetails, setSelectedBatchDetails] = useState(null);

  // Add handler for view details
  const handleViewDetails = (batch) => {
    setSelectedBatchDetails(batch);
    setViewDetailsOpen(true);
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Add this function to handle course addition
  const handleAddCourse = () => {
    if (selectedCourseId && !formData.course.includes(selectedCourseId)) {
      setFormData({
        ...formData,
        course: [...formData.course, selectedCourseId],
      });
      setSelectedCourseId(""); // Reset selection after adding
    }
  };

  // Add handler
  const handleEdit = (batch) => {
    setSelectedBatch(batch);
    setEditModalOpen(true);
  };

  const coordinatorOptions = members?.members
    ?.filter(
      (member) => member.group?.name === "Coordinator" && !member.blocked
    )
    .map((member) => (
      <option key={member._id} value={member._id}>
        {member.Name} - {member.staffId}
      </option>
    ));

  // Add remove schedule function
  const removeSchedule = (indexToRemove) => {
    setFormData({
      ...formData,
      schedule: formData.schedule.filter((_, index) => index !== indexToRemove),
    });
  };

  // Add this function inside BatchBody component
  const handleExport = () => {
    window.open(`${BASE_URL}/api/v1/sch/batch-export`, "_blank");
  };

  // Then modify the filteredBatches logic
  const filteredBatches = batches?.batches?.filter((item) => {
    // First apply the search filter
    const matchesSearch =
      item.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase());

    // If user is admin, show all batches that match search
    if (isAdmin) {
      return matchesSearch;
    }

    // If user is coordinator, only show batches where they are the coordinator
    return matchesSearch && item.batchCoordinator === currentUserId;
  });

  // Add pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredBatches?.slice(firstIndex, lastIndex) || [];
  const npage = filteredBatches?.length
    ? Math.ceil(filteredBatches.length / recordsPerPage)
    : 1;

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

  // Add at the top with other imports
  const { permissions } = useSelector(
    (state) => state.profiledata?.profile?.member?.group || {}
  );
  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name
  );

  // Add permission check function
  const checkPermission = (type) => {
    if (admin === "admins") return true;
    const batchPermission = permissions?.find((p) => p.pageName === "Batch");
    return batchPermission?.[type] || false;
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
      {(admin === "admins" || checkPermission("insert")) && (
        <Card className="p-6 mb-8 bg-white">
          <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
            <Typography className="text-xl font-semibold text-c-grays">
              Add Batch
            </Typography>
            <div className="flex flex-wrap gap-4 items-center">
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={(e) => setCSVFile(e.target.files[0])}
                className="hidden"
              />
              <Button
                className="bg-c-purple w-full md:w-auto"
                onClick={() => fileInputRef.current.click()}
              >
                Select CSV
              </Button>
              <Button
                className="bg-c-purple w-full h-[45px] flex items-center justify-center overflow-hidden md:w-auto"
                onClick={handleBulkUpload}
                disabled={loading || !csvFile}
              >
                {loading ? (
                  <span className="loading loading-dots loading-lg"></span>
                ) : (
                  "Import CSV"
                )}
              </Button>
            </div>
          </div>

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
                  <option value={"Active"}>{"Active"}</option>
                  <option value={"Inactive"}>{"Inactive"}</option>
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
                  {coordinatorOptions}
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
      )}
      <Card className="overflow-hidden bg-white">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography className="text-xl font-semibold text-c-grays">
            Batches List
          </Typography>
          <div className="flex gap-4">
            <Button className="bg-c-purple" onClick={handleExport}>
              Export Batches
            </Button>
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
                    Number Of students
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
                      <div className="skeleton h-4 w-32"></div>
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
                        {batch.status}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {batch.sessionType}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {batch.numberOfStudents}
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
                        {(admin === "admins" || checkPermission("update")) && (
                          <Button
                            size="sm"
                            className="bg-c-purple"
                            onClick={() => handleEdit(batch)}
                          >
                            Edit
                          </Button>
                        )}
                        {(admin === "admins" || checkPermission("delete")) && (
                          <Button
                            size="sm"
                            className="bg-red-500"
                            onClick={() => handleDelete(batch._id)}
                          >
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
            {filteredBatches?.length
              ? `Page ${currentPage} of ${npage}`
              : "No data available"}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              className="text-c-purple border-c-purple"
              onClick={prePage}
              disabled={currentPage === 1 || !filteredBatches?.length}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              className="text-c-purple border-c-purple"
              onClick={nextPage}
              disabled={currentPage === npage || !filteredBatches?.length}
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
