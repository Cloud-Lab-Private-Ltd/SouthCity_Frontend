import apiClient from "@/api/ApiClient/ApiClient";
import axiosIntance from "@/api/ApiClient/ApiClient";
import { BatchModel } from "@/app/models/Batch/batch";

export namespace BatchAPI {
  export async function Create(BatchData: BatchModel) {
    try {
      const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Token not found. Please log in.");
        }
      const response = await apiClient.post<BatchModel>(
        "/api/v1/sch/batches",
        BatchData,
        {
          headers: {
            "Content-Type": "application/json",
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
      const response = await axiosIntance.get(
        "https://southcity.app.boundlesstechnologies.net/api/v1/sch/batches"
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