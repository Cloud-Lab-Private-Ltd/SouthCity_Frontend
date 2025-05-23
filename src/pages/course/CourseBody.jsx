import { useState, useEffect, useRef } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import CourseDetailsModal from "./CourseDetailsModal";
import { CoursesGet, NotificationsGet } from "../../features/GroupApiSlice";
import EditCourseModal from "./EditCourseModal";

const CourseBody = () => {
  const [formData, setFormData] = useState({
    name: "",
    degreeType: "",
    duration: "",
    noOfSemesters: "",
    semesters: [{ semesterNo: "1", subjects: "", semesterFees: "" }],
    totalFee: "",
    Status: "Active",
    batch: [], // Add this new field
  });

  const [loading, setLoading] = useState(false);
  const [degreeTypes, setDegreeTypes] = useState([]);
  const { fees } = useSelector((state) => state.groupdata);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    fetchDegreeTypes();
  }, []);

  const fetchDegreeTypes = () => {
    axios
      .get(`${BASE_URL}/api/v1/sch/degree-types`, {
        headers: { "x-access-token": token },
      })
      .then((res) => setDegreeTypes(res.data.degreeTypes))
      .catch((error) => console.error("Error fetching degree types:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "noOfSemesters") {
      const numSemesters = parseInt(value) || 0;
      const newSemesters = Array.from({ length: numSemesters }, (_, index) => ({
        semesterNo: (index + 1).toString(),
        subjects: formData.semesters[index]?.subjects || "",
        semesterFees: formData.semesters[index]?.semesterFees || "",
      }));

      // Calculate sum of all semester fees
      const totalSemesterFees = newSemesters.reduce((sum, semester) => {
        return sum + (parseFloat(semester.semesterFees) || 0);
      }, 0);

      // Add admission fee to get total fee
      const admFee = parseFloat(formData.admissionFee) || 0;
      const totalFee = totalSemesterFees + admFee;

      setFormData({
        ...formData,
        [name]: value,
        semesters: newSemesters,
        totalFee: totalFee.toString(),
      });
    } else if (name === "admissionFee") {
      // Calculate sum of all semester fees
      const totalSemesterFees = formData.semesters.reduce((sum, semester) => {
        return sum + (parseFloat(semester.semesterFees) || 0);
      }, 0);

      // Add new admission fee to get total fee
      const admFee = parseFloat(value) || 0;
      const totalFee = totalSemesterFees + admFee;

      setFormData({
        ...formData,
        [name]: value,
        totalFee: totalFee.toString(),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSemesterChange = (index, field, value) => {
    const updatedSemesters = [...formData.semesters];
    updatedSemesters[index][field] = value;

    // If the changed field is semesterFees, recalculate the total fee
    if (field === "semesterFees") {
      // Calculate sum of all semester fees
      const totalSemesterFees = updatedSemesters.reduce((sum, semester) => {
        return sum + (parseFloat(semester.semesterFees) || 0);
      }, 0);

      // Add admission fee to get total fee
      const admFee = parseFloat(formData.admissionFee) || 0;
      const totalFee = totalSemesterFees + admFee;

      setFormData({
        ...formData,
        semesters: updatedSemesters,
        totalFee: totalFee.toString(),
      });
    } else {
      setFormData({
        ...formData,
        semesters: updatedSemesters,
      });
    }
  };
  const handleAddBatch = () => {
    const selectedBatchId = document.getElementById("batchSelect").value;
    if (!selectedBatchId) return;

    // Find the batch name for display
    let selectedBatchName = "";
    if (Array.isArray(batches)) {
      const batch = batches.find((b) => b._id === selectedBatchId);
      selectedBatchName = batch?.batchName || "";
    } else if (batches?.batches && Array.isArray(batches.batches)) {
      const batch = batches.batches.find((b) => b._id === selectedBatchId);
      selectedBatchName = batch?.batchName || "";
    }

    // Only add if not already in the array
    if (!formData.batch.includes(selectedBatchId)) {
      setFormData({
        ...formData,
        batch: [...formData.batch, selectedBatchId],
        // Store batch names for display
        _batchNames: {
          ...formData._batchNames,
          [selectedBatchId]: selectedBatchName,
        },
      });
    }

    // Reset the dropdown
    document.getElementById("batchSelect").value = "";
  };
  const handleRemoveBatch = (batchId) => {
    setFormData({
      ...formData,
      batch: formData.batch.filter((id) => id !== batchId),
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    // Regular fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("degreeType", formData.degreeType);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("noOfSemesters", formData.noOfSemesters);
    formDataToSend.append("totalFee", formData.totalFee);
    formDataToSend.append("Status", formData.Status);
    formData.batch.forEach((batchId) => {
      formDataToSend.append("batch[]", batchId);
    });

    // In the handleSubmit function, update the formDataToSend.append for semesters:
    formData.semesters.forEach((semester, index) => {
      formDataToSend.append(
        `Semesters[${index}][semesterNo]`,
        semester.semesterNo
      );
      formDataToSend.append(`Semesters[${index}][subjects]`, semester.subjects);
      formDataToSend.append(
        `Semesters[${index}][semesterFees]`,
        semester.semesterFees
      );
    });

    setLoading(true);
    axios
      .post(`${BASE_URL}/api/v1/sch/courses`, formDataToSend, {
        headers: {
          "x-access-token": token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Programs created successfully!",
          confirmButtonColor: "#5570F1",
        });
        setLoading(false);
        dispatch(CoursesGet());
        dispatch(NotificationsGet());

        // Reset form
        setFormData({
          name: "",
          degreeType: "",
          duration: "",
          noOfSemesters: "",
          semesters: [{ semesterNo: "1", subjects: "", semesterFees: "" }],
          totalFee: "",
          Status: "Active",
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to create course",
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
        name: "course-admin-delete-password",
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
          text: "This program will be permanently deleted. This action cannot be undone. Are you sure?",
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
              .delete(`${BASE_URL}/api/v1/sch/courses/${id}`, {
                headers: {
                  "x-access-token": token,
                },
                data: {
                  adminPassword: result.value, // Use the password from the first step
                },
              })
              .then((response) => {
                dispatch(CoursesGet());
                dispatch(NotificationsGet());

                Swal.fire({
                  title: "Deleted!",
                  text: "Program has been deleted successfully",
                  icon: "success",
                  confirmButtonColor: "#5570F1",
                });
              })
              .catch((error) => {
                Swal.fire({
                  title: "Error!",
                  text:
                    error.response?.data?.message || "Failed to delete program",
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
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/v1/sch/import/course`,
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
          text: "Programs imported successfully!",
          confirmButtonColor: "#5570F1",
        });
        dispatch(CoursesGet());
        setCSVFile(null);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to import Programs",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

  const { courses, courseLoading } = useSelector((state) => state.groupdata);
  const { batches } = useSelector((state) => state.groupdata);

  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

  // Add handler for view details
  const handleViewDetails = (course) => {
    setSelectedCourseDetails(course);
    setViewDetailsOpen(true);
  };

  // Add these states at the top with other states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Add this filtering logic before the return statement
  const filteredCourses = courses?.courses?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Make sure these states are defined
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Add this function inside CourseBody component
  const handleExport = () => {
    window.open(`${BASE_URL}/api/v1/sch/course-export`, "_blank");
  };

  const handleOpen = () => setOpen(!open);

  const handleEdit = (course) => {
    setSelectedCourse(course);
    handleOpen();
  };

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredCourses?.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredCourses?.length / recordsPerPage);

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

  const { permissions } = useSelector(
    (state) => state.profiledata?.profile?.member?.group || {}
  );
  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name
  );

  // Add permission check function
  const checkPermission = (type) => {
    if (admin === "admins") return true;
    const coursePermission = permissions?.find(
      (p) => p.pageName === "Programs"
    );
    return coursePermission?.[type] || false;
  };
  const numberInputStyle = {
    /* Remove spinner arrows for Chrome, Safari, Edge, Opera */
    WebkitAppearance: "none",
    MozAppearance: "textfield",
    appearance: "textfield",
    /* For Firefox */
    margin: 0,
  };

  // Add this function inside your component
  const preventScroll = (e) => {
    e.target.blur();
  };
  return (
    <div className="bg-[#F5F5F5]">
      <EditCourseModal
        open={open}
        handleOpen={handleOpen}
        courseData={selectedCourse}
        token={token}
        onSuccess={() => dispatch(CoursesGet())}
      />

      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays uppercase">
          Programs
        </h2>
      </div>
      {(admin === "admins" || checkPermission("insert")) && (
        <Card className="p-6 mb-8 bg-white">
          <div className="mb-6 flex flex-col md:flex-row justify-between  gap-4">
            <Typography className="text-xl font-semibold text-c-grays">
              Add Programs
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
                  Programs Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  placeholder="Enter course name"
                  required
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Degree Type *
                </label>
                <select
                  name="degreeType"
                  value={formData.degreeType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                >
                  <option value="">Select Degree Type</option>
                  {degreeTypes.map((type) => (
                    <option key={type?._id} value={type?._id}>
                      {type?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Duration *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                >
                  <option value="">Select Duration</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="3 years">3 years</option>
                  <option value="4 years">4 years</option>
                  <option value="5 years">5 years</option>
                  <option value="6 years">6 years</option>
                  <option value="7 years">7 years</option>
                  <option value="8 years">8 years</option>
                  <option value="9 years">9 years</option>
                  <option value="10 years">10 years</option>
                </select>
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Number of Semesters *
                </label>
                <input
                  type="number"
                  name="noOfSemesters"
                  value={formData.noOfSemesters}
                  onChange={handleChange}
                  onWheel={preventScroll}
                  min="0"
                  step="any"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple no-spinner"
                  required
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Total Fee *
                </label>
                <input
                  type="number"
                  name="totalFee"
                  value={formData.totalFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Batches *
                </label>
                <div className="flex gap-2">
                  <select
                    id="batchSelect"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  >
                    <option value="">Select Batch</option>
                    {Array.isArray(batches) ? (
                      batches.map((batch) => (
                        <option key={batch._id} value={batch._id}>
                          {batch.batchName}
                        </option>
                      ))
                    ) : batches?.batches && Array.isArray(batches.batches) ? (
                      batches.batches.map((batch) => (
                        <option key={batch._id} value={batch._id}>
                          {batch.batchName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No batches available
                      </option>
                    )}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddBatch}
                    className="px-4 py-2 bg-c-purple text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Display selected batches */}
                {formData?.batch?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData?.batch?.map((batchId) => {
                      // Find batch name for display
                      let batchName = formData._batchNames?.[batchId] || "";
                      if (!batchName) {
                        if (Array.isArray(batches)) {
                          const batch = batches.find((b) => b._id === batchId);
                          batchName = batch?.batchName || batchId;
                        } else if (
                          batches?.batches &&
                          Array.isArray(batches.batches)
                        ) {
                          const batch = batches.batches.find(
                            (b) => b._id === batchId
                          );
                          batchName = batch?.batchName || batchId;
                        }
                      }

                      return (
                        <div
                          key={batchId}
                          className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                        >
                          <span className="text-sm">{batchName}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBatch(batchId)}
                            className="ml-2 text-gray-500 hover:text-red-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>
            <div className="mt-6">
              <Typography className="text-lg font-semibold text-c-grays mb-4">
                Semesters
              </Typography>
              {formData.semesters.map((semester, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-c-grays text-sm font-medium mb-2">
                        Semester No
                      </label>
                      <input
                        type="text"
                        value={semester.semesterNo}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-c-grays text-sm font-medium mb-2">
                        Subjects (comma separated)
                      </label>
                      <input
                        type="text"
                        value={semester.subjects}
                        onChange={(e) =>
                          handleSemesterChange(
                            index,
                            "subjects",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                        placeholder="e.g. Programming, Calculus, Physics"
                      />
                    </div>
                    <div>
                      <label className="block text-c-grays text-sm font-medium mb-2">
                        Semester Fee *
                      </label>
                      {/* <input
                        type="number"
                        value={semester.semesterFees}
                        onChange={(e) =>
                          handleSemesterChange(
                            index,
                            "semesterFees",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                        placeholder="Enter semester fee"
                        required
                      /> */}
                      <input
                        type="number"
                        value={semester.semesterFees}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || parseFloat(value) >= 0) {
                            handleSemesterChange(index, "semesterFees", value);
                          }
                        }}
                        onWheel={preventScroll}
                        min="0"
                        step="any"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple no-spinner"
                        placeholder="Enter semester fee"
                        required
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
                  "Add Programs"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
      <Card className="overflow-hidden bg-white">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography className="text-xl font-semibold text-c-grays">
            Programs List
          </Typography>
          <div className="flex gap-4">
            <Button className="bg-c-purple" onClick={handleExport}>
              Export Programs
            </Button>
            <div className="w-full md:w-72">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                placeholder="Search Programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                name="course-search"
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
                    Programs Name
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Duration
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Batch
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Status
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            {courseLoading ? (
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
                {records?.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {course.name}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {course.duration}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {Array.isArray(course?.batch)
                          ? course?.batch?.map((b) => b?.batchName).join(", ")
                          : course?.batch?.batchName || "N/A"}
                      </Typography>
                    </td>

                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {course.Status}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-500"
                          onClick={() => handleViewDetails(course)}
                        >
                          View Details
                        </Button>
                        {(admin === "admins" || checkPermission("update")) && (
                          <Button
                            size="sm"
                            className="bg-c-purple"
                            onClick={() => handleEdit(course)}
                          >
                            Edit
                          </Button>
                        )}
                        {(admin === "admins" || checkPermission("delete")) && (
                          <Button
                            size="sm"
                            className="bg-red-500"
                            onClick={() => handleDelete(course._id)}
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

      <CourseDetailsModal
        open={viewDetailsOpen}
        handleOpen={() => setViewDetailsOpen(!viewDetailsOpen)}
        courseData={selectedCourseDetails}
      />
    </div>
  );
};

export default CourseBody;
