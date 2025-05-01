import { Document, Types } from "mongoose";

export interface ILiveClass extends Document {
  id: string;
  title: string;
  description: string;
  subject: string;
  startTime: Date;
  endTime?: Date;
  isLive: boolean;
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  participants: {
    id: string;
    name: string;
    joinedAt: Date;
  }[];
  courseId?: Types.ObjectId | string; // Optional reference to a course
  meetingUrl: string; // URL for joining the live class
  meetingId: string; // Unique identifier for the meeting (could be used with external services)
  maxParticipants?: number;
  createdAt: Date;
  updatedAt: Date;
}
