import { CourseModel } from "../app/models/Course/course";
import apiClient from "@/api/ApiClient/ApiClient";
import axiosInstance from "@/api/ApiClient/ApiClient"

export namespace CourseAPI {
  export async function Create(formData: FormData) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token not found. Please log in.");
      }
      const response = await apiClient.post<CourseModel>(
        "/api/v1/sch/courses",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": `${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      return error;
    }
  }
  export async function Get() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token not found. Please log in.");
      } // Add this closing bracket
      const response = await apiClient.get(
        "/api/v1/sch/courses"
      ,{
        headers: {
          "x-access-token": `${token}`,
        },
      });
      return response;
    } catch (error) {
      throw Error;
    }
  }

  export async function Delete(id: string, adminPassword: string) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token not found. Please log in.");
      }
      const response = await axiosInstance.delete(
        `/api/v1/sch/courses/${id}`,
        {
          headers: {
            "x-access-token": `${token}`,
          },
          data: {
            adminPassword: adminPassword
          }
        }
      );
      return response;
    } catch (error) {
      throw Error;
    }
  }
  export async function Update(id: string, formData: FormData) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token not found. Please log in.");
      }
      const response = await apiClient.put(
        `/api/v1/sch/courses/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": `${token}`,
          },
          // data: {
          //   adminPassword: adminPassword
          // }
        }
      );
      return response;
    } catch (error) {
      throw Error;
    }
  }
  
}
