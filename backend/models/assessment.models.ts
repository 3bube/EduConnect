import mongoose, { Schema } from "mongoose";
import { IAssessment } from "../interface";

const AssessmentSchema: Schema = new Schema<IAssessment>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    course: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    questions: { type: Number, required: true },
    timeLimit: { type: Number, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, required: true },
    submissions: [
      {
        userId: { type: String, required: true },
        answers: { type: Array, required: true },
        timeSpent: { type: Number, required: true },
      },
    ],
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Assessment = mongoose.model<IAssessment>("Assessment", AssessmentSchema);

export default Assessment;
