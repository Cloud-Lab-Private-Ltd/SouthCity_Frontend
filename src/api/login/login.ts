import apiClient from "../../api/ApiClient/ApiClient";

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post(
      "/api/v1/sch/auth/login",
      { email, password }
    );

    const token = response.data.token; // Adjust this based on the API response structure
    if (token) {
      localStorage.setItem("authToken", token); // Store token in localStorage
    } else {
      throw new Error("Token not received in response.");
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
