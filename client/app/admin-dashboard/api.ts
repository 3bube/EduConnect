import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage to every request
instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});
import { User } from "@/types/user";
import { Course } from "@/types/course";

// Fetch all users (admin only)
export async function fetchUsers(): Promise<User[]> {
  const res = await instance.get("/admin/users");
  return res.data;
}

// Delete a user by ID (admin only)
export async function deleteUser(userId: string): Promise<void> {
  await instance.delete(`/admin/users/${userId}`);
}

// Fetch all courses
export async function fetchCourses(): Promise<Course[]> {
  const res = await instance.get("/courses");
  return res.data.courses || res.data;
}

// Delete a course by ID (admin only)
export async function deleteCourse(courseId: string): Promise<void> {
  await instance.delete(`/admin/courses/${courseId}`);
}
