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

  const [academicQualifications, setAcademicQualifications] = useState([
    {
      levelOfStudy: "",
      subjects: "",
      years: "",
      marksGrade: "",
      institutionName: "",
    },
  ]);

  // Add CSV upload handlers
  const [csvFile, setCSVFile] = useState(null);

  const [formData, setFormData] = useState({
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
    maritalStatus: "",
    relationShip: "",
    organization: "",
    higestQualification: "",
    nationality: "Pakistani",
    province: "",
    domicile: "",
    religion: "",
    city: "",
    fatherProfession: "",
    verified: true,
    batch: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addQualification = () => {
    setAcademicQualifications([
      ...academicQualifications,
      {
        levelOfStudy: "",
        subjects: "",
        years: "",
        marksGrade: "",
        institutionName: "",
      },
    ]);
  };

  const removeQualification = (index) => {
    const newQualifications = academicQualifications.filter(
      (_, i) => i !== index
    );
    setAcademicQualifications(newQualifications);
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

    const formDataToSend = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "profileImage" && formData[key]) {
        formDataToSend.append("profileImage", formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append academic qualifications
    academicQualifications.forEach((qual, index) => {
      Object.keys(qual).forEach((key) => {
        formDataToSend.append(
          `academicQualifications[${index}][${key}]`,
          qual[key]
        );
      });
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
          maritalStatus: "",
          relationShip: "",
          organization: "",
          higestQualification: "",
          nationality: "Pakistani",
          province: "",
          domicile: "",
          religion: "",
          city: "",
          fatherProfession: "",
          verified: true,
          batch: "",
          profileImage: null,
        });
        setAcademicQualifications([
          {
            levelOfStudy: "",
            subjects: "",
            years: "",
            marksGrade: "",
            institutionName: "",
          },
        ]);
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

            {/* Father Name */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
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
                Permanent Address *
              </label>
              <input
                type="text"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
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

            {/* Phone Number */}
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

            {/* Marital Status */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <label className="block text-c-grays text-sm font-medium mb-2">
                Marital Status *
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

            {/* Relationship */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <label className="block text-c-grays text-sm font-medium mb-2">
                Relationship *
              </label>
              <input
                type="text"
                name="relationShip"
                value={formData.relationShip}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            {/* Organization */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <label className="block text-c-grays text-sm font-medium mb-2">
                Organization *
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            {/* Highest Qualification */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <label className="block text-c-grays text-sm font-medium mb-2">
                Highest Qualification *
              </label>
              <input
                type="text"
                name="higestQualification"
                value={formData.higestQualification}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            {/* Province */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <label className="block text-c-grays text-sm font-medium mb-2">
                Province *
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
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

            {/* Religion */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <label className="block text-c-grays text-sm font-medium mb-2">
                Religion *
              </label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            {/* City */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <label className="block text-c-grays text-sm font-medium mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            {/* Father Profession */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <label className="block text-c-grays text-sm font-medium mb-2">
                Father Profession *
              </label>
              <input
                type="text"
                name="fatherProfession"
                value={formData.fatherProfession}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            {/* Profile Image */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <label className="block text-c-grays text-sm font-medium mb-2">
                Profile Image *{" "}
                <span className="text-[11px] text-c-purple">
                  (JPG, PNG only)
                </span>
              </label>
              <input
                type="file"
                name="profileImage"
                onChange={(e) =>
                  setFormData({ ...formData, profileImage: e.target.files[0] })
                }
                accept=".jpg,.jpeg,.png"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            {/* Batch Selection */}
            <div className="col-span-12">
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

            {/* Academic Qualifications Section */}
            <div className="col-span-12">
              <Typography className="text-lg font-semibold text-c-grays mb-4">
                Academic Qualifications
              </Typography>
              {academicQualifications.map((qual, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border rounded-lg"
                >
                  <div>
                    <label className="block text-c-grays text-sm font-medium mb-2">
                      Level of Study *
                    </label>
                    <input
                      type="text"
                      value={qual.levelOfStudy}
                      onChange={(e) => {
                        const newQuals = [...academicQualifications];
                        newQuals[index].levelOfStudy = e.target.value;
                        setAcademicQualifications(newQuals);
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-c-grays text-sm font-medium mb-2">
                      Subjects *
                    </label>
                    <input
                      type="text"
                      value={qual.subjects}
                      onChange={(e) => {
                        const newQuals = [...academicQualifications];
                        newQuals[index].subjects = e.target.value;
                        setAcademicQualifications(newQuals);
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-c-grays text-sm font-medium mb-2">
                      Years *
                    </label>
                    <input
                      type="text"
                      value={qual.years}
                      onChange={(e) => {
                        const newQuals = [...academicQualifications];
                        newQuals[index].years = e.target.value;
                        setAcademicQualifications(newQuals);
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-c-grays text-sm font-medium mb-2">
                      Marks/Grade *
                    </label>
                    <input
                      type="text"
                      value={qual.marksGrade}
                      onChange={(e) => {
                        const newQuals = [...academicQualifications];
                        newQuals[index].marksGrade = e.target.value;
                        setAcademicQualifications(newQuals);
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-c-grays text-sm font-medium mb-2">
                      Institution Name *
                    </label>
                    <input
                      type="text"
                      value={qual.institutionName}
                      onChange={(e) => {
                        const newQuals = [...academicQualifications];
                        newQuals[index].institutionName = e.target.value;
                        setAcademicQualifications(newQuals);
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeQualification(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              <Button
                type="button"
                onClick={addQualification}
                className="bg-c-purple mt-2"
              >
                Add Qualification
              </Button>
            </div>

            {/* Course Selection */}
            <div className="col-span-12">
              <label className="block text-c-grays text-sm font-medium mb-2">
                Course *
              </label>
              <Select
                options={courseOptions}
                value={courseOptions.find(
                  (course) => course?._id === formData?.course
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
