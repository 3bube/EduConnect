import { Document, Types } from "mongoose";
import { IQuestion } from "./question.interface";

export interface IAssessmentAnswer {
  questionId: Types.ObjectId;
  selectedAnswer?: string | null;
  selectedAnswers?: string[];
  isCorrect: boolean;
}

export interface IAssessmentSubmission {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  assessment: Types.ObjectId;
  user: Types.ObjectId;
  answers: IAssessmentAnswer[];
  score: number;
  passed: boolean;
  timeSpent: number;
  startTime: Date;
  endTime: Date;
  submittedAt: Date | undefined;
  certificate?: {
    _id: Types.ObjectId;
    credentialId: string;
  };
}

export interface IAssessment extends Document {
  title: string;
  course: {
    _id: Types.ObjectId;
    title: string;
  };
  description: string;
  type: "quiz" | "exam" | "assignment";
  questions: Types.ObjectId[];
  timeLimit: number;
  dueDate: string;
  status: "not_started" | "in_progress" | "completed" | "published" | "draft";
  passingScore: number;
  category: string;
  submissions: IAssessmentSubmission[];
  createdBy: Types.ObjectId;
  averageScore: number; // Virtual field
  userScore?: number; // User's score for this assessment
}
