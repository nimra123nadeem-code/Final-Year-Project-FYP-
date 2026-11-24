// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:800/api', // Base URL for all requests
  timeout: 5000, // Optional: timeout after 5 seconds
});

export default api;