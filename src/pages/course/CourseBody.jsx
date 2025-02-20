import { useState, useEffect, useRef } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import CourseDetailsModal from "./CourseDetailsModal";
import { CoursesGet } from "../../features/GroupApiSlice";
import EditCourseModal from "./EditCourseModal";

const CourseBody = () => {
  const [formData, setFormData] = useState({
    name: "",
    degreeType: "",
    duration: "",
    noOfSemesters: "",
    semesters: [{ semesterNo: "1", subjects: "" }],
    perSemesterFee: "",
    admissionFee: "",
    totalFee: "",
    Status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [degreeTypes, setDegreeTypes] = useState([]);
  const { fees, feesLoading } = useSelector((state) => state.groupdata);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  // Get semester and other fees
  const semesterFee =
    fees?.find((fee) => fee.feeType === "semester")?.amount || 0;
  const otherFee = fees?.find((fee) => fee.feeType === "other")?.amount || 0;

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
      }));

      // Recalculate total fee with new number of semesters
      const perSemFee = parseFloat(formData.perSemesterFee) || 0;
      const admFee = parseFloat(formData.admissionFee) || 0;
      const totalFee = perSemFee * numSemesters + admFee;

      setFormData({
        ...formData,
        [name]: value,
        semesters: newSemesters,
        totalFee: totalFee.toString(),
      });
    } else if (name === "perSemesterFee" || name === "admissionFee") {
      const updatedFormData = {
        ...formData,
        [name]: value,
      };

      const perSemFee =
        parseFloat(
          name === "perSemesterFee" ? value : formData.perSemesterFee
        ) || 0;
      const admFee =
        parseFloat(name === "admissionFee" ? value : formData.admissionFee) ||
        0;
      const numSemesters = parseInt(formData.noOfSemesters) || 0;

      const totalFee = perSemFee * numSemesters + admFee;

      updatedFormData.totalFee = totalFee.toString();
      setFormData(updatedFormData);
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
    setFormData({
      ...formData,
      semesters: updatedSemesters,
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
    formDataToSend.append(
      "perSemesterFee",
      fees?.find((fee) => fee.feeType === "semester")?._id
    );
    formDataToSend.append(
      "admissionFee",
      fees?.find((fee) => fee.feeType === "other")?._id
    );
    formDataToSend.append("totalFee", formData.totalFee);
    formDataToSend.append("Status", formData.Status);

    // Append Semesters data in array format
    formData.semesters.forEach((semester, index) => {
      formDataToSend.append(
        `Semesters[${index}][semesterNo]`,
        semester.semesterNo
      );
      formDataToSend.append(`Semesters[${index}][subjects]`, semester.subjects);
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
          text: "Course created successfully!",
          confirmButtonColor: "#5570F1",
        });
        setLoading(false);
        dispatch(CoursesGet());
        // Reset form
        setFormData({
          name: "",
          degreeType: "",
          duration: "",
          noOfSemesters: "",
          semesters: [{ semesterNo: "1", subjects: "" }],
          perSemesterFee: "",
          admissionFee: "",
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
          .delete(`${BASE_URL}/api/v1/sch/courses/${id}`, {
            headers: {
              "x-access-token": token,
            },
            data: {
              adminPassword,
            },
          })
          .then((response) => {
            dispatch(CoursesGet());
            return response;
          })
          .catch((error) => {
            Swal.showValidationMessage(
              error.response?.data?.message || "Failed to delete course"
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Course has been deleted successfully",
          icon: "success",
          confirmButtonColor: "#5570F1",
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
          text: "Courses imported successfully!",
          confirmButtonColor: "#5570F1",
        });
        dispatch(CoursesGet());
        setCSVFile(null);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to import courses",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

  const { courses, courseLoading } = useSelector((state) => state.groupdata);

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
    const coursePermission = permissions?.find((p) => p.pageName === "Course");
    return coursePermission?.[type] || false;
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
        <h2 className="text-[1.5rem] font-semibold text-c-grays">COURSES</h2>
      </div>
      {(admin === "admins" || checkPermission("insert")) && (
        <Card className="p-6 mb-8 bg-white">
          <div className="mb-6 flex flex-col md:flex-row justify-between  gap-4">
            <Typography className="text-xl font-semibold text-c-grays">
              Add Course
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
                  Course Name *
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
                      {type?.name} {type?.duration}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  placeholder="e.g. 4 years"
                  required
                />
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Per Semester Fee *
                </label>
                <input
                  type="number"
                  value={semesterFee}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Admission Fee *
                </label>
                <input
                  type="number"
                  value={otherFee}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  readOnly
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <Typography className="text-lg font-semibold text-c-grays mb-4">
                Semesters
              </Typography>
              {formData.semesters.map((semester, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  "Add Course"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
      <Card className="overflow-hidden bg-white">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography className="text-xl font-semibold text-c-grays">
            Courses List
          </Typography>
          <div className="flex gap-4">
            <Button className="bg-c-purple" onClick={handleExport}>
              Export Courses
            </Button>
            <div className="w-full md:w-72">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                placeholder="Search courses..."
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
                    Course Name
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Duration
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
