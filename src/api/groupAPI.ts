import apiClient from "@/api/ApiClient/ApiClient";
import { GroupModel } from "@/app/models/Group/group";
import axios from "axios";

export namespace GroupAPI {
    export async function Create(GroupData: GroupModel) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Token not found. Please log in.");
        }
  
        const response = await apiClient.post<GroupModel>(
          "/api/v1/sch/group",
          JSON.stringify(GroupData),
          {
            headers: {
              "Content-Type": "application/json",
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
        const response = await apiClient.get(
          "https://southcity.app.boundlesstechnologies.net/api/v1/sch/groups"
        ,{
          headers: {
            "x-access-token": `${token}`,
          },
        });
        console.log(response.data);
        return response;
      } catch (error) {
        throw Error;
      }
    }
    
  }
  
