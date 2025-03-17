import { AssessmentList } from "@/components/assessments/AssessmentList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessments | Student Tutor App",
  description: "View and take assessments to test your knowledge",
};

export default function AssessmentsPage() {
  return <AssessmentList />;
}
