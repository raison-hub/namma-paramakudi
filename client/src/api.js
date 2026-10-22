import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://namma-paramakudi-api.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;