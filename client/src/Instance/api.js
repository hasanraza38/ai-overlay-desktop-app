import axios from "axios";

export const api = axios.create({
  // baseURL: 'https://ai-overlay.vercel.app/api/v1/',
    baseURL: 'http://localhost:4000/api/v1/',
  withCredentials: true
});


// Request interceptor jo token headers mein daalega
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await window.electronAPI.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token added to headers:", token);
      } else {
        console.log("No token found in keytar");
      }
    } catch (error) {
      console.error("Error retrieving token for headers:", error);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);