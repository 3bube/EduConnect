import { QuizInterface } from "@/components/assessments/QuizInterface";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment | Student Tutor App",
  description: "Take an assessment to test your knowledge",
};

export default function AssessmentPage({ params }: { params: { id: string } }) {
  return <QuizInterface assessmentId={params.id} />;
}
