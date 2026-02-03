import { useMutation } from '@tanstack/react-query';
import api from '@/api/axios';

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post('/developers/login', { email, password });
      return data;
    },
  });
};
