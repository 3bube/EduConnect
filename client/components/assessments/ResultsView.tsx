"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { getAssessmentResults } from "@/api/assessment";
import { useQuery } from "@tanstack/react-query";

interface AssessmentResultQuestion {
  id: string;
  text: string;
  type: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  category?: string;
}

interface AssessmentResultPerformance {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface AssessmentResult {
  assessmentId: string;
  title: string;
  courseTitle: string;
  submittedAt: string;
  timeSpent: number; // in seconds
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  isPassed: boolean;
  passingScore: number;
  questions: AssessmentResultQuestion[];
  performance: AssessmentResultPerformance;
}

export function ResultsView({ assessmentId }: { assessmentId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch assessment results
  const {
    data: resultsData,
    isLoading,
    error,
  } = useQuery<AssessmentResult>({
    queryKey: ["assessment-results", assessmentId],
    queryFn: async () => {
      try {
        return await getAssessmentResults(assessmentId);
      } catch (error) {
        console.error("Error fetching assessment results:", error);
        throw error;
      }
    },
    enabled: !!assessmentId,
  });

  console.log(resultsData);

  // Format time spent
  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds} seconds`;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Go back to assessments
  const handleBackToAssessments = () => {
    router.push("/assessments");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto flex h-[60vh] max-w-4xl items-center justify-center px-4 py-8 sm:px-6">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-lg">Loading assessment results...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !resultsData) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load assessment results. This could be because you
            haven&apos;t completed the assessment yet or there was an error
            processing your submission.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={handleBackToAssessments}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assessments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={handleBackToAssessments}
          className="mb-4 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">{resultsData.title}</h1>
            <p className="text-muted-foreground">
              {resultsData.courseTitle.title}
            </p>
          </div>
          <div className="flex items-center">
            <Button variant="outline" className="mr-2 flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download Results
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Score</CardTitle>
            <CardDescription>Your final assessment score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {resultsData.percentage.toFixed(1)}%
              </div>
              <Badge
                variant={resultsData.isPassed ? "default" : "destructive"}
                className="px-3 py-1"
              >
                {resultsData.isPassed ? "Passed" : "Failed"}
              </Badge>
            </div>
            <Progress
              value={resultsData.percentage}
              className="mt-2 h-2"
              indicatorColor={
                resultsData.isPassed ? "bg-green-600" : "bg-destructive"
              }
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Passing score: {resultsData.passingScore}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Questions</CardTitle>
            <CardDescription>Your performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-md bg-muted p-3">
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{resultsData.correctAnswers}</span>
                </div>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-md bg-muted p-3">
                <div className="flex items-center gap-1 text-destructive">
                  <XCircle className="h-4 w-4" />
                  <span>{resultsData.incorrectAnswers}</span>
                </div>
                <p className="text-xs text-muted-foreground">Incorrect</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Total questions: {resultsData.totalQuestions}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Time</CardTitle>
            <CardDescription>Assessment completion time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {formatTimeSpent(resultsData.timeSpent)}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Submitted: {formatDate(resultsData.submittedAt)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Overview</CardTitle>
              <CardDescription>
                Summary of your assessment performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 font-medium">Performance Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {resultsData.isPassed
                    ? "Congratulations! You have successfully passed this assessment."
                    : "Unfortunately, you didn&apos;t meet the passing score for this assessment."}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Strengths</h3>
                {resultsData.performance.strengths.length > 0 ? (
                  <ul className="ml-6 list-disc text-sm">
                    {resultsData.performance.strengths.map(
                      (strength, index) => (
                        <li key={index} className="mt-1">
                          {strength}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No particular strengths identified in this assessment.
                  </p>
                )}
              </div>

              <div>
                <h3 className="mb-2 font-medium">Areas for Improvement</h3>
                {resultsData.performance.weaknesses.length > 0 ? (
                  <ul className="ml-6 list-disc text-sm">
                    {resultsData.performance.weaknesses.map(
                      (weakness, index) => (
                        <li key={index} className="mt-1">
                          {weakness}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No significant weaknesses identified in this assessment.
                  </p>
                )}
              </div>

              <div>
                <h3 className="mb-2 font-medium">Recommendations</h3>
                {resultsData.performance.recommendations.length > 0 ? (
                  <ul className="ml-6 list-disc text-sm">
                    {resultsData.performance.recommendations.map(
                      (rec, index) => (
                        <li key={index} className="mt-1">
                          {rec}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No specific recommendations at this time.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
              <CardDescription>
                Review your answers and see the correct solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {resultsData.questions.map((question, index) => (
                  <div key={question.id} className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">
                          Question {index + 1} of {resultsData.totalQuestions}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {question.type === "multiple-choice"
                            ? "Multiple Choice"
                            : question.type === "multiple-select"
                            ? "Multiple Select"
                            : "True/False"}
                        </p>
                      </div>
                      <Badge
                        variant={question.isCorrect ? "outline" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {question.isCorrect ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" /> Incorrect
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <p className="font-medium">{question.text}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                          Your Answer
                        </h4>
                        <div className="rounded-md border p-3">
                          {Array.isArray(question.userAnswer) ? (
                            question.userAnswer.length > 0 ? (
                              <ul className="ml-6 list-disc">
                                {question.userAnswer.map((answer, idx) => (
                                  <li key={idx}>{answer}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="italic text-muted-foreground">
                                No answer provided
                              </p>
                            )
                          ) : (
                            <p>{question.userAnswer || "No answer provided"}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                          Correct Answer
                        </h4>
                        <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:bg-green-900/20">
                          {Array.isArray(question.correctAnswer) ? (
                            <ul className="ml-6 list-disc">
                              {question.correctAnswer.map((answer, idx) => (
                                <li key={idx}>{answer}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>{question.correctAnswer}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {index < resultsData.questions.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>
                Detailed analysis of your performance in different areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 font-medium">Performance by Category</h3>
                  {resultsData.performance.strengths.length === 0 &&
                  resultsData.performance.weaknesses.length === 0 ? (
                    <div className="rounded-md bg-muted p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Not enough data to analyze performance by category
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Strengths */}
                      <div>
                        <h4 className="mb-2 flex items-center text-sm font-medium text-green-600">
                          <Award className="mr-2 h-4 w-4" />
                          Strengths
                        </h4>
                        {resultsData.performance.strengths.length > 0 ? (
                          <div className="grid gap-2 sm:grid-cols-2">
                            {resultsData.performance.strengths.map(
                              (strength, i) => (
                                <div
                                  key={i}
                                  className="rounded-md border border-green-200 bg-green-50 p-2 dark:bg-green-900/20"
                                >
                                  <p className="text-sm">{strength}</p>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No particular strengths identified
                          </p>
                        )}
                      </div>

                      {/* Weaknesses */}
                      <div>
                        <h4 className="mb-2 flex items-center text-sm font-medium text-amber-600">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Areas for Improvement
                        </h4>
                        {resultsData.performance.weaknesses.length > 0 ? (
                          <div className="grid gap-2 sm:grid-cols-2">
                            {resultsData.performance.weaknesses.map(
                              (weakness, i) => (
                                <div
                                  key={i}
                                  className="rounded-md border border-amber-200 bg-amber-50 p-2 dark:bg-amber-900/20"
                                >
                                  <p className="text-sm">{weakness}</p>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No significant weaknesses identified
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="mb-4 font-medium">Recommendations</h3>
                  {resultsData.performance.recommendations.length > 0 ? (
                    <div className="space-y-3">
                      {resultsData.performance.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="rounded-md border bg-muted p-3 hover:bg-muted/80"
                        >
                          <p className="text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md bg-muted p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        No specific recommendations at this time
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
