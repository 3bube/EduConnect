import { Schema, model } from "mongoose";
import { IAssessmentSubmission } from "../interface/assessments.interface";

const assessmentSubmissionSchema = new Schema<IAssessmentSubmission>(
  {
    assessment: { 
      type: Schema.Types.ObjectId, 
      ref: "Assessment", 
      required: true 
    },
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    answers: [
      {
        question: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedOption: { type: String },
        selectedOptions: [{ type: String }],
        isCorrect: { type: Boolean, required: true },
      },
    ],
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    timeSpent: { type: Number, required: true }, // in minutes
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    certificate: {
      _id: { type: Schema.Types.ObjectId, ref: "Certificate" },
      credentialId: { type: String }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default model<IAssessmentSubmission>("AssessmentSubmission", assessmentSubmissionSchema);
