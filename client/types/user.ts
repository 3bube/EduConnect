export interface User {
  _id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  education: {
    institution: string;
    degree: string;
    yearOfStudy: string;
  };
  interests: string[];
  role: "student" | "tutor" | "admin";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "student" | "tutor" | "admin";
}

export interface AuthContextType {
  user: User | null;
  updateUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
