"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from '@/api/login/login';
import { toast } from "sonner";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";

interface FormInputs {
  email: string;
  password: string;
}

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const response = await login(data.email, data.password);
      console.log(response);
  
      toast.success(response.message, { duration: 3000, position: "top-center" });
  
      // Save token to localStorage under authToken key
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userType', response.user.userType);
      localStorage.setItem('role', response.user.group.name);
      localStorage.setItem('role', response.user.group.id);
      localStorage.setItem('role', response.user.email);
  
      router.push(`../${response.user.userType}/dashboard`);
    } catch (error) {
      console.error(error);
      toast.error('Email or Password is incorrect.', { duration: 3000, position: "top-center" });
    }
  };
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div
        className="h-screen max-md:h-[110vh] w-screen absolute -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/Cover-img.png')` }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10"></div>

      {/* Form */}
      <div className="flex h-screen items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
          {/* Header */}
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Welcome Back
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Login into your account
          </p>

          {/* Form */}
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

            {/* Password Input */}
            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="block text-gray-600 font-medium"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Toggle Password Visibility */}
              <div
                className="absolute inset-y-0 right-3 mt-7 flex items-center cursor-pointer text-gray-500 hover:text-blue-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <MdOutlineRemoveRedEye size={24} />
                ) : (
                  <FaRegEyeSlash size={24} />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2 h-6 w-4" />
                Remember me
              </label>
              <Link href="../forgotPassword" className="text-red-500 text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2 rounded-md hover:from-blue-700 hover:to-blue-600 transition-transform transform hover:scale-105 shadow-md"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
