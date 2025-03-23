import { Document } from "mongoose";

export interface ILesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  order: number;
  type: string;
  resources: {
    id: string;
    title: string;
    type: string;
    url: string;
  }[];
  completed: boolean;
  nextLessonId: string;
  prevLessonId: string;
}

export interface ICourse extends Document {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  price: number;
  image: string;
  featured: boolean;
  tags: string[];
  progress: number;
  completedLessons: string[];
  nextLesson: { id: string; title: string };
  lessons: ILesson[];
}
