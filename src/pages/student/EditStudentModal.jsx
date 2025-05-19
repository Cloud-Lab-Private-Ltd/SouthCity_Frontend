import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Select from "react-select";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { NotificationsGet } from "../../features/GroupApiSlice";

const EditStudentModal = ({
  open,
  handleOpen,
  studentData,
  token,
  onSuccess,
}) => {
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
    enrollementNumber: "",

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

  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const [batchOptions, setBatchOptions] = useState([]);
  const { batches, courses } = useSelector((state) => state.groupdata);
  // const batchOptions = batches?.batches?.map((batch) => ({
  //   value: batch._id,
  //   label: batch.batchName,
  // }));

  const handleBatchChange = (selected) => {
    const selectedBatch = batches.batches.find(
      (batch) => batch._id === selected.value
    );
    setFormData({
      ...formData,
      batch: selected.value,
      course: "",
    });
    if (selectedBatch) {
      setCourseOptions(selectedBatch.course);
    }
  };
  const handleCourseChange = (selected) => {
    setFormData({
      ...formData,
      course: selected.value,
      batch: "", // Reset batch when course changes
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formDataToSend = new FormData();

    // Handle all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "password" && !formData[key]) {
        // Skip empty password field
      } else if (key === "course") {
        // Handle course as array
        if (formData[key]) {
          formDataToSend.append("course[]", formData[key]);
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Handle profile image if present
    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/sch/students/${studentData._id}`,
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
        text: "Student updated successfully!",
        confirmButtonColor: "#5570F1",
      });

      handleOpen();
      dispatch(NotificationsGet());

      onSuccess();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update student"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentData) {
      // Set form data with student data
      setFormData({
        fullName: studentData.fullName || "",
        email: studentData.email || "",
        nic: studentData.nic || "",
        password: "", // Password field is empty by default for security
        fatherName: studentData.fatherName || "",
        currentAddress: studentData.currentAddress || "",
        permanentAddress: studentData.permanentAddress || "",
        mobileNumber: studentData.mobileNumber || "",
        phoneNumber: studentData.phoneNumber || "",
        gender: studentData.gender || "",
        // Set course from the first course in the array (if exists)
        course:
          studentData.course && studentData.course.length > 0
            ? studentData.course[0]._id
            : "",
        dob: studentData.dob?.split("T")[0] || "",
        nationality: studentData.nationality || "Pakistani",
        province: studentData.province || "",
        domicile: studentData.domicile || "",
        city: studentData.city || "",
        organization: studentData.organization || "",
        higestQualification: studentData.higestQualification || "",
        fatherProfession: studentData.fatherProfession || "",
        relationShip: studentData.relationShip || "",
        verified: studentData.verified || false,
        // Set batch if it exists
        batch: studentData.batch?._id || "",
        enrollementNumber: studentData.enrollementNumber || "",
        // Guardian fields
        GuardianNIC: studentData.GuardianNIC || "",
        GuardianNationality: studentData.GuardianNationality || "",
        GuardianGender: studentData.GuardianGender || "",
        GuardianPermenantAddress: studentData.GuardianPermenantAddress || "",
        GuardianCurrentAddress: studentData.GuardianCurrentAddress || "",
        GuardianPhoneNumber: studentData.GuardianPhoneNumber || "",
        GuardianMobileNumber: studentData.GuardianMobileNumber || "",
        GuardianEmail: studentData.GuardianEmail || "",
        // Fee details
        admissionFee: studentData.admissionFee || "",
        libraryFee: studentData.libraryFee || "",
        securityFee: studentData.securityFee || "",
      });
    }
  }, [studentData]);
  // Add these console logs to debug the issue
  useEffect(() => {
    if (formData.course) {
      // Find the selected course from the courses array
      const selectedCourse = courses?.courses?.find(
        (course) => course._id === formData.course
      );

      // Check if the course has batches (as an array)
      if (
        selectedCourse?.batch &&
        Array.isArray(selectedCourse.batch) &&
        selectedCourse.batch.length > 0
      ) {
        console.log("Course batches:", selectedCourse.batch);

        // Check if batch contains objects or just IDs
        const batchContainsObjects =
          typeof selectedCourse.batch[0] === "object";

        if (batches?.batches && Array.isArray(batches.batches)) {
          console.log("All batches:", batches.batches);

          // Filter batches based on whether batch contains objects or IDs
          let filteredBatches;
          if (batchContainsObjects) {
            // If batch contains objects, extract IDs for comparison
            const batchIds = selectedCourse.batch.map((batch) => batch._id);
            filteredBatches = batches.batches.filter((batch) =>
              batchIds.includes(batch._id)
            );
          } else {
            // If batch contains IDs, use them directly
            filteredBatches = batches.batches.filter((batch) =>
              selectedCourse.batch.includes(batch._id)
            );
          }

          console.log("Filtered batches:", filteredBatches);

          // If we have the student's current batch but it's not in filtered batches, add it
          if (
            studentData.batch &&
            studentData.batch._id &&
            !filteredBatches.some(
              (batch) => batch._id === studentData.batch._id
            )
          ) {
            filteredBatches.push(studentData.batch);
          }

          // Map filtered batches to options for the dropdown
          const batchOpts = filteredBatches.map((batch) => ({
            value: batch._id,
            label: batch.batchName,
          }));

          console.log("Batch options:", batchOpts);
          setBatchOptions(batchOpts);
        } else {
          // If batches aren't available from the store, create an option for the student's current batch
          if (studentData.batch && studentData.batch._id) {
            setBatchOptions([
              {
                value: studentData.batch._id,
                label: studentData.batch.batchName,
              },
            ]);
          } else {
            setBatchOptions([]);
          }
        }
      } else {
        console.log("No batch array found in selected course");

        // Even if course has no batches, still show student's current batch
        if (studentData.batch && studentData.batch._id) {
          setBatchOptions([
            {
              value: studentData.batch._id,
              label: studentData.batch.batchName,
            },
          ]);
        } else {
          setBatchOptions([]);
        }
      }
    } else {
      console.log("No course selected");
      setBatchOptions([]);
    }
  }, [formData.course, courses, batches, studentData]);
  useEffect(() => {
    if (courses?.courses && Array.isArray(courses.courses)) {
      const options = courses.courses.map((course) => ({
        value: course._id,
        label: course.name,
      }));
      setCourseOptions(options);
    }
  }, [courses]);
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="min-w-[95%] md:min-w-[90%] lg:min-w-[85%] max-h-[95vh] overflow-y-auto"
      size="lg"
    >
      <DialogHeader className="flex justify-between items-center border-b bg-gray-50 sticky top-0 z-10">
        <Typography variant="h5" className="text-c-grays font-bold">
          Edit Student
        </Typography>
        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="text-c-grays hover:bg-gray-100"
        >
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </DialogHeader>

      <DialogBody className="overflow-y-auto p-6">
        <form onSubmit={handleSubmit}>
          {/* Student Details Section */}
          <div className="mb-6">
            <Typography className="text-xl font-semibold text-c-grays mb-4 border-b pb-2">
              Student Details
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  NIC *
                </label>
                <input
                  type="text"
                  value={formData.nic}
                  onChange={(e) => {
                    // Only allow digits and hyphens
                    const value = e.target.value.replace(/[^\d-]/g, "");

                    // Remove all hyphens first to handle user editing in the middle of the input
                    const digitsOnly = value.replace(/-/g, "");

                    // Format as XXXXX-XXXXXXX-X
                    let formattedValue = "";

                    if (digitsOnly.length <= 5) {
                      // First 5 digits
                      formattedValue = digitsOnly;
                    } else if (digitsOnly.length <= 12) {
                      // First 5 digits + hyphen + next digits up to 7
                      formattedValue = `${digitsOnly.slice(
                        0,
                        5
                      )}-${digitsOnly.slice(5)}`;
                    } else {
                      // Complete format: 5 digits + hyphen + 7 digits + hyphen + 1 digit
                      formattedValue = `${digitsOnly.slice(
                        0,
                        5
                      )}-${digitsOnly.slice(5, 12)}-${digitsOnly.slice(
                        12,
                        13
                      )}`;
                    }

                    setFormData({
                      ...formData,
                      nic: formattedValue,
                    });
                  }}
                  placeholder="XXXXX-XXXXXXX-X"
                  maxLength="15"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Enrollment Number *
                </label>
                <input
                  type="text"
                  value={formData.enrollementNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      enrollementNumber: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Current Address *
                </label>
                <input
                  type="text"
                  value={formData.currentAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, currentAddress: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Permanent Address
                </label>
                <input
                  type="text"
                  value={formData.permanentAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permanentAddress: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  value={formData.mobileNumber}
                  onChange={(e) => {
                    // Only allow digits and hyphens
                    const value = e.target.value.replace(/[^\d-]/g, "");

                    // Remove all hyphens first to handle user editing
                    const digitsOnly = value.replace(/-/g, "");

                    // Format as 03XX-XXXXXXX
                    let formattedValue = "";

                    if (digitsOnly.length <= 4) {
                      // First 4 digits (network code)
                      formattedValue = digitsOnly;
                    } else {
                      // Format: 4 digits + hyphen + remaining digits (up to 7)
                      formattedValue = `${digitsOnly.slice(
                        0,
                        4
                      )}-${digitsOnly.slice(4, 11)}`;
                    }

                    setFormData({
                      ...formData,
                      mobileNumber: formattedValue,
                    });
                  }}
                  placeholder="03XX-XXXXXXX"
                  maxLength="12"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    // Only allow digits and hyphens
                    const value = e.target.value.replace(/[^\d-]/g, "");

                    // Remove all hyphens first to handle user editing
                    const digitsOnly = value.replace(/-/g, "");

                    // Format as 0XX-XXXXXXX
                    let formattedValue = "";

                    if (digitsOnly.length <= 3) {
                      // First 3 digits (area code)
                      formattedValue = digitsOnly;
                    } else {
                      // Format: 3 digits + hyphen + remaining digits (up to 7)
                      formattedValue = `${digitsOnly.slice(
                        0,
                        3
                      )}-${digitsOnly.slice(3, 10)}`;
                    }

                    setFormData({
                      ...formData,
                      phoneNumber: formattedValue,
                    });
                  }}
                  placeholder="0XX-XXXXXXX"
                  maxLength="11"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
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
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dob: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  value={formData.higestQualification}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      higestQualification: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) =>
                    setFormData({ ...formData, nationality: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Province
                </label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) =>
                    setFormData({ ...formData, province: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Domicile *
                </label>
                <input
                  type="text"
                  value={formData.domicile}
                  onChange={(e) =>
                    setFormData({ ...formData, domicile: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  {studentData?.profileImage && (
                    <img
                      src={studentData?.profileImage}
                      alt="Profile"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  )}
                  <input
                    type="file"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                    accept=".jpg,.jpeg,.png"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  />
                </div>
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Programs *
                </label>
                <Select
                  options={courseOptions}
                  value={courseOptions.find(
                    (option) => option.value === formData.course
                  )}
                  onChange={(selected) => {
                    setFormData({
                      ...formData,
                      course: selected.value,
                      batch: "", // Reset batch when course changes
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
                  placeholder="Select Program"
                  isSearchable
                  required
                />
              </div>

              {/* Batch Selection */}
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Batch
                </label>
                <Select
                  options={batchOptions}
                  value={batchOptions.find(
                    (option) => option.value === formData.batch
                  )}
                  onChange={(selected) => {
                    setFormData({
                      ...formData,
                      batch: selected.value,
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
                  placeholder="Select Batch"
                  isSearchable
                  isDisabled={!formData.course || batchOptions.length === 0}
                  required={formData.course && batchOptions.length > 0}
                />
                {formData?.course && batchOptions?.length === 0 && (
                  <p className="text-sm text-yellow-600 mt-1">
                    No batch assigned to this program
                  </p>
                )}
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Verified
                </label>
                <select
                  value={formData.verified.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      verified: e.target.value === "true",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Guardian Details Section */}
          <div className="mb-6">
            <Typography className="text-xl font-semibold text-c-grays mb-4 border-b pb-2">
              Guardian Details
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Name *
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) =>
                    setFormData({ ...formData, fatherName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Profession
                </label>
                <input
                  type="text"
                  value={formData.fatherProfession}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fatherProfession: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Relationship
                </label>
                <input
                  type="text"
                  value={formData.relationShip}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      relationShip: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian NIC
                </label>
                <input
                  type="text"
                  value={formData.GuardianNIC}
                  onChange={(e) => {
                    // Only allow digits and hyphens
                    const value = e.target.value.replace(/[^\d-]/g, "");

                    // Remove all hyphens first to handle user editing in the middle of the input
                    const digitsOnly = value.replace(/-/g, "");

                    // Format as XXXXX-XXXXXXX-X
                    let formattedValue = "";

                    if (digitsOnly.length <= 5) {
                      // First 5 digits
                      formattedValue = digitsOnly;
                    } else if (digitsOnly.length <= 12) {
                      // First 5 digits + hyphen + next digits up to 7
                      formattedValue = `${digitsOnly.slice(
                        0,
                        5
                      )}-${digitsOnly.slice(5)}`;
                    } else {
                      // Complete format: 5 digits + hyphen + 7 digits + hyphen + 1 digit
                      formattedValue = `${digitsOnly.slice(
                        0,
                        5
                      )}-${digitsOnly.slice(5, 12)}-${digitsOnly.slice(
                        12,
                        13
                      )}`;
                    }

                    setFormData({
                      ...formData,
                      GuardianNIC: formattedValue,
                    });
                  }}
                  placeholder="XXXXX-XXXXXXX-X"
                  maxLength="15"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Nationality
                </label>
                <input
                  type="text"
                  value={formData.GuardianNationality}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      GuardianNationality: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Gender
                </label>
                <select
                  value={formData.GuardianGender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      GuardianGender: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Permanent Address
                </label>
                <input
                  type="text"
                  value={formData.GuardianPermenantAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      GuardianPermenantAddress: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Current Address
                </label>
                <input
                  type="text"
                  value={formData.GuardianCurrentAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      GuardianCurrentAddress: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Phone Number
                </label>
                <input
                  type="text"
                  value={formData.GuardianPhoneNumber}
                  onChange={(e) => {
                    // Only allow digits and hyphens
                    const value = e.target.value.replace(/[^\d-]/g, "");

                    // Remove all hyphens first to handle user editing
                    const digitsOnly = value.replace(/-/g, "");

                    // Format as 0XX-XXXXXXX
                    let formattedValue = "";

                    if (digitsOnly.length <= 3) {
                      // First 3 digits (area code)
                      formattedValue = digitsOnly;
                    } else {
                      // Format: 3 digits + hyphen + remaining digits (up to 7)
                      formattedValue = `${digitsOnly.slice(
                        0,
                        3
                      )}-${digitsOnly.slice(3, 10)}`;
                    }

                    setFormData({
                      ...formData,
                      GuardianPhoneNumber: formattedValue,
                    });
                  }}
                  placeholder="0XX-XXXXXXX"
                  maxLength="11"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.GuardianMobileNumber}
                  onChange={(e) => {
                    // Only allow digits and hyphens
                    const value = e.target.value.replace(/[^\d-]/g, "");

                    // Remove all hyphens first to handle user editing
                    const digitsOnly = value.replace(/-/g, "");

                    // Format as 03XX-XXXXXXX
                    let formattedValue = "";

                    if (digitsOnly.length <= 4) {
                      // First 4 digits (network code)
                      formattedValue = digitsOnly;
                    } else {
                      // Format: 4 digits + hyphen + remaining digits (up to 7)
                      formattedValue = `${digitsOnly.slice(
                        0,
                        4
                      )}-${digitsOnly.slice(4, 11)}`;
                    }

                    setFormData({
                      ...formData,
                      GuardianMobileNumber: formattedValue,
                    });
                  }}
                  placeholder="03XX-XXXXXXX"
                  maxLength="12"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Guardian Email
                </label>
                <input
                  type="email"
                  value={formData.GuardianEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      GuardianEmail: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="mt-8 flex justify-end gap-4">
            <Button
              variant="outlined"
              onClick={handleOpen}
              className="text-c-purple border-c-purple"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-c-purple h-[45px] flex items-center justify-center overflow-hidden"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-dots loading-lg"></span>
              ) : (
                "Update Student"
              )}
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default EditStudentModal;
