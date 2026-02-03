import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import {
  loginLocalSDK,
  verifyOTPSDK,
  resendVerificationSDK,
} from "@/api/SDKAPI";

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password, sdk_request }) => {
      if (sdk_request) {
        return await loginLocalSDK({ email, password, sdk_request });
      }
      const { data } = await api.post("/developers/login", { email, password });
      return data;
    },
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: async (payload) => {
      return await verifyOTPSDK(payload);
    },
  });
};

export const useResendOTP = () => {
  return useMutation({
    mutationFn: async (payload) => {
      return await resendVerificationSDK(payload);
    },
  });
};
