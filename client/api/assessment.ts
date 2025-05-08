/* eslint-disable @typescript-eslint/no-explicit-any */
import { requestHandler } from "./handler";
import newRequest from "./newRequest";

export interface AssessmentQuestion {
  _id: string;
  id?: string;
  type: "multiple-choice" | "multiple-select" | "true-false";
  text: string;
  question?: string; // Some endpoints return question instead of text
  options: Array<string | { id: string; text: string; }>;
  correctAnswer?: string;
  correctAnswers?: string[];
  correctOption?: string; // Some endpoints use correctOption instead of correctAnswer
}

export interface Assessment {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  course?: {
    _id: string;
    title: string;
  };
  type: "quiz" | "exam";
  timeLimit: number;
  dueDate: string;
  passingScore: number;
  category: string;
  status: "draft" | "published" | "not_started" | "in_progress" | "completed";
  questions: AssessmentQuestion[];
}

export interface AssessmentResponse {
  assessment: Assessment;
  message?: string;
}

export interface QuestionsResponse {
  questions: AssessmentQuestion[];
  message?: string;
}

export interface UserAssessmentStatus {
  userStatus: "not_started" | "in_progress" | "completed";
  message: string;
  assessment: {
    _id: string;
    title: string;
    description: string;
    questions: AssessmentQuestion[];
    timeLimit: number;
    dueDate: string;
    type: string;
    [key: string]: any; // For any other properties
  };
}

export interface UserAssessmentsResponse {
  assessment: Assessment[];
  message?: string;
}

export interface AssessmentSubmissionResponse {
  message: string;
  assessmentId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  isPassed: boolean;
  passingScore: number;
  timeSpent: number;
  submittedAt: string;
  certificate?: {
    id: string;
    title: string;
    credentialId: string;
    issueDate: string;
    grade: string;
  };
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOption?: string;
  selectedOptions?: string[];
  isCorrect: boolean;
}

export interface AssessmentResult {
  _id: string;
  assessmentId: string;
  userId: string;
  assessment: Assessment;
  answers: AssessmentAnswer[];
  score: number;
  passed: boolean;
  startTime: string;
  endTime: string;
  totalTime: number;
  certificate?: {
    _id: string;
    credentialId: string;
  };
}

export interface AssessmentResultResponse {
  result: AssessmentResult;
}

export const getAssessment = (params?: Record<string, any>) => {
  let url = "/assessments";
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  return requestHandler(newRequest.get(url));
};

export const getTutorAssessments = (tutorId: string) => {
  return requestHandler(newRequest.get(`/assessments/tutor/${tutorId}`));
};

export const getAssessmentById = (id: string) =>
  requestHandler<AssessmentResponse>(newRequest.get(`/assessments/${id}`));

// Separate function to fetch assessment questions
export const getAssessmentQuestions = (id: string) =>
  requestHandler<QuestionsResponse>(newRequest.get(`/assessments/${id}/questions`));

export const startAssessment = (id: string) =>
  requestHandler<UserAssessmentStatus>(
    newRequest.post(`/assessments/${id}/start`)
  );

export const submitAssessment = (
  id: string,
  answers: Record<string, string | string[]>,
  timeSpent: number
) => {
  return requestHandler<AssessmentSubmissionResponse>(
    newRequest.post(`/assessments/${id}/submit`, { answers, timeSpent })
  );
};

export const getAssessmentResults = (id: string) =>
  requestHandler<AssessmentResultResponse>(newRequest.get(`/assessments/${id}/results`));

export const getDetailedAssessmentResults = (id: string) =>
  requestHandler(newRequest.get(`/assessments/${id}/detailed-results`));

export const createAssessment = (assessment: Assessment) =>
  requestHandler(newRequest.post(`/assessments/create`, assessment));

export const getAssessmentForUser = () =>
  requestHandler<UserAssessmentsResponse>(newRequest.get(`/assessments/user`));

export const getQuestion = (id: string) =>
  requestHandler(newRequest.get(`/assessments/${id}/question`));
