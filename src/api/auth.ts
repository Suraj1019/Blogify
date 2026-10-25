import { api } from './client';
import type { User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  name: string;
}

export const login = (data: LoginPayload) => api.post<User>('/auth/login', data).then((r) => r.data);

export const signup = (data: SignupPayload) => api.post('/auth/signup', data).then((r) => r.data);
