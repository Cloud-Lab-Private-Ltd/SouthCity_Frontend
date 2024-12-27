"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type FormInputs = {
  email: string;
};

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const router = useRouter();
  // Handle form submission
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log("Reset Email:", data.email);
    toast.success(`Password reset link sent to: ${data.email}`, {
      duration: 3000, // Duration for the toast,
      position: "top-center"
    });
    router.push("../resetPassword");
  };

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div
        className="h-screen max-md:h-[110vh] w-screen absolute -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/Cover-img.png')` }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10"></div>

      {/* Centered Form */}
      <div className="flex h-screen items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          {/* Header */}
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Reset Password
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Enter Your Registered Phone Email
          </p>

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-600 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email address",
                  },
                })}
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
