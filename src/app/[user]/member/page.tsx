"use client";
import React from "react";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { toast } from "sonner";
import { MemberAPI as API } from "@/api/memberAPI";
import { GroupAPI } from "@/api/groupAPI";
import { MemberModel } from "@/app/models/Member/member";
import axios from "axios";
import MemberTable from "@/components/Tables/MemberTable";

const StudentForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberModel>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleFormSubmit = async (data: MemberModel) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await CreateMember(data);
      if (response) {
        setOpen(false);
        reset();
        toast("Member Added Successfully!");
      }
    } catch (error) {
      toast.error('Failed to Add Member.', { duration: 3000, position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const CreateMember = async (data: MemberModel) => {
    try {
      const formData = new FormData();

      // Append file fields
      if (data.profileImage && data.profileImage[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }

      if (data.cv && data.cv[0]) {
        formData.append("cv", data.cv[0]);
      }

      // Append other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "profileImage" && key !== "cv") {
          formData.append(key, value as string);
        }
      });

      // Call the API
      const response = await API.Create(formData);
      toast.success("Member Created Successfully", { duration: 3000, position: "top-center" },)
      reset();
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Unexpected Error:", error);
      }
      throw error;
    }
  };

  React.useEffect(() => {
    GetGroup();
  }, []);

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

  return (
    <div className="px-2 space-y-2">
      <link
        href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <h1 className="text-[33px] font-Epilogue font-semibold text-[#5d7285]">
        Member
      </h1>
      <div className="p-6 max-w-7xl mx-auto bg-white border rounded-lg shadow-md">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              {...register("Name", { required: "Full Name is required" })}
              placeholder="John Doe"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.Name && (
              <p className="text-red-500 text-xs">{errors.Name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="john.doe@example.com"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              {...register("password", { required: "Email is required" })}
              placeholder="john.doe@example.com"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Address</label>
            <input
              type="text"
              {...register("address", { required: "Address is required" })}
              placeholder="123 Main St, City, Country"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">NIC</label>
            <input
              type="text"
              {...register("nic", { required: "NIC is required" })}
              placeholder="1234567890123"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nic && (
              <p className="text-red-500 text-xs">{errors.nic.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Qualification</label>
            <input
              type="text"
              {...register("qualification", {
                required: "Qualification is required",
              })}
              placeholder="PhD in Computer Science"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.qualification && (
              <p className="text-red-500 text-xs">
                {errors.qualification.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Country</label>
            <input
              type="text"
              {...register("country", { required: "Country is required" })}
              placeholder="United States"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.country && (
              <p className="text-red-500 text-xs">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">City</label>
            <input
              type="text"
              {...register("city", { required: "City is required" })}
              placeholder="New York"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.city && (
              <p className="text-red-500 text-xs">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              type="tel"
              {...register("phoneNumber", {
                required: "Phone Number is required",
              })}
              placeholder="+1234567890"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Gender</label>
            <select
              {...register("gender", { required: "Gender is required" })}
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs">{errors.gender.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Profile Image</label>
            <input
              type="file"
              {...register("profileImage", {
                required: "Profile Image is required",
              })}
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.profileImage && (
              <p className="text-red-500 text-xs">
                {errors.profileImage.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">CV</label>
            <input
              type="file"
              {...register("cv", { required: "CV is required" })}
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.cv && (
              <p className="text-red-500 text-xs">{errors.cv.message}</p>
            )}
          </div>

          {/* Group */}
          <div>
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
          </div>

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
              disabled={isLoading}
              className={`${isLoading ? "bg-gray-400" : "px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"}`}
            >
              {isLoading ? "Saving..." : "Save Member"}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow-lg">
        <MemberTable />
      </div>
    </div>
  );
};

export default StudentForm;
