"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CourseAPI } from "@/api/courseAPI";
import { CourseModel } from "@/app/models/Course/course";
import { useFieldArray } from "react-hook-form";
import CourseTable from "@/components/Tables/CourseTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EditCourse = Omit<CourseModel, 'createdAt' | 'updatedAt'>;
import { toast } from "sonner";

export default function AddCourseForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<CourseModel | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [pendingUpdateData, setPendingUpdateData] = useState<any>(null);
  const [existingFile, setExistingFiles] = useState<File[]>([]);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewData, setViewData] = useState<CourseModel | null>(null);
  const [existingFileName, setExistingFileName] = useState<string>("");

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
      console.log("Form data", data)
      console.log(setPendingUpdateData)
      setIsLoading(true);
      setError(null);

      if (!data.Syllabus || data.Syllabus.length === 0) {
        throw new Error("Syllabus file is required.");
      }
      if (data.enrollment_Start_date > data.enrollment_End_date) {
        toast.error(
          "Enrollment End Date must be after Enrollment Start Date.",
          {
            duration: 3000,
            position: "top-center",
          }
        );
        throw new Error(
          "Enrollment End Date must be after Enrollment Start Date."
        );
      }
      const formData = new FormData();
      // Handle Semesters data correctly
      if (data.Semesters && data.Semesters.length > 0) {
        data.Semesters.forEach((semester, index) => {
          formData.append(`Semesters[${index}][semesterNo]`, semester.semesterNo);
          formData.append(`Semesters[${index}][subjects]`, semester.subjects);
        });
      }

      // Handle Syllabus file
      if (data.Syllabus && data.Syllabus.length > 0) {
        // If it's a File object, append directly
        if (data.Syllabus[0] instanceof File) {
          formData.append('Syllabus', data.Syllabus[0]);
        }
        // If it's a URL string, append the URL
        else if (typeof data.Syllabus === 'string') {
          formData.append('Syllabus', data.Syllabus);
        }
      }

      // Add other form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'Syllabus') {
          if (key === 'Semesters') {
            value.forEach((semester: any, index: number) => {
              formData.append(`Semesters[${index}].semesterNo`, semester.semesterNo);
              formData.append(`Semesters[${index}].subjects`, semester.subjects);
            });
          } else {
            formData.append(key, value as string);
          }
        }
      });

      let response;
      if (editingCourse) {
        setPendingUpdateData(data);
        setIsUpdateDialogOpen(true);
        // Update existing course
        if (editingCourse && editingCourse._id) {
          response = await CourseAPI.Update(editingCourse._id, formData);
        } else {
          throw new Error("Editing course ID is missing.");
        }
        toast.success("Course updated successfully", {
          duration: 3000,
          position: "top-center",
        });
        setEditingCourse(null);
      } else {
        response = await CreateCourseAPI(formData);
        toast.success(`${response.message}`, {
          duration: 3000,
          position: "top-center",
        });
      }
      reset();
      if (editingCourse) {
        console.log("Course updated successfully", response);
      } else {
        console.log("Course created successfully", response);
      }
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

  const confirmUpdate = async () => {
    if (!adminPassword) {
      toast.error("Admin password is required", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('adminPassword', adminPassword);
      // formData.append('admissionFee', pendingUpdateData.admissionFee.toString());
      // Handle Syllabus file
      if (pendingUpdateData.Syllabus && pendingUpdateData.Syllabus.length > 0) {
        if (pendingUpdateData.Syllabus[0] instanceof File) {
          formData.append('Syllabus', pendingUpdateData.Syllabus[0]);
        } else if (typeof pendingUpdateData.Syllabus === 'string') {
          formData.append('Syllabus', pendingUpdateData.Syllabus);
        }
      }


      // Add other form fields
      Object.entries(pendingUpdateData).forEach(([key, value]) => {
        if (key !== 'Syllabus') {
          if (key === 'Semesters') {
            (value as any[]).forEach((semester: any, index: number) => {
              formData.append(`Semesters[${index}].semesterNo`, semester.semesterNo);
              formData.append(`Semesters[${index}].subjects`, semester.subjects);
            });
          } else {
            formData.append(key, value as string);
          }
        }
      });

      if (editingCourse) {
        const response = await CourseAPI.Update(editingCourse._id!, formData);
      } else {
        throw new Error("Editing course is null.");
      }
      toast.success("Course updated successfully", {
        duration: 3000,
        position: "top-center",
      });
      setIsUpdateDialogOpen(false);
      setAdminPassword("");
      setPendingUpdateData(null);
      setEditingCourse(null);
      setError(null);
      reset();
    } catch (error) {
      toast.error("Failed to update course.", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleEdit = (course: EditCourse) => {
    // Store complete course data for editing
    setEditingCourse(course as CourseModel);


    // Format dates from ISO to YYYY-MM-DD
    const startDate = new Date(course.enrollment_Start_date).toISOString().split('T')[0];
    const endDate = new Date(course.enrollment_End_date).toISOString().split('T')[0];

    course.Semesters.forEach((semester) => {
      append({
        semesterNo: semester.semesterNo,
        subjects: semester.subjects
      });
    });

    // Set all form fields with course data
    setValue('name', course.name);
    setValue('description', course.description);
    setValue('degreeType', course.degreeType);
    setValue('code', course.code);
    setValue('duration', course.duration);
    setValue('noOfSemesters', course.noOfSemesters);
    setValue('Semesters', course.Semesters);
    setValue('totalFee', course.totalFee);
    setValue('perSemesterFee', course.perSemesterFee);
    setValue('admissionFee', course.admissionFee);
    setValue('Status', course.Status);
    setValue('Level', course.Level);
    setValue('category', course.category);
    setValue('enrollment_Start_date', startDate);
    setValue('enrollment_End_date', endDate);
    setValue('Syllabus', course.Syllabus);
    setExistingFiles(Array.isArray(course.Syllabus) ? course.Syllabus : [course.Syllabus]);
    // Scroll to form for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleView = (course: CourseModel) => {
    setViewData(course);
    setShowViewDialog(true);
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
        {/* View Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Course Details</DialogTitle>
            </DialogHeader>
            {viewData && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Course Name:</p>
                  <p>{viewData.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Description:</p>
                  <p>{viewData.description}</p>
                </div>
                <div>
                  <p className="font-semibold">Degree Type:</p>
                  <p>{viewData.degreeType}</p>
                </div>
                <div>
                  <p className="font-semibold">Course Code:</p>
                  <p>{viewData.code}</p>
                </div>
                <div>
                  <p className="font-semibold">Duration:</p>
                  <p>{viewData.duration}</p>
                </div>
                <div>
                  <p className="font-semibold">Number of Semesters:</p>
                  <p>{viewData.noOfSemesters}</p>
                </div>
                <div>
                  <p className="font-semibold">Per Semester Fee:</p>
                  <p>{viewData.perSemesterFee}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Fee:</p>
                  <p>{viewData.totalFee}</p>
                </div>
                <div>
                  <p className="font-semibold">Admission Fee:</p>
                  <p>{viewData.admissionFee}</p>
                </div>
                <div>
                  <p className="font-semibold">Status:</p>
                  <p>{viewData.Status}</p>
                </div>
                <div>
                  <p className="font-semibold">Level:</p>
                  <p>{viewData.Level}</p>
                </div>
                <div>
                  <p className="font-semibold">Category:</p>
                  <p>{viewData.category}</p>
                </div>
                <div>
                  <p className="font-semibold">Enrollment Period:</p>
                  <p>
                    {new Date(viewData.enrollment_Start_date).toLocaleDateString()} -
                    {new Date(viewData.enrollment_End_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold">Semesters:</p>
                  {viewData.Semesters.map((semester, index) => (
                    <div key={index} className="ml-4">
                      <p>Semester {semester.semesterNo}</p>
                      <p>Subjects: {semester.subjects}</p>
                    </div>
                  ))}
                </div>
                {viewData.Syllabus && (
                  <div className="col-span-2">
                    <p className="font-semibold">Syllabus:</p>
                    <a
                      href={typeof viewData.Syllabus === 'string' ? viewData.Syllabus : URL.createObjectURL(viewData.Syllabus[0])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Syllabus
                    </a>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setShowViewDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* update dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Update</DialogTitle>
            </DialogHeader>
            <div>
              <p>Please enter the admin password to update the course:</p>
              <Input
                type="password"
                value={adminPassword}
                onChange={(e: any) => setAdminPassword(e.target.value)}
                placeholder="Admin Password"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsUpdateDialogOpen(false);
                setAdminPassword("");
              }}>
                Cancel
              </Button>
              <Button onClick={confirmUpdate}>
                Update Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              {...register("name")}
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
                  value: 5,
                  message: "Minimum Characters should be 5",
                },
                maxLength: {
                  value: 100,
                  message: "Maximum Characters should be 100",
                },
              })}
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
              {...register("degreeType", {
                maxLength: {
                  value: 100,
                  message: "Maximum Characters should be 100",
                },
              })}
              placeholder="e.g., MBBS, Nursing, Pharmacy"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.degreeType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.degreeType.message as string}
              </p>
            )}
          </div>

          {/* Course Code */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Course Code
            </label>
            <input
              {...register("code", {
                maxLength: {
                  value: 100,
                  message: "Maximum Characters should be 100",
                },
              })}
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
              {...register("duration", {
                maxLength: {
                  value: 100,
                  message: "Maximum Characters should be 100",
                },
              })}
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
              {...register("noOfSemesters")}
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
              Semesters <span className="text-red-500 text-lg">*</span>
            </label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 mb-2">
                <input
                  {...register(`Semesters.${index}.semesterNo`, {
                    required: "Semester is required",
                  })}
                  required
                  placeholder="Semester Number"
                  className="w-1/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  {...register(`Semesters.${index}.subjects`)}
                  placeholder="Subjects (comma separated)"
                  required
                  className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (fields.length > 1) {
                      remove(index);
                    } else {
                      toast.error("You cannot remove this semester.", {
                        duration: 3000,
                        position: "top-center",
                      });
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (fields.length < 8) {
                      append({ semesterNo: "", subjects: "" });
                    } else {
                      toast.error("You cannot add more than 8 semesters.", {
                        duration: 3000,
                        position: "top-center",
                      });
                    }
                  }}
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
              type="number"
              {...register("perSemesterFee", {
                maxLength: {
                  value: 10,
                  message: "Maximum Characters should be 10",
                },
              })}
              placeholder="e.g., 50000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.perSemesterFee && (
              <p className="text-red-500 text-sm mt-1">
                {errors.perSemesterFee.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Total Fee
            </label>
            <input
              type="number"
              {...register("totalFee", {
                maxLength: {
                  value: 10,
                  message: "Maximum Characters should be 10",
                },
              })}
              placeholder="e.g., 300000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.totalFee && (
              <p className="text-red-500 text-sm mt-1">
                {errors.totalFee.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Admission Fee
            </label>
            <input
              type="number"
              {...register("admissionFee", {
                maxLength: {
                  value: 50,
                  message: "Maximum Characters should be 50",
                },
              })}
              placeholder="e.g., 10000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Syllabus Upload */}
          <div>
            <label className="block text-sm font-medium">Syllabus <span className="text-blue-500">(.pdf .doc)</span></label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              multiple
            />
            {existingFileName && !(editingCourse?.Syllabus?.[0] instanceof File) && (
              <span className="text-sm text-gray-500">
                Current file: {existingFileName}
              </span>
            )}
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
            {errors.Level && (
              <p className="text-red-500 text-sm mt-1">
                {errors.Level.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Category</label>
            <input
              {...register("category", { required: "Category is required" })}
              placeholder="e.g., Science, Arts, Business"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
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
              {isLoading
                ? "Saving..."
                : editingCourse
                  ? "Update Course"
                  : "Save Course"}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow-lg">
        <CourseTable onEdit={handleEdit} onView={handleView} />
      </div>
    </div>
  );
}
