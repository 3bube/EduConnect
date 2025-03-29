import newRequest from "./newRequest";
import { requestHandler } from "./handler";

// Define response types
export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: "student" | "tutor" | "parent" | "admin";
    avatar?: string;
  };
  token: string;
}

// Define registration data type
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "student" | "tutor";
}

export const login = async (email: string, password: string) =>
  requestHandler<AuthResponse>(
    newRequest.post("/auth/signin", { email, password })
  );

export const register = async (userData: RegisterData) =>
  requestHandler<AuthResponse>(newRequest.post("/auth/register", userData));
