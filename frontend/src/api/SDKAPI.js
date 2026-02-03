import api from "./axios";

/**
 * SDK related API calls for end-users
 */

export const loginLocalSDK = async (payload) => {
  try {
    const { data } = await api.post("/sdk/login-local", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTPSDK = async (payload) => {
  try {
    const { data } = await api.post("/sdk/verify-otp", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const resendVerificationSDK = async (payload) => {
  try {
    const { data } = await api.post("/sdk/resend-verification", payload);
    return data;
  } catch (error) {
    throw error;
  }
};
