import { useRef, useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import StudentDetailsModal from "./StudentDetailsModal";
import { StudentsGet } from "../../features/GroupApiSlice";
import Select from "react-select";
import EditStudentModal from "./EditStudentModal";
import { allCountries } from "../../assets/json data/allCountries";

const StudentBody = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    nic: "",
    password: "",
    fatherName: "",
    address: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    country: "Pakistan",
    city: "",
    course: [],
    fatherPhone_number: "",
    fatherOccupation: "",
    verified: false,
    profileImage: null,
    batch: "",
  });

  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const token = localStorage.getItem("token");
  const { batches } = useSelector((state) => state.groupdata);
  const { students, studentLoading } = useSelector((state) => state.groupdata);
  const dispatch = useDispatch();

  const selectStyles = {
    control: (base) => ({
      ...base,
      padding: "2px",
      borderColor: "#e5e7eb",
      "&:hover": {
        borderColor: "#6b21a8",
      },
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "#f3e8ff" : "white",
      color: "#111827",
      "&:hover": {
        backgroundColor: "#f3e8ff",
      },
    }),
  };

  // Get Pakistan cities from allCountries
  const pakistanCities =
    allCountries.find((country) => country.name === "Pakistan")?.cities || [];

  // Create city options for Select component
  const cityOptions = pakistanCities.map((city) => ({
    value: city,
    label: city,
  }));

  // Convert batches to react-select format
  const batchOptions = batches?.batches?.map((batch) => ({
    value: batch._id,
    label: `${batch.batchName} - ${batch.status}`,
  }));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBatchChange = (e) => {
    const selectedBatch = batches.batches.find(
      (batch) => batch._id === e.target.value
    );
    setFormData({
      ...formData,
      batch: e.target.value,
      course: [],
    });
    if (selectedBatch) {
      setCourseOptions(selectedBatch.course);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "profileImage" && formData[key]) {
        formDataToSend.append("profileImage", formData[key]);
      } else if (key === "course") {
        formData[key].forEach((courseId) => {
          formDataToSend.append("course[]", courseId);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/sch/student`,
        formDataToSend,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Student created successfully!",
        confirmButtonColor: "#5570F1",
      });

      dispatch(StudentsGet());

      setCourseOptions([]); // Clear course options

      setFormData({
        fullName: "",
        email: "",
        nic: "",
        password: "",
        fatherName: "",
        address: "",
        phoneNumber: "",
        gender: "",
        dob: "",
        country: "Pakistan",
        city: "", // This will clear the city select
        course: [], // This will clear course selection
        fatherPhone_number: "",
        fatherOccupation: "",
        verified: false,
        profileImage: null,
        batch: "", // This will clear the batch select
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to create student",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Enter Admin Password",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Enter admin password",
        autocomplete: "new-password",
        name: "student-admin-delete-password",
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
          text: "Student has been deleted successfully",
          icon: "success",
          confirmButtonColor: "#5570F1",
        });
      }
    });
  };

  // Add states
  const [csvFile, setCSVFile] = useState(null);
  const fileInputRef = useRef(null);

  // Add bulk upload handler
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
        `${BASE_URL}/api/v1/sch/import/student`,
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
          text: "Students imported successfully!",
          confirmButtonColor: "#5570F1",
        });
        dispatch(StudentsGet());
        setCSVFile(null);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to import students",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

  // Add the handler function
  const handleViewDetails = (student) => {
    setSelectedStudentDetails(student);
    setViewDetailsOpen(true);
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  // Add filtered students logic
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

  const { permissions } = useSelector(
    (state) => state.profiledata?.profile?.member?.group || {}
  );
  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name
  );

  // Add permission check function
  const checkPermission = (type) => {
    if (admin === "admins") return true;
    const studentPermission = permissions?.find(
      (p) => p.pageName === "Student"
    );
    return studentPermission?.[type] || false;
  };

  return (
    <div className="bg-[#F5F5F5]">
      <EditStudentModal
        open={editModalOpen}
        handleOpen={() => setEditModalOpen(!editModalOpen)}
        studentData={selectedStudent}
        token={token}
        onSuccess={() => dispatch(StudentsGet())}
      />
      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">STUDENTS</h2>
      </div>
      {(admin === "admins" || checkPermission("insert")) && (
        <Card className="p-6 mb-8 bg-white">
          <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
            <Typography className="text-xl font-semibold text-c-grays">
              Add Student
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
                  Select Batch *
                </label>
                <Select
                  name="batch"
                  value={batchOptions?.find(
                    (option) => option.value === formData.batch
                  )}
                  onChange={(selected) => {
                    const selectedBatch = batches.batches.find(
                      (batch) => batch._id === selected.value
                    );
                    setFormData({
                      ...formData,
                      batch: selected.value,
                      course: [],
                    });
                    if (selectedBatch) {
                      setCourseOptions(selectedBatch.course);
                    }
                  }}
                  options={batchOptions}
                  styles={selectStyles}
                  placeholder="Select Batch"
                  isSearchable
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  NIC *
                </label>
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Father Name *
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  City *
                </label>
                <Select
                  name="city"
                  value={cityOptions.find(
                    (option) => option.value === formData.city
                  )}
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      city: selected.value,
                    })
                  }
                  options={cityOptions}
                  styles={selectStyles}
                  placeholder="Select City"
                  isSearchable
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Father Phone Number *
                </label>
                <input
                  type="text"
                  name="fatherPhone_number"
                  value={formData.fatherPhone_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Father Occupation *
                </label>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profileImage: e.target.files[0],
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  accept="image/*"
                />
              </div>
            </div>

            <div className="mt-6 mb-6">
              <Typography className="text-lg font-semibold text-c-grays mb-4">
                Course Selection
              </Typography>
              <div className="w-full">
                <div className="relative">
                  <select
                    multiple
                    name="course"
                    value={formData.course}
                    onChange={(e) => {
                      const selectedOptions = Array.from(
                        e.target.selectedOptions
                      ).map((opt) => opt.value);
                      setFormData({
                        ...formData,
                        course: selectedOptions,
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple min-h-[150px] bg-white shadow-sm"
                    required
                  >
                    {courseOptions.map((course) => (
                      <option
                        key={course._id}
                        value={course._id}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                      >
                        {course.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {formData.course.map((courseId) => {
                      const selectedCourse = courseOptions.find(
                        (c) => c._id === courseId
                      );
                      return (
                        <span
                          key={courseId}
                          className="px-4 py-2 bg-c-purple text-white rounded-lg text-sm flex items-center gap-2 shadow-sm transition-all hover:bg-purple-700"
                        >
                          {selectedCourse?.name}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                course: formData.course.filter(
                                  (id) => id !== courseId
                                ),
                              });
                            }}
                            className="hover:text-red-300 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="verified"
                checked={formData.verified}
                onChange={(e) =>
                  setFormData({ ...formData, verified: e.target.checked })
                }
                className="mr-2"
              />
              <label className="text-c-grays text-sm font-medium">
                Verified Student
              </label>
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
                  "Create Student"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
      <Card className="overflow-hidden bg-white">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography className="text-xl font-semibold text-c-grays">
            Students List
          </Typography>
          <div className="w-full md:w-72">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              name="student-search"
            />
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-500"
                          onClick={() => handleViewDetails(student)}
                        >
                          View Details
                        </Button>
                        {(admin === "admins" || checkPermission("update")) && (
                          <Button
                            size="sm"
                            className="bg-c-purple"
                            onClick={() => handleEdit(student)}
                          >
                            Edit
                          </Button>
                        )}
                        {(admin === "admins" || checkPermission("delete")) && (
                          <Button
                            size="sm"
                            className="bg-red-500"
                            onClick={() => handleDelete(student._id)}
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
      <StudentDetailsModal
        open={viewDetailsOpen}
        handleOpen={() => setViewDetailsOpen(!viewDetailsOpen)}
        studentData={selectedStudentDetails}
      />
    </div>
  );
};

export default StudentBody;
