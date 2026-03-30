import { apiGet, apiPost } from './api';
import { getToken } from './auth';
import type { AuthUser, UserRole } from '../types/auth';

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = LoginRequest;

type MessageResponse = {
  message: string;
};

type AuthResponse = {
  token: string;
  userId: string;
  username: string;
  role: UserRole;
  message: string;
};

export async function register(request: RegisterRequest): Promise<MessageResponse> {
  return apiPost<RegisterRequest, MessageResponse>('/api/auth/register', request);
}

export async function login(request: LoginRequest): Promise<{ token: string; user: AuthUser }> {
  const res = await apiPost<LoginRequest, AuthResponse>('/api/auth/login', request);
  return {
    token: res.token,
    user: {
      userId: res.userId,
      username: res.username,
      role: res.role,
    },
  };
}

export async function getMe(): Promise<AuthUser> {
  const token = getToken();
  if (!token) {
    throw new Error('UNAUTHORIZED');
  }
  return apiGet<MeResponse>('/api/auth/me');
}

type MeResponse = AuthUser;
