import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Conexión a tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
