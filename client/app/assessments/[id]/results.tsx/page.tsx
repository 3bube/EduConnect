import { ResultsView } from "@/components/assessments/ResultsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment Results | Student Tutor App",
  description: "View your assessment results and feedback",
};

export default function ResultsPage({ params }: { params: { id: string } }) {
  return <ResultsView assessmentId={params.id} />;
}
