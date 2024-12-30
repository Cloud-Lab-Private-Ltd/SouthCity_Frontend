"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CourseAPI } from "@/api/courseAPI";
import { CourseModel } from "@/app/models/Course/course";
import { useFieldArray } from "react-hook-form";
import CourseTable from "@/components/Tables/CourseTable";
import { toast } from "sonner";

export default function AddCourseForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CourseModel>({
    defaultValues: {
      Semesters: [{ semesterNo: "", subjects: "" }],
      Status: "Active",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Semesters",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setValue("Syllabus", Array.from(files)); // Update react-hook-form with the selected file
    }
  };

  const handleFormSubmit = async (data: CourseModel) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!data.Syllabus || data.Syllabus.length === 0) {
        throw new Error("Syllabus file is required.");
      }

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "Syllabus") {
          formData.append(key, value[0]); // Add the file
        } else if (key === "Semesters") {
          // Add Semesters as separate fields
          value.forEach((semester: any, index: any) => {
            formData.append(`Semesters[${index}].semesterNo`, semester.semesterNo);
            formData.append(`Semesters[${index}].subjects`, semester.subjects);
          });
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await CreateCourseAPI(formData);
      toast.success(`${response.message}`, { duration: 3000, position: "top-center" },);
      reset();
      console.log("Course created successfully", response);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Failed to create course");
      } else {
        setError("Failed to create course");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const CreateCourseAPI = async (data: FormData) => {
    try {
      const response: any = await CourseAPI.Create(data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to create course"
        );
      }
      throw error;
    }
  };

  return (
    <div className="px-2 space-y-2">
      <link
        href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <h1 className="text-[33px] font-Epilogue font-semibold text-[#5d7285]">
        Course
      </h1>
      <div className="p-6 max-w-7xl mx-auto bg-white border rounded-lg shadow-md">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Course Name */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Course Name
            </label>
            <input
              {...register("name", {
                minLength: {
                  value: 3,
                  message: "Course name must be at least 3 characters"
                },
                maxLength: {
                  value: 50,
                  message: "Course name cannot exceed 50 characters"
                },
              })}
              placeholder="e.g., Anatomy"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Description
            </label>
            <input
              {...register("description", {
                minLength: {
                  value: 3,
                  message: "Course name must be at least 3 characters"
                },
                maxLength: {
                  value: 100,
                  message: "Course name cannot exceed 100 characters"
                }
              },)}
              placeholder="Course description"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Degree Type */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Degree Type
            </label>
            <input
              {...register("degreeType")}
              placeholder="e.g., MBBS, Nursing, Pharmacy"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.degreeType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.degreeType.message}
              </p>
            )}
          </div>

          {/* Course Code */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Course Code
            </label>
            <input
              {...register("code")}
              placeholder="e.g., ANAT-101"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Duration</label>
            <input
              {...register("duration")}
              placeholder="e.g., 1 Year, 6 Months"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>

          {/* Number of Semesters */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Number of Semesters
            </label>
            <input
              type="number"
              {...register("noOfSemesters", {
                required: "Number of semesters is required",
                min: { value: 1, message: "Must be at least 1" },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.noOfSemesters && (
              <p className="text-red-500 text-sm mt-1">
                {errors.noOfSemesters.message}
              </p>
            )}
          </div>

          {/* Semesters */}
          <div className="col-span-3">
            <label className="block text-gray-600 text-sm mb-1">
              Semesters
            </label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 mb-2">
                <input
                  {...register(`Semesters.${index}.semesterNo`)}
                  placeholder="Semester Number"
                  className="w-1/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  {...register(`Semesters.${index}.subjects`)}
                  placeholder="Subjects (comma separated)"
                  className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => append({ semesterNo: "", subjects: "" })}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Add Semester
                </button>
              </div>
            ))}
          </div>

          {/* Fees Section */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Per Semester Fee
            </label>
            <input
              {...register("perSemesterFee")}
              placeholder="e.g., 50000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Total Fee
            </label>
            <input
              {...register("totalFee")}
              placeholder="e.g., 300000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Admission Fee
            </label>
            <input
              {...register("admissionFee")}
              placeholder="e.g., 10000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Syllabus Upload */}
          <div>
            <label className="block text-sm font-medium">Syllabus</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              multiple
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Status</label>
            <select
              {...register("Status", { required: "Status is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Level</label>
            <input
              {...register("Level", { required: "Level is required" })}
              placeholder="e.g., Beginner"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Category</label>
            <input
              {...register("category", { required: "Category is required" })}
              placeholder="e.g., Science, Arts, Business"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Enrollment Dates */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Enrollment Start Date
            </label>
            <input
              type="date"
              {...register("enrollment_Start_date")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Enrollment End Date
            </label>
            <input
              type="date"
              {...register("enrollment_End_date")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-3">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              {isLoading ? "Saving..." : "Save Course"}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow-lg">
        <CourseTable />
      </div>
    </div>
  );
}
