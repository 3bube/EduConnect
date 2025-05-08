"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const assessmentSubmissionSchema = new mongoose_1.Schema({
    assessment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    answers: [
        {
            question: {
                type: mongoose_1.Schema.Types.ObjectId,
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
        _id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Certificate" },
        credentialId: { type: String }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.default = (0, mongoose_1.model)("AssessmentSubmission", assessmentSubmissionSchema);
