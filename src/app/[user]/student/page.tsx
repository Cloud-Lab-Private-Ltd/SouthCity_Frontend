"use client";
import React from "react";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { ChevronDown, Upload } from "lucide-react";
import { StudentModel } from "@/app/models/Student/student";
import { toast } from "sonner";
import { StudentAPI as API } from "@/api/studentAPI";
import { CourseAPI } from "@/api/courseAPI";
import { GroupAPI } from "@/api/groupAPI";
import { BatchAPI } from "@/api/batchAPI";
const StudentForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentModel>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = React.useState<any[]>([]);
  const [groups, setGroups] = React.useState<any[]>([]);
  const [batches, setBatches] = React.useState<any[]>([]);
  const handleFormSubmit = async (data: StudentModel) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await CreateStudent(data);
      if (response) {
        setOpen(false);
        toast.success("Student Created Successfully", { duration: 3000, position: "top-center" },)
        reset();
      }
    } catch (error) {
      console.error("Error creating class:", error);
      const errorMessage = (error as any)?.response?.message || "Failed to create student";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const CreateStudent = async (data: StudentModel) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof FileList && value.length > 0) {
          formData.append(key, value[0]);
        } else {
          formData.append(key, value as string);
        }
      });
      const response: any = await API.Create(formData);
      console.log("API Response:", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("API Error:", error);
      }
      throw error;
    }
  };
  React.useEffect(() => {
    GetCourse();
    GetGroup();
    GetBatch();
  }, []);
  const GetCourse = async () => {
    try {
      const response = await CourseAPI.Get();
      console.log("API Response:", response.data);
      const mappedCourses = response.data.courses.map((course: any) => ({
        id: course._id,
        name: course.name,
      }));
      setCourses(mappedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  const GetGroup = async () => {
    try {
      const response = await GroupAPI.Get();
      console.log("API Response:", response.data);
      const mappedGroups = response.data.groups.map((groups: any) => ({
        id: groups._id,
        name: groups.name,
      }));
      setGroups(mappedGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };
  const GetBatch = async () => {
    try {
      const response = await BatchAPI.Get();
      console.log("API Response:", response.data);
      const mappedBatch = response.data.batches.map((batch: any) => ({
        id: batch._id,
        name: batch.batchName,
      }));
      setBatches(mappedBatch);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };
  return (
    <div className="px-2 space-y-2">
      <link
        href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <h1 className="text-[33px] font-Epilogue font-semibold text-[#5d7285]">
        Student
      </h1>
      <div className="p-6 max-w-7xl mx-auto bg-white border rounded-lg shadow-md">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="max-w-6xl mx-auto p-6 grid grid-cols-3 gap-4"
        >
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              {...register("fullName")}
              placeholder="Muhammad Ahmed"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="ahmed@gmail.com"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* National ID */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">National ID (NIC)</label>
            <input
              type="text"
              {...register("nic")}
              placeholder="12345-6789012-3"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter password"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Father's Name */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Father's Name</label>
            <input
              type="text"
              {...register("fatherName")}
              placeholder="Kashif Ali"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Address */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Address</label>
            <input
              type="text"
              {...register("address")}
              placeholder="123 Clifton Block 5, Karachi"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Gender */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Gender</label>
            <input
              type="text"
              {...register("gender")}
              placeholder="Male"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* DOB */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Date of Birth</label>
            <input
              type="date"
              {...register("dob")}
              placeholder="e.g., 01-01-2000"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Registration ID */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Registration ID</label>
            <input
              type="text"
              {...register("registrationId")}
              placeholder="e.g., REG12345"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              type="text"
              {...register("phoneNumber")}
              placeholder="e.g., +92 234-567-8901"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Country */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 flex items-center gap-1">
              Country
            </label>
            <div className="relative">
              <select
                {...register("country")}
                className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Select your country</option>
                <option value="pakistan">Pakistan</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
            </div>
          </div>
          {/* City */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">City</label>
            <div className="relative">
              <select
                {...register("city")}
                className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Select your city</option>
                <option value="karachi">Karachi</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
            </div>
          </div>
          {/* Father's Mobile Number */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">
              Father's Mobile Number
            </label>
            <input
              type="text"
              {...register("fatherPhone_number")}
              placeholder="e.g., +92 234-567-8902"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Father's Occupation */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Father's Occupation</label>
            <input
              type="text"
              {...register("fatherOccupation")}
              placeholder="e.g., Engineer"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Profile Image */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Profile Image</label>
            <div className="relative">
              <input
                type="file"
                id="profileImage"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Convert to base64 if needed for preview
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      register("profileImage").onChange({
                        target: { value: reader.result as string },
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="profileImage"
                className="w-full px-3 py-1 rounded-md border border-gray-200 flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span className="text-gray-400">Upload image</span>
              </label>
            </div>
          </div>
          {/* Group */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Group
            </label>
            <select
              {...register("group", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled selected>
                Select a group
              </option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div> */}
          {/* Batch */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Batch
            </label>
            <select
              {...register("batch", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled selected>
                Select a batch
              </option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>
          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Course
            </label>
            <select
              {...register("course", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled selected>
                Select a course
              </option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          {/* Current Semester
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Current Semester</label>
            <input
              type="text"
              {...register("currentSemester")}
              placeholder="e.g., 3"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
          {/* Verified Checkbox and Save Button */}
          <div className="col-span-3 flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("verified")}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Verified</span>
            </label>
            <button
              type="submit"
              className="px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default StudentForm;