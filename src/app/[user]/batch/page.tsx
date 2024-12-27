"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BatchAPI as API } from "@/api/batchAPI";
import { BatchModel } from "@/app/models/Batch/batch";
import { toast } from "@/hooks/use-toast";
import BatchTable from "@/components/Tables/BatchTable";
import { CourseAPI } from "@/api/courseAPI";
import { MemberAPI } from "@/api/memberAPI";

export default function AddBatchForm() {
  const [courses, setCourses] = React.useState<any[]>([]);
  const [members, setMembers] = React.useState<any[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BatchModel>();

  const onSubmit = async (data: BatchModel) => {
    try {
      const coordinatorIdMap: Record<string, string> = {
        "Coordinator 1": "1001",
        "Coordinator 2": "1002",
      };
  
      const transformedData = {
        ...data,
        schedule: data.schedule
          .toString()
          .split("-")
          .map((item, index, array) => ({
            day: index === 0 ? item.toUpperCase() : array[0].toUpperCase(),
            time: index === 1 ? `${item}:00` : `${array[1]}:00`
          })),
        batchCoordinator: coordinatorIdMap[data.batchCoordinator],
      };
  
      const response = await API.Create(transformedData);
      
      const typedResponse = response as { status: number };
      if (typedResponse.status === 200) {
        toast({ title: "Success", description: "Batch created successfully" });
      } else {
        toast({
          title: "Error",
          description: "Failed to create batch",
        });
      }
    } catch (error: any) {
      console.error("Error creating batch:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "An error occurred while creating the batch",
      });
    }

  };
  useEffect(() => {
    GetCourse();
    GetMemeber();
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

  const GetMemeber = async () => {
    try {
      const response = await MemberAPI.Get();
      console.log("API Response:", response.data);

      // Map members to the required format
      const mappedMembers = response.data.members.map((member: any) => ({
        id: member._id,
        name: member.Name,
      }));

      setMembers(mappedMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  return (
    <div className="px-4 py-6 lg:px-8 space-y-6">
      <h1 className="text-[33px] font-Epilogue font-semibold text-[#5d7285]">
        Add Batch
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 border lg:p-8 lg:max-w-7xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Batch Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Batch Name
            </label>
            <input
              {...register("batchName", { required: true })}
              placeholder="e.g., Spring 2024, Evening Batch"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
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

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              {...register("startDate", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              {...register("endDate", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total Seats */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Total Seats
            </label>
            <input
              type="number"
              {...register("totalSeats", { required: true })}
              placeholder="e.g., 30"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Available Seats */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Available Seats
            </label>
            <input
              type="number"
              {...register("availableSeats", { required: true })}
              placeholder="e.g., 5"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Current Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Current Semester
            </label>
            <input
              type="number"
              {...register("currentSemester", { required: true })}
              placeholder="e.g., 2"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Schedule
            </label>
            <select
              {...register("schedule", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">e.g., Monday, Friday at 10:00 AM</option>
              <option value="mwf-10">MWF 10:00 AM</option>
              <option value="tth-2">TTH 2:00 PM</option>
            </select>
          </div>

          {/* Session Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Session Type
            </label>
            <select
              {...register("sessionType", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">e.g., Morning, Evening</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          {/* Batch Coordinator */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Batch Coordinator
            </label>
            <select
              {...register("batchCoordinator", { required: true })}
              defaultValue=""
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a batch coordinator
              </option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              {...register("status", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Ongoing, Completed, Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="col-span-full flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border shadow-lg rounded-lg p-4">
        <BatchTable />
      </div>
    </div>
  );
}
