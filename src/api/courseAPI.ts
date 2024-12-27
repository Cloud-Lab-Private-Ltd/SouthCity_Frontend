import axiosInstance from "@/api/ApiClient/ApiClient";
import { CourseModel } from "../app/models/Course/course";

export namespace CourseAPI {
  export async function Create(formData: FormData) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token not found. Please log in.");
      }
      const response = await axiosInstance.post<CourseModel>(
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
      }
      const response = await axiosInstance.get(
        "https://southcity.app.boundlesstechnologies.net/api/v1/sch/courses"
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
}
