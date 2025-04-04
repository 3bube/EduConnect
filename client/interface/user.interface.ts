export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "tutor";
  avatar?: string;
  accessToken?: string;
  enrolledCourses?: Array<{
    _id: string;
  }>;
}
