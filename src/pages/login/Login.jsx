import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  ProfileGet,
  StudentGet,
  VoucherGet,
} from "../../features/ProfileSlice";
import {
  ActionLogsGet,
  BatchesGet,
  CoursesGet,
  DegreeTypesGet,
  FeesGet,
  GroupGet,
  MembersGet,
  NotificationsGet,
  PermissionsGet,
  StatusesGet,
  StudentsGet,
  TrashedStudentsGet,
  VouchersGet,
} from "../../features/GroupApiSlice";
import backImg from "../../assets/img/back-img.jpg"

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Change state name
  const [emailOrNic, setEmailOrNic] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setloader] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  const submit = () => {
    if (!emailOrNic || !password) return;

    setloader(true);
    axios
      .post(`${BASE_URL}/api/v1/sch/auth/login`, {
        emailOrNic,
        password,
      })
      .then((res) => {
        setloader(false);
        const currentTime = new Date().getTime();
        localStorage.setItem("token", res?.data?.token);
        localStorage.setItem("userType", res?.data?.user?.userType);
        localStorage.setItem("userName", res?.data?.user?.name);
        localStorage.setItem("userId", res?.data?.user?.id);
        localStorage.setItem("groupId", res?.data?.user?.group?.id);
        localStorage.setItem("groupName", res?.data?.user?.group?.name);
        localStorage.setItem("loginTime", currentTime);
        localStorage.setItem("wsUrl", res?.data?.wsUrl);
        const loginTime = new Date().getTime();
        localStorage.setItem("loginTime", loginTime.toString());

        dispatch(ProfileGet(res?.data?.user.id));
        dispatch(StudentGet());
        dispatch(VoucherGet());
        dispatch(GroupGet());
        dispatch(MembersGet());
        dispatch(DegreeTypesGet());
        dispatch(StatusesGet());
        dispatch(CoursesGet());
        dispatch(BatchesGet());
        dispatch(StudentsGet());
        dispatch(VouchersGet());
        dispatch(ActionLogsGet());
        dispatch(PermissionsGet());
        dispatch(NotificationsGet());
        dispatch(TrashedStudentsGet());
        dispatch(FeesGet());

        navigate("/");
      })
      .catch((e) => {
        setloader(false);
        console.log("login error", e);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e?.response?.data?.message,
          confirmButtonColor: "#5570F1",
        });
      });
  };

  const handleForgotPassword = () => {
    // Step 1: Request OTP
    Swal.fire({
      title: "Forgot Password",
      html: `
        <div class="text-left mb-4">
          <p class="text-sm text-gray-600 mb-3">Enter your email address to receive a verification code</p>
          <input 
            type="email" 
            id="email" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
            placeholder="Enter your email"
          >
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#5570F1",
      confirmButtonText: "Send Code",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const email = document.getElementById("email").value;
        if (!email) {
          Swal.showValidationMessage("Please enter your email");
          return false;
        }

        return axios
          .post(`${BASE_URL}/api/v1/sch/forgot-password`, { email })
          .then((response) => {
            return { email, ...response.data };
          })
          .catch((error) => {
            Swal.showValidationMessage(
              `Request failed: ${
                error.response?.data?.message || "Something went wrong"
              }`
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const email = result.value.email;
        // Step 2: Verify OTP
        verifyOTP(email);
      }
    });
  };

  const verifyOTP = (email) => {
    Swal.fire({
      title: "Verify Code",
      html: `
        <div class="text-left mb-4">
          <p class="text-sm text-gray-600 mb-3">Enter the verification code sent to your email</p>
          <div class="flex justify-center space-x-2 mb-3">
            <input type="text" id="otp" maxlength="6" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Enter 6-digit code">
          </div>
          <p class="text-xs text-gray-500">Didn't receive the code? <button type="button" id="resendBtn" class="text-purple-600 hover:text-purple-800">Resend</button></p>
        </div>
      `,
      didOpen: () => {
        // Add event listener for resend button
        document.getElementById("resendBtn").addEventListener("click", () => {
          axios
            .post(`${BASE_URL}/api/v1/sch/forgot-password`, { email })
            .then(() => {
              Swal.showValidationMessage("Verification code resent!");
              setTimeout(() => {
                Swal.resetValidationMessage();
              }, 2000);
            })
            .catch((error) => {
              Swal.showValidationMessage(
                `Failed to resend: ${
                  error.response?.data?.message || "Something went wrong"
                }`
              );
              setTimeout(() => {
                Swal.resetValidationMessage();
              }, 2000);
            });
        });
      },
      showCancelButton: true,
      confirmButtonColor: "#5570F1",
      confirmButtonText: "Verify",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const otp = document.getElementById("otp").value;
        if (!otp || otp.length !== 6) {
          Swal.showValidationMessage("Please enter a valid 6-digit code");
          return false;
        }

        return axios
          .post(`${BASE_URL}/api/v1/sch/verify-otp`, { otp })
          .then((response) => {
            return { otp, ...response.data };
          })
          .catch((error) => {
            Swal.showValidationMessage(
              `Verification failed: ${
                error.response?.data?.message || "Invalid code"
              }`
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const otp = result.value.otp;
        // Step 3: Reset Password
        resetPassword(otp);
      }
    });
  };

  const resetPassword = (otp) => {
    Swal.fire({
      title: "Reset Password",
      html: `
        <div class="text-left mb-4">
          <p class="text-sm text-gray-600 mb-3">Create a new password</p>
          <div class="mb-3">
            <input 
              type="password" 
              id="newPassword" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="New password"
            >
          </div>
          <div>
            <input 
              type="password" 
              id="confirmPassword" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Confirm new password"
            >
          </div>
          <p class="text-xs text-gray-500 mt-2">Password must be at least 6 characters</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#5570F1",
      confirmButtonText: "Reset Password",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword =
          document.getElementById("confirmPassword").value;

        if (!newPassword || newPassword.length < 6) {
          Swal.showValidationMessage("Password must be at least 6 characters");
          return false;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage("Passwords do not match");
          return false;
        }

        return axios
          .post(`${BASE_URL}/api/v1/sch/reset-password`, {
            otp,
            newPassword,
          })
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            Swal.showValidationMessage(
              `Reset failed: ${
                error.response?.data?.message || "Something went wrong"
              }`
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Password Reset Successful",
          text: "You can now login with your new password",
          confirmButtonColor: "#5570F1",
        });
      }
    });
  };

  return (
    <div
      className="relative h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover items-center"
      style={{
        backgroundImage: `url(${backImg})`,
      }}
    >
      <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl z-10">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome Back!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <span className="h-px w-16 bg-gray-300"></span>
          <span className="text-gray-500 font-normal">OR</span>
          <span className="h-px w-16 bg-gray-300"></span>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <input type="hidden" name="remember" value="true" />
          <div className="relative">
            <div className="absolute right-0 mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-c-purple"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <label className="text-sm font-bold text-gray-700 tracking-wide">
              Email or NIC
            </label>
            <input
              className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-c-yellow"
              type="text"
              placeholder="Enter email or NIC"
              value={emailOrNic}
              onChange={(e) => setEmailOrNic(e.target.value)}
              required
              autoComplete="off"
              name="emailOrNic"
            />
          </div>
          <div className="mt-8 relative">
            <label className="text-sm font-bold text-gray-700 tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-c-yellow"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                name="password"
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Button */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-c-purple hover:text-purple-600 transition-colors duration-300"
            >
              Forgot Password?
            </button>
          </div>

          <div className="">
            <Button
              type="submit"
              className="rounded-full w-full h-[50px] overflow-hidden flex items-center justify-center bg-c-purple text-[1rem] tracking-wide"
            >
              {loader ? (
                <span className="loading loading-dots loading-lg"></span>
              ) : (
                <>Sign in</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
