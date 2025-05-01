import mongoose, { Schema } from "mongoose";
import { ILiveClass } from "../interface";

// Create participant schema for nested participants in live class
const ParticipantSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now }
});

// Create Live Class Schema
const LiveClassSchema: Schema = new Schema<ILiveClass>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    isLive: { type: Boolean, default: false },
    instructor: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      avatar: { type: String }
    },
    participants: [ParticipantSchema],
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    meetingUrl: { type: String, required: true },
    meetingId: { type: String, required: true },
    maxParticipants: { type: Number, default: 100 }
  },
  { timestamps: true }
);

const LiveClass = mongoose.model<ILiveClass>("LiveClass", LiveClassSchema);

export default LiveClass;
