import { requestHandler } from "./handler";
import newRequest from "./newRequest";

export interface AssessmentQuestion {
  id: string;
  type: "multiple-choice" | "multiple-select" | "true-false";
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer?: string;
  correctAnswers?: string[];
}

export interface Assessment {
  title: string;
  description: string;
  courseId: string;
  type: "quiz" | "exam";
  timeLimit: string;
  dueDate: string;
  passingScore: string;
  category: string;
  status: "draft" | "published";
  questions: AssessmentQuestion[];
}

export const getAssessment = requestHandler(newRequest.get("/assessments"));

export const getAssessmentById = (id: string) =>
  requestHandler(newRequest.get(`/assessments/${id}`));

export const startAssessment = (id: string) =>
  requestHandler(newRequest.post(`/assessments/${id}/start`));

export const submitAssessment = (
  id: string,
  answers: Record<string, string | string[]>,
  timeSpent: number
) => {
  return requestHandler(
    newRequest.post(`/assessments/${id}/submit`, { answers, timeSpent })
  );
};

export const getAssessmentResults = (id: string) =>
  requestHandler(newRequest.get(`/assessments/${id}/results`));

export const getDetailedAssessmentResults = (id: string) =>
  requestHandler(newRequest.get(`/assessments/${id}/detailed-results`));

export const createAssessment = (assessment: Assessment) =>
  requestHandler(newRequest.post(`/assessments/create`, assessment));

export const getAssessmentForUser = () =>
  requestHandler(newRequest.get(`/assessments/user`));

export const getQuestion = (id: string) =>
  requestHandler(newRequest.get(`/assessments/${id}/question`));
