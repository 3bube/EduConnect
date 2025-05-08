"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, FileText, GraduationCap, Loader2, Plus, Search, User, Users } from "lucide-react";
import { format } from "date-fns";
import { getTutorAssessments } from "@/api/assessment";

interface AssessmentQuestion {
  _id: string;
  text: string;
  type: string;
  options: { id: string; text: string }[];
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
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  questions: AssessmentQuestion[];
  submissions?: number;
  averageScore?: number;
}

// Used internally in getAssessment API call

export default function TutorAssessmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [user, setUser] = useState<{_id: string; name: string} | null>(null);
  
  // Get user from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);
  
  // Fetch assessments created by this tutor
  useEffect(() => {
    async function fetchAssessments() {
      if (!user?._id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getTutorAssessments(user._id) as { assessments: Assessment[] };
        if (response && response.assessments) {
          setAssessments(response.assessments);
        }
      } catch (err) {
        console.error("Failed to fetch assessments:", err);
        setError("Failed to load assessments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAssessments();
  }, [user]);
  
  // Filter assessments based on search query and status
  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (assessment.category && assessment.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
          <div className="flex h-14 items-center border-b px-4 font-medium">Tutor Dashboard</div>
          <nav className="grid gap-1 p-2">
            <Link
              href="/tutor-dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              My Courses
            </Link>
            <Link
              href="/tutor-dashboard/students"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              Students
            </Link>
            <Link
              href="/tutor-dashboard/assessments"
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
            <Link
              href="/tutor-dashboard/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Assessments</h1>
                <p className="text-muted-foreground">Create and manage your course assessments</p>
              </div>
              <Button asChild>
                <Link href="/tutor-dashboard/assessments/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Assessment
                </Link>
              </Button>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search assessments..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assessments</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Assessments</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading assessments...</span>
                  </div>
                ) : error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    <p>{error}</p>
                  </div>
                ) : filteredAssessments.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No assessments found</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {searchQuery
                          ? "No assessments match your search criteria."
                          : "You haven&apos;t created any assessments yet."}
                      </p>
                      <Button asChild className="mt-4">
                        <Link href="/tutor-dashboard/assessments/create">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Assessment
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAssessments.map((assessment) => (
                      <Card key={assessment._id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{assessment.title}</CardTitle>
                              <CardDescription>{assessment.course?.title || "No course specified"}</CardDescription>
                            </div>
                            <Badge variant={assessment.status === "published" ? "default" : "secondary"}>
                              {assessment.status === "published" ? "Published" : "Draft"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Questions:</span>
                              <span>{assessment.questions.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Time Limit:</span>
                              <span>{assessment.timeLimit} minutes</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Due Date:</span>
                              <span>{assessment.dueDate && !isNaN(new Date(assessment.dueDate).getTime()) ? format(new Date(assessment.dueDate), 'PP') : 'No due date'}</span>
                            </div>
                            {assessment.submissions !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Submissions:</span>
                                <span>{assessment.submissions}</span>
                              </div>
                            )}
                            {assessment.averageScore !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Average Score:</span>
                                <span>{assessment.averageScore}%</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Last Updated:</span>
                              <span>{format(new Date(assessment.updatedAt), 'PP')}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" asChild>
                            <Link href={`/tutor-dashboard/assessments/${assessment._id}/result`}>View Results</Link>
                          </Button>
                          <Button asChild>
                            <Link href={`/tutor-dashboard/assessments/${assessment._id}/edit`}>Edit</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="published" className="mt-4">
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredAssessments.filter(a => a.status === "published").length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No published assessments</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        You haven&apos;t published any assessments yet.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAssessments
                      .filter(a => a.status === "published")
                      .map((assessment) => (
                        <Card key={assessment._id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{assessment.title}</CardTitle>
                            <CardDescription>{assessment.course?.title || "No course specified"}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Questions:</span>
                                <span>{assessment.questions.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Time Limit:</span>
                                <span>{assessment.timeLimit} minutes</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Due Date:</span>
                                <span>{assessment.dueDate && !isNaN(new Date(assessment.dueDate).getTime()) ? format(new Date(assessment.dueDate), 'PP') : 'No due date'}</span>
                              </div>
                              {assessment.submissions !== undefined && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Submissions:</span>
                                  <span>{assessment.submissions}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline" asChild>
                              <Link href={`/tutor-dashboard/assessments/${assessment._id}/result`}>Results</Link>
                            </Button>
                            <Button asChild>
                              <Link href={`/tutor-dashboard/assessments/${assessment._id}/edit`}>Edit</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="draft" className="mt-4">
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredAssessments.filter(a => a.status === "draft").length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No draft assessments</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        You don't have any draft assessments.
                      </p>
                      <Button asChild className="mt-4">
                        <Link href="/tutor-dashboard/assessments/create">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Assessment
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAssessments
                      .filter(a => a.status === "draft")
                      .map((assessment) => (
                        <Card key={assessment._id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{assessment.title}</CardTitle>
                            <CardDescription>{assessment.course?.title || "No course specified"}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Questions:</span>
                                <span>{assessment.questions.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Updated:</span>
                                <span>{format(new Date(assessment.updatedAt), 'PP')}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" asChild>
                              <Link href={`/tutor-dashboard/assessments/${assessment._id}/edit`}>Continue Editing</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
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
