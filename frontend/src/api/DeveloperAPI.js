
import api from "./axios";

export const getDashboardStats = async () => {
  try {
    const { data } = await api.get("/developers/stats");
    return data;
  } catch (error) {
    if (error?.response?.data) {
      throw new Error(error.response.data.message || "Failed to fetch stats");
    }
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  const { data } = await api.put("/developers/profile", profileData);
  return data;
};

export const deleteAccount = async () => {
  const { data } = await api.delete("/developers/account");
  return data;
};
