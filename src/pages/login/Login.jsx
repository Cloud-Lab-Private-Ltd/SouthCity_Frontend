import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
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
    if (!email || !password) return;

    setloader(true);
    axios
      .post(`${BASE_URL}/api/v1/sch/auth/login`, {
        email,
        password,
      })
      .then((res) => {
        setloader(false);
        const currentTime = new Date().getTime();
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userType", res.data.user.userType);
        localStorage.setItem("userName", res.data.user.name);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("groupId", res.data.user.group?.id);
        localStorage.setItem("groupName", res.data.user.group?.name);
        localStorage.setItem("loginTime", currentTime);
        window.location.reload();
        navigate("/");
      })
      .catch((e) => {
        setloader(false);
        console.log("login error", e);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.message,
          confirmButtonColor: "#5570F1",
        });
      });
  };

  return (
    <div
      className="relative h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover items-center"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
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
              Email
            </label>
            <input
              className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-c-yellow"
              type="email"
              placeholder="mail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              name="email"
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="pt-5">
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
