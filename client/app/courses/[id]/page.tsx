import { CourseDetails } from "@/components/courses/CourseDetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Details | Student Tutor App",
  description: "View course details and enroll",
};

export default function CourseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <CourseDetails courseId={params.id} />;
}
