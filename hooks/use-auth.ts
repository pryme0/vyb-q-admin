// src/hooks/useSignIn.ts
import { useMutation } from "@tanstack/react-query";
import axiosBase from "@/lib/axios.base";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

interface SignInResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
  };
  access_token: string;
  refresh_token: string;
}

interface SignInRequest {
  email: string;
  password: string;
}

export function useSignIn() {
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);

  const mutation = useMutation<SignInResponse, Error, SignInRequest>({
    mutationFn: async (credentials) => {
      const response = await axiosBase.post("/admin/signin", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      toast.success("Successfully signed in!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign in");
    },
  });

  return mutation;
}
