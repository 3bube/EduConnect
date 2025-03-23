import { Document, Types } from "mongoose";
import { IQuestion } from "./question.interface";

export interface IAssessment extends Document {
  id: string;
  title: string;
  course: string;
  description: string;
  type: string;
  questions: IQuestion[];
  performance: {
    score: number;
    timeSpent: number;
  };
  timeLimit: number;
  dueDate: string;
  status: string;
  score: number;
  passingScore: number;
  category: string;
  submissions: {
    userId: Types.ObjectId;
    answers: any[];
    timeSpent: number;
  }[];
}
