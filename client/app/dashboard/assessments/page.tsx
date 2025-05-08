"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CalendarIcon, Clock, FileText, GraduationCap, Loader2, Search, User } from "lucide-react";
import { getAssessmentForUser } from "@/api/assessment";
import { format } from "date-fns";

interface AssessmentQuestion {
  _id: string;
  id: string;
  text: string;
  type: string;
  options: { id: string; text: string }[];
}

interface AssessmentApiResponse {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  course?: {
    _id: string;
    title: string;
  };
  type: "quiz" | "exam";
  timeLimit: number;
  dueDate: string;
  passingScore: number;
  category: string;
  status: string;
  questions: Array<{
    _id: string;
    id?: string;
    text?: string;
    type?: string;
    options: Array<{ id: string; text: string } | string>;
  }>;
  score?: number;
  averageScore?: number;
  completedDate?: string;
  endTime?: string;
  submittedAt?: string;
}

interface Assessment {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  course?: {
    _id: string;
    title: string;
  };
  type: "quiz" | "exam";
  timeLimit: number;
  dueDate: string;
  passingScore: number;
  category: string;
  status: "not_started" | "in_progress" | "completed";
  questions: AssessmentQuestion[];
  score?: number;
  averageScore?: number;
  completedDate?: string;
}


export default function StudentAssessmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAssessmentForUser();
        if (response && response.assessment) {
          // Explicitly cast the API response to our interface
          const apiAssessments = response.assessment as unknown as AssessmentApiResponse[];
          
          // Map API assessments to our local interface format
          const mappedAssessments = apiAssessments.map(item => {
            // Convert any draft/published status to not_started for compatibility
            let status: "not_started" | "in_progress" | "completed" = "not_started";
            if (item.status === "in_progress") status = "in_progress";
            if (item.status === "completed") status = "completed";
            
            // Transform questions if needed to match our local format
            const questions = item.questions?.map(q => ({
              _id: q._id,
              id: q.id || q._id,
              text: q.text || "",
              type: q.type || "multiple-choice",
              options: Array.isArray(q.options) ? q.options.map(opt => {
                if (typeof opt === 'string') {
                  return { id: opt, text: opt };
                }
                return opt;
              }) : []
            })) || [];
            
            // Map the assessment with proper score handling
            return {
              ...item,
              status,
              questions,
              // Make sure the score property exists for completed assessments
              score: item.status === "completed" ? (item.score || item.averageScore || 0) : 0,
              completedDate: item.completedDate || item.endTime || null
            } as Assessment;
          });
          
          setAssessments(mappedAssessments);
        }
      } catch (err) {
        console.error("Error fetching assessments:", err);
        setError("Failed to load assessments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssessments();
  }, []);

  // Filter assessments based on status
  const upcomingAssessments = assessments.filter(
    (assessment) => assessment.status !== "completed"
  );
  
  const completedAssessments = assessments.filter(
    (assessment) => assessment.status === "completed"
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span>EduConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[250px] flex-col border-r md:flex">
          <div className="flex h-14 items-center border-b px-4 font-medium">Student Dashboard</div>
          <nav className="grid gap-1 p-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              My Courses
            </Link>
            <Link
              href="/dashboard/browse"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              Browse Courses
            </Link>
            <Link
              href="/dashboard/assessments"
              className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              Assessments
            </Link>
            {/* <Link
              href="/dashboard/results"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Results
            </Link> */}
            <Link
              href="/dashboard/certificates"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <path d="M13 2v7h7" />
              </svg>
              Certificates
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Assessments</h1>
              <p className="text-muted-foreground">View and take your course assessments</p>
            </div>

            <Tabs defaultValue="upcoming">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="space-y-4">
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading assessments...</span>
                  </div>
                ) : error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    <p>Failed to load assessments. Please try again later.</p>
                  </div>
                ) : upcomingAssessments.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10 text-muted-foreground"
                      >
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                      <h3 className="mt-4 text-lg font-semibold">No upcoming assessments</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        You don&apos;t have any assessments to complete at the moment.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingAssessments.map((assessment) => (
                      <Card key={assessment._id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{assessment.title}</CardTitle>
                          <CardDescription>{assessment.course?.title}</CardDescription>
                          <Badge variant={assessment.type === 'quiz' ? "secondary" : "destructive"}>
                            {assessment.type === 'quiz' ? 'Quiz' : 'Exam'}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center gap-1 text-sm">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>Due: {assessment.dueDate && !isNaN(new Date(assessment.dueDate).getTime()) ? format(new Date(assessment.dueDate), 'PP') : 'No due date'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Time Limit: {assessment.timeLimit} minutes</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>Questions: {assessment.questions.length}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Badge 
                                variant={assessment.status === 'not_started' ? "outline" : "secondary"}
                                className="capitalize"
                              >
                                {assessment.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" asChild>
                            <Link href={`/assessments/${assessment._id}`}>
                              {assessment.status === 'in_progress' ? 'Continue Assessment' : 'Start Assessment'}
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading assessments...</span>
                  </div>
                ) : error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    <p>Failed to load assessments. Please try again later.</p>
                  </div>
                ) : completedAssessments.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10 text-muted-foreground"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <h3 className="mt-4 text-lg font-semibold">No completed assessments</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        You haven&apos;t completed any assessments yet.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {completedAssessments.map((assessment) => {
                      console.log("Completed assessment:", assessment._id, "Score:", assessment.score, "Status:", assessment.status);
                      return (
                        <Card key={assessment._id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{assessment.title}</CardTitle>
                            <CardDescription>{assessment.course?.title}</CardDescription>
                            <Badge variant={assessment.type === 'quiz' ? "secondary" : "destructive"}>
                              {assessment.type === 'quiz' ? 'Quiz' : 'Exam'}
                            </Badge>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center gap-1 text-sm">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span>Completed: {assessment.completedDate && !isNaN(new Date(assessment.completedDate).getTime()) ? format(new Date(assessment.completedDate), 'PP') : 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span>Score: {assessment.score || 0}%</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Badge 
                                  variant={assessment.score && assessment.score >= assessment.passingScore ? "secondary" : "destructive"}
                                >
                                  {assessment.score && assessment.score >= assessment.passingScore ? "Passed" : "Failed"}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" variant="outline" asChild>
                              <Link href={`/assessments/${assessment._id}/results`}>View Results</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
