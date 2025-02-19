import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
  Button,
  Card,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Select from "react-select";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const EditStudentModal = ({
  open,
  handleOpen,
  studentData,
  token,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    nic: "",
    fatherName: "",
    currentAddress: "",
    permanentAddress: "",
    mobileNumber: "",
    phoneNumber: "",
    gender: "",
    course: "", // Changed from array to string
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
    verified: false,
    batch: "",
    academicQualifications: [
      {
        levelOfStudy: "",
        subjects: "",
        years: "",
        marksGrade: "",
        institutionName: "",
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const { batches } = useSelector((state) => state.groupdata);
  const [profileImage, setProfileImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const batchOptions = batches?.batches?.map((batch) => ({
    value: batch._id,
    label: batch.batchName,
  }));

  useEffect(() => {
    if (studentData) {
      setFormData({
        fullName: studentData.fullName || "",
        email: studentData.email || "",
        nic: studentData.nic || "",
        fatherName: studentData.fatherName || "",
        currentAddress: studentData.currentAddress || "",
        permanentAddress: studentData.permanentAddress || "",
        mobileNumber: studentData.mobileNumber || "",
        phoneNumber: studentData.phoneNumber || "",
        gender: studentData.gender || "",
        course: studentData.course[0]?._id || "",
        dob: studentData.dob?.split("T")[0] || "",
        maritalStatus: studentData.maritalStatus || "",
        relationShip: studentData.relationShip || "",
        organization: studentData.organization || "",
        higestQualification: studentData.higestQualification || "",
        nationality: "Pakistani",
        province: studentData.province || "",
        domicile: studentData.domicile || "",
        religion: studentData.religion || "",
        city: studentData.city || "",
        fatherProfession: studentData.fatherProfession || "",
        verified: studentData.verified || false,
        batch: studentData.batch?._id || "",
        academicQualifications: studentData.academicQualifications || [
          {
            levelOfStudy: "",
            subjects: "",
            years: "",
            marksGrade: "",
            institutionName: "",
          },
        ],
      });

      if (studentData.batch?._id) {
        const selectedBatch = batches.batches.find(
          (b) => b._id === studentData.batch._id
        );
        if (selectedBatch) {
          setCourseOptions(selectedBatch.course);
        }
      }
    }
  }, [studentData, batches]);

  const handleBatchChange = (selected) => {
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
  };

  const addQualification = () => {
    setFormData({
      ...formData,
      academicQualifications: [
        ...formData.academicQualifications,
        {
          levelOfStudy: "",
          subjects: "",
          years: "",
          marksGrade: "",
          institutionName: "",
        },
      ],
    });
  };

  const removeQualification = (index) => {
    const newQualifications = formData.academicQualifications.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      academicQualifications: newQualifications,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formDataToSend = new FormData();

    // Handle all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "academicQualifications") {
        formData[key].forEach((qual, index) => {
          Object.keys(qual).forEach((qualKey) => {
            formDataToSend.append(
              `academicQualifications[${index}][${qualKey}]`,
              qual[qualKey]
            );
          });
        });
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
      onSuccess();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update student"
      );
    } finally {
      setLoading(false);
    }
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
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
                required
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
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                NIC *
              </label>
              <input
                type="text"
                value={formData.nic}
                onChange={(e) =>
                  setFormData({ ...formData, nic: e.target.value })
                }
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
                value={formData.fatherName}
                onChange={(e) =>
                  setFormData({ ...formData, fatherName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
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
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Permanent Address *
              </label>
              <input
                type="text"
                value={formData.permanentAddress}
                onChange={(e) =>
                  setFormData({ ...formData, permanentAddress: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Mobile Number *
              </label>
              <input
                type="text"
                value={formData.mobileNumber}
                onChange={(e) =>
                  setFormData({ ...formData, mobileNumber: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
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
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Marital Status *
              </label>
              <select
                value={formData.maritalStatus}
                onChange={(e) =>
                  setFormData({ ...formData, maritalStatus: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Relationship *
              </label>
              <input
                type="text"
                value={formData.relationShip}
                onChange={(e) =>
                  setFormData({ ...formData, relationShip: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Organization *
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Highest Qualification *
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
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Province *
              </label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
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
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Religion *
              </label>
              <input
                type="text"
                value={formData.religion}
                onChange={(e) =>
                  setFormData({ ...formData, religion: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Father Profession *
              </label>
              <input
                type="text"
                value={formData.fatherProfession}
                onChange={(e) =>
                  setFormData({ ...formData, fatherProfession: e.target.value })
                }
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
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                accept=".jpg,.jpeg,.png"
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Verification Status
              </label>
              <select
                value={formData.verified}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    verified: e.target.value === "true",
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              >
                <option value="false">Pending</option>
                <option value="true">Verified</option>
              </select>
            </div>
          </div>

          {/* Batch and Course Selection */}
          <div className="mt-6">
            <Typography className="text-lg font-semibold text-c-grays mb-4">
              Batch & Course Selection
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Batch *
                </label>
                <Select
                  options={batchOptions}
                  value={batchOptions?.find(
                    (option) => option.value === formData.batch
                  )}
                  onChange={handleBatchChange}
                  className="text-c-grays"
                  required
                  styles={{
                    input: (base) => ({
                      ...base,
                      "input:focus": {
                        boxShadow: "none",
                      },
                    }),
                  }}
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Course *
                </label>
                <Select
                  options={courseOptions?.map((course) => ({
                    value: course._id,
                    label: `${course.name} - ${course.duration}`,
                  }))}
                  value={courseOptions
                    ?.map((course) => ({
                      value: course._id,
                      label: `${course.name} - ${course.duration}`,
                    }))
                    .find((option) => formData.course === option.value)}
                  onChange={(selected) => {
                    setFormData({
                      ...formData,
                      course: selected?.value || "",
                    });
                  }}
                  className="text-c-grays"
                  isClearable={false}
                  required
                  styles={{
                    input: (base) => ({
                      ...base,
                      "input:focus": {
                        boxShadow: "none",
                      },
                    }),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Academic Qualifications */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <Typography className="text-lg font-semibold text-c-grays">
                Academic Qualifications
              </Typography>
              <Button
                type="button"
                onClick={addQualification}
                className="bg-c-purple"
              >
                Add Qualification
              </Button>
            </div>

            {formData.academicQualifications.map((qual, index) => (
              <div
                key={index}
                className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg"
              >
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

                <div>
                  <label className="block text-c-grays text-sm font-medium mb-2">
                    Level of Study *
                  </label>
                  <input
                    type="text"
                    value={qual.levelOfStudy}
                    onChange={(e) => {
                      const newQuals = [...formData.academicQualifications];
                      newQuals[index].levelOfStudy = e.target.value;
                      setFormData({
                        ...formData,
                        academicQualifications: newQuals,
                      });
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
                      const newQuals = [...formData.academicQualifications];
                      newQuals[index].subjects = e.target.value;
                      setFormData({
                        ...formData,
                        academicQualifications: newQuals,
                      });
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
                      const newQuals = [...formData.academicQualifications];
                      newQuals[index].years = e.target.value;
                      setFormData({
                        ...formData,
                        academicQualifications: newQuals,
                      });
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
                      const newQuals = [...formData.academicQualifications];
                      newQuals[index].marksGrade = e.target.value;
                      setFormData({
                        ...formData,
                        academicQualifications: newQuals,
                      });
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
                      const newQuals = [...formData.academicQualifications];
                      newQuals[index].institutionName = e.target.value;
                      setFormData({
                        ...formData,
                        academicQualifications: newQuals,
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="mt-4 text-red-500 text-sm">{errorMessage}</div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="bg-c-purple h-[45px] flex items-center justify-center min-w-[150px]"
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
