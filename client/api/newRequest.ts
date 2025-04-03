import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://edu-connect-backend-taupe.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

newRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

newRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    throw error;
  }
);

export default newRequest;
