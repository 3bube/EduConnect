import { requestHandler } from "./handler";
import newRequest from "./newRequest";
import { Course } from "./course";

export interface EnrolledCourse extends Course {
  progress: number;
  nextLesson?: {
    id: string;
    title: string;
  };
  completedLessons: number;
}

export interface UpcomingAssignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue";
}

export interface UpcomingClass {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  startTime: string;
  endTime: string;
  tutor: string;
}

export interface StudentDashboardData {
  enrolledCourses: EnrolledCourse[];
  upcomingAssignments: UpcomingAssignment[];
  upcomingClasses: UpcomingClass[];
  recommendedCourses: Course[];
  stats: {
    overallCompletion: number;
    coursesEnrolled: number;
    hoursStudied: number;
    assignmentsCompleted: number;
    totalAssignments: number;
  };
}

export interface EnrolledCoursesResponse {
  courses: EnrolledCourse[];
}

export interface UpcomingAssignmentsResponse {
  assignments: UpcomingAssignment[];
}

export interface RecommendedCoursesResponse {
  courses: Course[];
}

export interface UpcomingClassesResponse {
  classes: UpcomingClass[];
}

export interface LearningStatsResponse {
  stats: StudentDashboardData["stats"];
}

export const getStudentDashboard = async (): Promise<StudentDashboardData> => {
  try {
    const response = await requestHandler<StudentDashboardData>(
      newRequest.get("/student/dashboard")
    );
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch dashboard data"
    );
  }
};

export const getEnrolledCourses = async (): Promise<EnrolledCourse[]> => {
  try {
    const response = await requestHandler<EnrolledCoursesResponse>(
      newRequest.get("/student/courses/enrolled")
    );
    if (!response || !response.courses) {
      return [];
    }
    return response.courses;
  } catch (error) {
    console.error("Failed to fetch enrolled courses:", error);
    return [];
  }
};

export const getUpcomingAssignments = async (): Promise<
  UpcomingAssignment[]
> => {
  try {
    const response = await requestHandler<UpcomingAssignmentsResponse>(
      newRequest.get("/student/assessments/upcoming")
    );
    if (!response || !response.assignments) {
      return [];
    }
    return response.assignments;
  } catch (error) {
    console.error("Failed to fetch upcoming assignments:", error);
    return [];
  }
};

export const getRecommendedCourses = async (): Promise<Course[]> => {
  try {
    const response = await requestHandler<RecommendedCoursesResponse>(
      newRequest.get("/student/courses/recommended")
    );
    if (!response || !response.courses) {
      return [];
    }
    return response.courses;
  } catch (error) {
    console.error("Failed to fetch recommended courses:", error);
    return [];
  }
};

export const getUpcomingClasses = async (): Promise<UpcomingClass[]> => {
  try {
    const response = await requestHandler<UpcomingClassesResponse>(
      newRequest.get("/student/classes/upcoming")
    );
    if (!response || !response.classes) {
      return [];
    }
    return response.classes;
  } catch (error) {
    console.error("Failed to fetch upcoming classes:", error);
    return [];
  }
};

export const getLearningStats = async (): Promise<
  StudentDashboardData["stats"]
> => {
  try {
    const response = await requestHandler<LearningStatsResponse>(
      newRequest.get("/student/stats")
    );
    if (!response || !response.stats) {
      return {
        overallCompletion: 0,
        coursesEnrolled: 0,
        hoursStudied: 0,
        assignmentsCompleted: 0,
        totalAssignments: 0,
      };
    }
    return response.stats;
  } catch (error) {
    console.error("Failed to fetch learning stats:", error);
    return {
      overallCompletion: 0,
      coursesEnrolled: 0,
      hoursStudied: 0,
      assignmentsCompleted: 0,
      totalAssignments: 0,
    };
  }
};
