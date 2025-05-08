import { Course } from "@/types/course";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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

// Fetch courses for a specific instructor (tutor)
export async function fetchTutorCourses(tutorId: string): Promise<Course[]> {
  const res = await instance.get(`/courses/instructor/${tutorId}`);
  return res.data.courses || res.data;
}

// User profile type
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  qualification?: string;
  expertise?: string;
  experience?: number;
}

// Fetch instructor's students
export async function fetchInstructorStudents(instructorId: string): Promise<any[]> {
  const res = await instance.get(`/courses/instructor/${instructorId}/students`);
  return res.data;
}

// Fetch current user profile
export async function fetchCurrentUser(): Promise<UserProfile> {
  const res = await instance.get<{ user: UserProfile }>("/auth/me");
  return res.data.user;
}

// Update current user profile
export async function updateCurrentUserProfile(
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  const res = await instance.put<{ user: UserProfile }>("/auth/me", updates);
  return res.data.user;
}
