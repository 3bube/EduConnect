import mongoose, { Schema } from "mongoose";

export interface ICertificate extends Document {
  title: string;
  issueDate: Date;
  expiryDate: Date;
  userId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
  assessmentId: Schema.Types.ObjectId;
  issuer: string;
  credentialID: string;
  grade: string;
  skills: string[];
}

const CertificateSchema = new Schema(
  {
    title: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assessment",
      required: true
    },
    issuer: { type: String, default: "EduConnect" },
    credentialID: { type: String, required: true },
    grade: { type: String, required: true },
    skills: [{ type: String }]
  },
  { timestamps: true }
);

// Generate a unique credential ID
CertificateSchema.pre("save", function(next) {
  if (this.isNew) {
    const prefix = this.title.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    const timestamp = Date.now().toString().slice(-4);
    this.credentialID = `${prefix}-${random}-${timestamp}`;
  }
  next();
});

const Certificate = mongoose.model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;
