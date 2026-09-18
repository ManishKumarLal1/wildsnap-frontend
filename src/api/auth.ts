import api from "./client";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  last_observation_date?: string | null;
  location?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });

  return response.data;
}

export async function login(
  identifier: string,
  password: string
): Promise<LoginResponse> {
  const response = await api.post("/auth/login", {
    identifier,
    password,
  });

  return response.data;
}

export async function resendVerification(
  identifier: string
) {
  const response = await api.post(
    "/auth/resend-verification",
    {
      identifier,
    }
  );

  return response.data;
}

export async function getMe(token: string) {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function logout(token: string) {
  const response = await api.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function forgotPassword(email: string) {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
}

export async function resetPassword(
  token: string,
  password: string
) {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
  });

  return response.data;
}