import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api', // adapte si besoin
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
