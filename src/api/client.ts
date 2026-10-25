import axios from 'axios';
import { readStoredUser } from '../context/storage';

export const API_URL = import.meta.env.VITE_API_URL ?? 'https://blogify-server-nine.vercel.app';

export const api = axios.create({ baseURL: API_URL });

// Attach the bearer token to every request when the user is logged in.
api.interceptors.request.use((config) => {
  const token = readStoredUser()?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
