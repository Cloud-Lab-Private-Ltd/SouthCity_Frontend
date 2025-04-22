import { useState, useRef, useEffect } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import Select from "react-select";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { StudentsGet } from "../../features/GroupApiSlice";
import { useNavigate } from "react-router-dom";

const CreateStudent = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { batches } = useSelector((state) => state.groupdata);
  const [courseOptions, setCourseOptions] = useState([]);
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Add CSV upload handlers
  const [csvFile, setCSVFile] = useState(null);
  const [formData, setFormData] = useState({
    // Student Details
    fullName: "",
    email: "",
    nic: "",
    password: "",
    currentAddress: "",
    permanentAddress: "",
    mobileNumber: "",
    phoneNumber: "",
    gender: "",
    course: "",
    dob: "",
    nationality: "Pakistani",
    province: "",
    domicile: "",
    city: "",
    organization: "",
    higestQualification: "",
    batch: "",
    profileImage: null,
    enrollementNumber: "", // Added enrollment number field

    // Guardian Details
    fatherName: "",
    relationShip: "",
    fatherProfession: "",
    GuardianNIC: "",
    GuardianNationality: "",
    GuardianGender: "",
    GuardianPermenantAddress: "",
    GuardianCurrentAddress: "",
    GuardianPhoneNumber: "",
    GuardianMobileNumber: "",
    GuardianEmail: "",

    // Fee Details
    admissionFee: "",
    libraryFee: "",
    securityFee: "",

    verified: true,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
        navigate("/student");
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

  // For batch selection using react-select
  const batchOptions = batches?.batches?.map((batch) => ({
    value: batch._id,
    label: batch.batchName,
  }));

  useEffect(() => {
    if (formData.batch) {
      const selectedBatch = batches?.batches?.find(
        (batch) => batch._id === formData.batch
      );
      if (selectedBatch?.course) {
        const courseOpts = selectedBatch?.course.map((course) => ({
          value: course._id,
          label: `${course.name} - ${course.duration}`,
        }));
        setCourseOptions(courseOpts);
      }
    }
  }, [formData.batch, batches]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Form data ko copy karein
    const studentData = { ...formData };

    // Course ko array mein convert karein
    if (studentData.course) {
      studentData.course = [studentData.course];
    }

    // FormData object banayein
    const formDataToSend = new FormData();

    // Profile image ko alag se handle karein
    if (studentData.profileImage) {
      formDataToSend.append("profileImage", studentData.profileImage);
      delete studentData.profileImage;
    }

    // Baqi sari fields ko append karein
    Object.keys(studentData).forEach((key) => {
      if (key === "course") {
        // Course array ke har element ko alag se append karein
        studentData.course.forEach((courseId) => {
          formDataToSend.append("course[]", courseId);
        });
      } else {
        formDataToSend.append(key, studentData[key]);
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
      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Student created successfully!",
          confirmButtonColor: "#5570F1",
        });
        dispatch(StudentsGet());
        navigate("/student");
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          nic: "",
          password: "",
          fatherName: "",
          currentAddress: "",
          permanentAddress: "",
          mobileNumber: "",
          phoneNumber: "",
          gender: "",
          course: "",
          dob: "",
          nationality: "Pakistani",
          province: "",
          domicile: "",
          city: "",
          fatherProfession: "",
          verified: true,
          batch: "",
          profileImage: null,
          organization: "",
          higestQualification: "",
          admissionFee: "",
          libraryFee: "",
          securityFee: "",
          enrollementNumber: "",
          GuardianNIC: "",
          GuardianNationality: "",
          GuardianGender: "",
          GuardianPermenantAddress: "",
          GuardianCurrentAddress: "",
          GuardianPhoneNumber: "",
          GuardianMobileNumber: "",
          GuardianEmail: "",
          relationShip: "",
        });
      }
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

  return (
    <div className="bg-[#F5F5F5] min-h-screen p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-auto">
          <h2 className="text-[1.5rem] font-semibold text-c-grays">
            Create Student
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={(e) => setCSVFile(e.target.files[0])}
            className="hidden"
          />
          <Button
            className="bg-c-purple flex items-center gap-2 min-w-[140px] shadow-md"
            onClick={() => fileInputRef.current.click()}
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
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            Select CSV
          </Button>
          <Button
            className="bg-c-purple h-[45px] flex items-center gap-2 min-w-[140px] shadow-md"
            onClick={handleBulkUpload}
            disabled={loading || !csvFile}
          >
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              <>
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
                    d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                  />
                </svg>
                Import CSV
              </>
            )}
          </Button>
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
      </div>
      <Card className="p-6 bg-white">
        <form onSubmit={handleSubmit}>
          {/* Student Details Section */}
          <div className="mb-6">
            <Typography className="text-xl font-semibold text-c-grays mb-4 border-b pb-2">
              Student Details
            </Typography>
            <div className="grid grid-cols-12 gap-6">
              {/* Basic Information */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
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
              {/* Email */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
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
              {/* NIC */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  NIC *
                </label>
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleChange}
                  placeholder="12345-1234567-1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>
              {/* Enrollment Number */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Enrollment Number 
                </label>
                <input
                  type="text"
                  name="enrollementNumber"
                  value={formData.enrollementNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Password */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
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
              {/* Current Address */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Current Address *
                </label>
                <input
                  type="text"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>
              {/* Permanent Address */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Permanent Address
                </label>
                <input
                  type="text"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Mobile Number */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="0300-1234567"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>
              {/* Phone Number - Moved back to student section */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="021-1234567"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Gender */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              {/* Date of Birth */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
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
              {/* Organization */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Father Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Highest Qualification */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  name="higestQualification"
                  value={formData.higestQualification}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Province */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Province
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Domicile */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Domicile *
                </label>
                <input
                  type="text"
                  name="domicile"
                  value={formData.domicile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>
              {/* City */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Profile Image */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Profile Image{" "}
                  <span className="text-[11px] text-c-purple">
                    (JPG, PNG only)
                  </span>
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
                  accept=".jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Batch Selection */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Batch *
                </label>
                <Select
                  options={batchOptions}
                  value={batchOptions?.find(
                    (option) => option.value === formData.batch
                  )}
                  onChange={(selected) => {
                    setFormData({
                      ...formData,
                      batch: selected.value,
                      course: "", // Reset course when batch changes
                    });
                    // This will trigger the useEffect to load new courses
                  }}
                  styles={{
                    input: (base) => ({
                      ...base,
                      "input:focus": {
                        boxShadow: "none",
                      },
                    }),
                  }}
                  className="text-c-grays"
                  placeholder="Select Batch"
                  isSearchable
                  required
                />
              </div>
              {/* Programs Selection */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Programs *
                </label>
                <Select
                  options={courseOptions}
                  value={courseOptions.find(
                    (course) => course?.value === formData?.course
                  )}
                  onChange={(selected) => {
                    setFormData({
                      ...formData,
                      course: selected?.value,
                    });
                  }}
                  styles={{
                    input: (base) => ({
                      ...base,
                      "input:focus": {
                        boxShadow: "none",
                      },
                    }),
                  }}
                  className="text-c-grays"
                  required
                />
              </div>
            </div>
          </div>

          {/* Guardian Details Section - Updated with new fields */}
          <div className="mb-6">
            <Typography className="text-xl font-semibold text-c-grays mb-4 border-b pb-2">
              Guardian Details
            </Typography>
            <div className="grid grid-cols-12 gap-6">
              {/* Guardian Name */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Name *
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
              {/* Guardian Profession */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Profession
                </label>
                <input
                  type="text"
                  name="fatherProfession"
                  value={formData.fatherProfession}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Relationship
                </label>
                <input
                  type="text"
                  name="relationShip"
                  value={formData.relationShip}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Guardian NIC */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian NIC
                </label>
                <input
                  type="text"
                  name="GuardianNIC"
                  value={formData.GuardianNIC}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Guardian Nationality */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Nationality
                </label>
                <input
                  type="text"
                  name="GuardianNationality"
                  value={formData.GuardianNationality}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Guardian Gender */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Gender
                </label>
                <select
                  name="GuardianGender"
                  value={formData.GuardianGender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              {/* Guardian Permanent Address */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Permanent Address
                </label>
                <input
                  type="text"
                  name="GuardianPermenantAddress"
                  value={formData.GuardianPermenantAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Guardian Current Address */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Current Address
                </label>
                <input
                  type="text"
                  name="GuardianCurrentAddress"
                  value={formData.GuardianCurrentAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Guardian Phone Number */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Phone Number
                </label>
                <input
                  type="text"
                  name="GuardianPhoneNumber"
                  value={formData.GuardianPhoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Guardian Mobile Number */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Mobile Number
                </label>
                <input
                  type="text"
                  name="GuardianMobileNumber"
                  value={formData.GuardianMobileNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              {/* Guardian Email */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Email
                </label>
                <input
                  type="email"
                  name="GuardianEmail"
                  value={formData.GuardianEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
            </div>
          </div>

          {/* Fee Details Section */}
          <div className="mb-6">
            <Typography className="text-xl font-semibold text-c-grays mb-4 border-b pb-2">
              Fee Details
            </Typography>
            <div className="grid grid-cols-12 gap-6">
              {/* Admission Fee */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Admission Fee 
                </label>
                <input
                  type="number"
                  name="admissionFee"
                  value={formData.admissionFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
           
                />
              </div>
              {/* Library Fee */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Library Fee
                </label>
                <input
                  type="number"
                  name="libraryFee"
                  value={formData.libraryFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                
                />
              </div>
              {/* Security Fee */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Security Fee 
                </label>
                <input
                  type="number"
                  name="securityFee"
                  value={formData.securityFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="bg-c-purple h-[45px] flex items-center justify-center"
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
    </div>
  );
};

export default CreateStudent;
