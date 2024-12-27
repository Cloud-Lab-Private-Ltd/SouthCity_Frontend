"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { toast } from "sonner";

type FormInputs = {
  code: string;
  newPassword: string;
  confirmPassword: string;
};

const Page = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log("Form Data:", data);
    toast.success("Your password has been reset successfully!");
    setIsPasswordReset(true); // Switch to the success screen
  };

  const newPassword = watch("newPassword");

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div
        className="h-screen max-md:h-[110vh] w-screen absolute -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/Cover-img.png')` }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10"></div>

      {/* Main Content */}
      <div className="flex h-screen items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          {isPasswordReset ? (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Reset Your Password
              </h1>
              <p className="text-gray-500 mb-6">
                Your password has been reset successfully!
              </p>
              <p className="text-gray-500 mb-8">
                Now login with your new password.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
              >
                Login
              </button>
            </div>
          ) : (
            // Reset Password Form
            <>
              <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
                Reset Your Password
              </h1>
              <p className="text-center text-gray-500 mb-8">
                We have sent a four digit code on your email.
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Four Digit Code */}
                <div className="mb-6">
                  <label
                    htmlFor="code"
                    className="block text-gray-600 font-medium"
                  >
                    Four digit code
                  </label>
                  <input
                    type="text"
                    id="code"
                    placeholder="Enter the code"
                    {...register("code", {
                      required: "Code is required",
                      pattern: {
                        value: /^\d{4}$/,
                        message: "Code must be 4 digits",
                      },
                    })}
                    className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.code && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.code.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="mb-6 relative">
                  <label
                    htmlFor="newPassword"
                    className="block text-gray-600 font-medium"
                  >
                    New Password
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder="Enter new password"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div
                    className="absolute inset-y-0 right-3 mt-8 flex items-center cursor-pointer text-gray-500 hover:text-blue-500"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <MdOutlineRemoveRedEye size={24} />
                    ) : (
                      <FaRegEyeSlash size={24} />
                    )}
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6 relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-600 font-medium"
                  >
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                    className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div
                    className="absolute inset-y-0 right-3 mt-8 flex items-center cursor-pointer text-gray-500 hover:text-blue-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <MdOutlineRemoveRedEye size={24} />
                    ) : (
                      <FaRegEyeSlash size={24} />
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
                >
                  Reset Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
