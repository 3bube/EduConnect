"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Timer,
} from "lucide-react";

// Mock data
const assessments = [
  {
    id: "assessment-1",
    title: "Algebra Fundamentals Quiz",
    course: "Introduction to Mathematics",
    description: "Test your understanding of basic algebraic concepts",
    type: "quiz",
    questions: 15,
    timeLimit: 30, // minutes
    dueDate: "2023-09-20T23:59:59",
    status: "not_started", // not_started, in_progress, completed
    category: "Mathematics",
  },
  {
    id: "assessment-2",
    title: "Literary Analysis Midterm",
    course: "Advanced English Literature",
    description:
      "Analyze passages from Shakespeare's works and answer critical thinking questions",
    type: "exam",
    questions: 25,
    timeLimit: 90, // minutes
    dueDate: "2023-09-18T23:59:59",
    status: "in_progress",
    progress: 40,
    category: "Literature",
  },
  {
    id: "assessment-3",
    title: "Physics Laws Quiz",
    course: "Physics 101",
    description: "Test your knowledge of Newton's laws and their applications",
    type: "quiz",
    questions: 10,
    timeLimit: 20, // minutes
    dueDate: "2023-09-15T23:59:59",
    status: "completed",
    score: 85,
    category: "Physics",
  },
  {
    id: "assessment-4",
    title: "Programming Concepts Test",
    course: "Introduction to Computer Science",
    description:
      "Evaluate your understanding of basic programming concepts and syntax",
    type: "quiz",
    questions: 20,
    timeLimit: 45, // minutes
    dueDate: "2023-09-25T23:59:59",
    status: "not_started",
    category: "Computer Science",
  },
  {
    id: "assessment-5",
    title: "Ancient Civilizations Final Exam",
    course: "World History",
    description:
      "Comprehensive assessment of ancient civilizations and their impact on modern society",
    type: "exam",
    questions: 50,
    timeLimit: 120, // minutes
    dueDate: "2023-10-05T23:59:59",
    status: "not_started",
    category: "History",
  },
];

const certificates = [
  {
    id: "cert-1",
    title: "Introduction to Mathematics",
    issueDate: "2023-08-15",
    expiryDate: "2026-08-15",
    issuer: "Student Tutor Academy",
    credentialID: "STM-1234-5678",
    grade: "A",
    skills: ["Algebra", "Geometry", "Calculus"],
  },
  {
    id: "cert-2",
    title: "Basic Physics Principles",
    issueDate: "2023-07-10",
    expiryDate: "2026-07-10",
    issuer: "Student Tutor Academy",
    credentialID: "STP-5678-1234",
    grade: "B+",
    skills: ["Mechanics", "Thermodynamics", "Waves"],
  },
];

const categories = [
  "All Categories",
  "Mathematics",
  "Literature",
  "Physics",
  "Computer Science",
  "History",
];

export function AssessmentList() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter assessments based on search query and category
  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      assessment.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Calculate days remaining
  const getDaysRemaining = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Assessments & Certifications
        </h1>
        <p className="text-muted-foreground">
          Take quizzes and exams to test your knowledge and earn certificates.
        </p>
      </div>

      <Tabs defaultValue="assessments" className="mb-8">
        <TabsList>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assessments..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="assessments" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAssessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {assessment.category}
                      </Badge>
                      <CardTitle>{assessment.title}</CardTitle>
                      <CardDescription>{assessment.course}</CardDescription>
                    </div>
                    {assessment.status === "completed" ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        {assessment.score}%
                      </Badge>
                    ) : assessment.status === "in_progress" ? (
                      <Badge variant="secondary">In Progress</Badge>
                    ) : (
                      <Badge variant="outline">
                        {getDaysRemaining(assessment.dueDate) <= 2 ? (
                          <span className="text-red-500">Due Soon</span>
                        ) : (
                          "Not Started"
                        )}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">{assessment.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {assessment.questions}{" "}
                        {assessment.questions === 1 ? "question" : "questions"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Timer className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{assessment.timeLimit} min</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Due: {formatDate(assessment.dueDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline">
                        {assessment.type === "quiz" ? "Quiz" : "Exam"}
                      </Badge>
                    </div>
                  </div>

                  {assessment.status === "in_progress" && (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">
                          {assessment.progress}%
                        </span>
                      </div>
                      <Progress value={assessment.progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {assessment.status === "completed" ? (
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/assessments/${assessment.id}/results`}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        View Results
                      </Link>
                    </Button>
                  ) : assessment.status === "in_progress" ? (
                    <Button asChild className="w-full">
                      <Link href={`/assessments/${assessment.id}`}>
                        <Clock className="mr-2 h-4 w-4" />
                        Continue
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full">
                      <Link href={`/assessments/${assessment.id}`}>
                        Start Assessment
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredAssessments.length === 0 && (
            <div className="mt-8 text-center">
              <h3 className="text-lg font-medium">No assessments found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="certificates" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <Card key={certificate.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{certificate.title}</CardTitle>
                      <CardDescription>
                        Issued by {certificate.issuer}
                      </CardDescription>
                    </div>
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Issue Date</p>
                      <p className="font-medium">
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expiry Date</p>
                      <p className="font-medium">
                        {new Date(certificate.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Credential ID</p>
                      <p className="font-medium">{certificate.credentialID}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Grade</p>
                      <p className="font-medium">{certificate.grade}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-sm text-muted-foreground">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {certificate.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Award className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
