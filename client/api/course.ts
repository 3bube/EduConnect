import { requestHandler } from "./handler";
import newRequest from "./newRequest";

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  duration: string;
  image: string;
  tags: string[];
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  rating?: number;
  numberOfStudents?: number;
  featured?: boolean;
  lessons?: {
    id: string;
    title: string;
    content: string;
    duration: string;
    order: number;
  }[];
  assessments?: {
    id: string;
    title: string;
    description: string;
    type: "quiz" | "exam" | "assignment";
    duration: string;
    totalPoints: number;
    dueDate?: string;
  }[];
}

export interface CourseResponse {
  courses: Course[];
  total?: number;
}

export interface MarkLessonCompleteParams {
  courseId: string;
  lessonId: string;
}

export const getAllCourses = async (): Promise<CourseResponse> => {
  try {
    const response = await requestHandler<CourseResponse>(
      newRequest.get("/courses")
    );
    return response;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch courses");
  }
};

export const getCourseById = async (courseId: string): Promise<Course> => {
  try {
    const response = await requestHandler<Course>(
      newRequest.get(`/courses/${courseId}`)
    );
    if (!response) {
      throw new Error("Course not found");
    }
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch course"
    );
  }
};

export const enrollCourse = async (courseId: string): Promise<Course> => {
  try {
    const response = await requestHandler<Course>(
      newRequest.post(`/courses/${courseId}/enroll`)
    );
    return response;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to enroll in course");
  }
};

export const markLessonComplete = async ({
  courseId,
  lessonId,
}: MarkLessonCompleteParams): Promise<Course> => {
  try {
    const response = await requestHandler<Course>(
      newRequest.post(`/courses/${courseId}/lessons/${lessonId}/complete`)
    );
    return response;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to mark lesson as complete");
  }
};

export const getCoursesForInstructor = async (
  instructorId: string
): Promise<CourseResponse> => {
  try {
    const response = await requestHandler<CourseResponse>(
      newRequest.get(`/courses/instructor/${instructorId}`)
    );
    if (!response) {
      throw new Error("No courses found");
    }
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch courses"
    );
  }
};

export const createCourse = async (course: Course): Promise<Course> => {
  try {
    const response = await requestHandler<Course>(
      newRequest.post("/courses", course)
    );
    return response;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to create course");
  }
};
