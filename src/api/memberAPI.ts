import axiosInstance from "@/api/ApiClient/ApiClient";
import { MemberModel } from "@/app/models/Member/member";
// import { GroupModel } from "@/app/models/Group/group";
import axios from "axios";

export namespace MemberAPI {
  export async function Create(formData: FormData) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token not found. Please log in.");
      }

      const response = await axiosInstance.post<MemberModel>(
        "/api/v1/sch/member",
        formData, // Use the parameter correctly
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

  export async function Get() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token not found. Please log in.");
      }
      const response = await axiosInstance.get(
        "https://southcity.app.boundlesstechnologies.net/api/v1/sch/members",
        {
          headers: {
            "x-access-token": `${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
}


