"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { GroupModel } from "@/app/models/Group/group";
import { GroupAPI as API } from "@/api/groupAPI";
import GroupsTable from '@/components/Tables/GroupTable'
import { toast } from "sonner";

const AddGroupRoleForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupModel>();

  const handleFormSubmit = async (data: GroupModel) => {
    try {
      const response = await API.Create(data);
      if (response) {
        console.log("Group created successfully:", response.data);
        toast.success("Group created successfully", { duration: 3000, position: "top-center" })
        reset();
      }
    } catch (error) {
      console.error("Error creating group:", error);
      // Handle error actions here
    }
  };

  return (
    <div className="px-2 space-y-4">
      <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700&display=swap" rel="stylesheet" />
      <h1 className="text-[33px] font-Epilogue font-semibold text-[#5d7285]">
        Group/Role
      </h1>
      <div className="max-w-7xl mx-auto mt-10 p-8 bg-white shadow-lg border rounded-lg">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Group Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Group Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Medical Students"
              {...register("name", { required: "Group name is required" })}
              className={`w-full px-4 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <input
              id="description"
              type="text"
              placeholder="e.g., Group for all first-year medical students"
              {...register("description", {
                required: "Description is required",
              })}
              className={`w-full px-4 py-2 border ${errors.description ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Members
          <div>
            <label
              htmlFor="allowedGroup"
              className="block text-sm font-medium text-gray-700 mb-1 items-center gap-2"
            >
              Allowed Group
              <span className=" text-lg font-bold text-red-500">*</span>
            </label>
            <select
              defaultValue={"Select..."}
              id="allowedGroup"
              multiple
              {...register("allowedGroup", {
                required: "Please select members",
                validate: (value) => value.length > 0 || "Select at least one group"
              })}
              className={`w-full px-4 py-2 border ${errors.allowedGroup ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option className="text-gray-400" disabled>Select...</option>
              <option value="staff1">Staff 1</option>
              <option value="staff2">Staff 2</option>
            </select>
            {errors.allowedGroup && (
              <p className="text-red-500 text-sm mt-1">
                {errors.allowedGroup.message}
              </p>
            )}
          </div> */}

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow-lg">
        <GroupsTable />
      </div>
    </div>
  );
};

export default AddGroupRoleForm;
