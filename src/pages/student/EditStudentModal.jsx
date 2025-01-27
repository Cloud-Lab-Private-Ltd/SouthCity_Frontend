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
import { allCountries } from "../../assets/json data/allCountries";

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
    batch: "",
  });

  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const { batches } = useSelector((state) => state.groupdata);

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

  const batchOptions = batches?.batches?.map((batch) => ({
    value: batch._id,
    label: `${batch.batchName} - ${batch.status}`,
  }));

  useEffect(() => {
    if (studentData) {
      // Set initial form data
      setFormData({
        fullName: studentData.fullName || "",
        email: studentData.email || "",
        nic: studentData.nic || "",
        fatherName: studentData.fatherName || "",
        address: studentData.address || "",
        phoneNumber: studentData.phoneNumber || "",
        gender: studentData.gender || "",
        dob: studentData.dob || "",
        country: "Pakistan",
        city: studentData.city || "",
        course: studentData.course?.map((c) => c._id) || [],
        fatherPhone_number: studentData.fatherPhone_number || "",
        fatherOccupation: studentData.fatherOccupation || "",
        verified: studentData.verified || false,
        batch: studentData.batch?._id || "", // Update this line to get batch ID
      });

      // Set course options based on selected batch
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/sch/students/${studentData._id}`,
        formData,
        {
          headers: {
            "x-access-token": token,
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update student",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="min-w-[95%] md:min-w-[90%] lg:min-w-[85%] max-h-[95vh] overflow-y-auto"
      size="xl"
    >
      <DialogHeader className="flex justify-between items-center border-b bg-gray-50 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Typography variant="h4" className="text-c-grays font-bold">
            Edit Student Details
          </Typography>
        </div>
        <IconButton variant="text" color="gray" onClick={handleOpen}>
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </DialogHeader>

      <DialogBody className="overflow-y-auto p-6">
        <Card className="p-6 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Select Batch *
                </label>
                <Select
                  name="batch"
                  value={batchOptions?.find(
                    (option) => option.value === formData.batch
                  )}
                  onChange={handleBatchChange}
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
                  name="email"
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
                  name="nic"
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
                  name="fatherName"
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
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
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
                  name="dob"
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fatherPhone_number: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fatherOccupation: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
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

            <div className="mt-10 flex justify-end gap-4">
              <Button
                variant="outlined"
                onClick={handleOpen}
                className="text-c-purple border-c-purple px-6"
                size="lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-c-purple px-6 h-[45px] flex items-center justify-center"
                size="lg"
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
        </Card>
      </DialogBody>
    </Dialog>
  );
};

export default EditStudentModal;
