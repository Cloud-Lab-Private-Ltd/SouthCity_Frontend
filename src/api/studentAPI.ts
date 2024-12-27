import axiosInstance from "@/api/ApiClient/ApiClient";
import { StudentModel } from "@/app/models/Student/student";
import axios from "axios";


export namespace StudentAPI {
  export async function Create(formData: FormData) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token not found. Please log in.");
      }
      const response = await axiosInstance.post<StudentModel>(
        "/api/v1/sch/student",
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
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
      throw error;
    }
  }
}
