"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { getCoursesForInstructor } from "@/api/course";
import { useQuery } from "@tanstack/react-query";
import { createAssessment } from "@/api/assessment";
import Link from "next/link";

// Question types
type QuestionType = "multiple-choice" | "multiple-select" | "true-false";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: Option[];
  correctAnswer?: string;
  correctAnswers?: string[];
}

interface Course {
  id: string;
  title: string;
}

export default function CreateAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [questions, setQuestions] = useState<Question[]>([]);

  // Get assessment type from URL query parameter
  const assessmentType = (searchParams.get("type") || "quiz") as
    | "quiz"
    | "exam";

  interface FormData {
    title: string;
    description: string;
    courseId: string;
    type: "quiz" | "exam";
    timeLimit: string;
    dueDate: string;
    passingScore: string;
    category: string;
    status: "not_started" | "in_progress" | "completed";
  }

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    courseId: "",
    type: assessmentType,
    timeLimit: "30",
    dueDate: "",
    passingScore: "70",
    category: "general",
    status: "not_started",
  });

  const { data, isLoading: isCoursesLoading } = useQuery<Course[]>({
    queryKey: ["courses", user?._id],
    queryFn: () => getCoursesForInstructor(user?._id || ""),
    enabled: !!user?._id && user?.role === "tutor", // Only fetch if we have a tutor user
    retry: false, // Don't retry on error
  });

  if (isCoursesLoading) return <div>Loading....</div>;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${questions.length + 1}`,
      type: "multiple-choice",
      text: "",
      options: [
        { id: `q${questions.length + 1}-a`, text: "" },
        { id: `q${questions.length + 1}-b`, text: "" },
        { id: `q${questions.length + 1}-c`, text: "" },
        { id: `q${questions.length + 1}-d`, text: "" },
      ],
      correctAnswer: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          if (field === "type" && value === "multiple-select") {
            return {
              ...q,
              [field]: value,
              correctAnswer: undefined,
              correctAnswers: [],
            };
          } else if (field === "type" && value !== "multiple-select") {
            return {
              ...q,
              [field]: value,
              correctAnswers: undefined,
              correctAnswer: "",
            };
          }
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  };

  const updateOption = (
    questionId: string,
    optionId: string,
    value: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) => {
              if (opt.id === optionId) {
                return { ...opt, text: value };
              }
              return opt;
            }),
          };
        }
        return q;
      })
    );
  };

  const toggleCorrectAnswer = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          if (q.type === "multiple-select") {
            const correctAnswers = q.correctAnswers || [];
            if (correctAnswers.includes(optionId)) {
              return {
                ...q,
                correctAnswers: correctAnswers.filter((id) => id !== optionId),
              };
            } else {
              return {
                ...q,
                correctAnswers: [...correctAnswers, optionId],
              };
            }
          } else {
            return { ...q, correctAnswer: optionId };
          }
        }
        return q;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate questions
      if (questions.length === 0) {
        alert("Please add at least one question");
        setIsSubmitting(false);
        return;
      }

      if (!user?._id) {
        throw new Error("User not authenticated");
      }

      await createAssessment({
        ...formData,
        questions,
      });

      router.push("/tutor-dashboard");
    } catch (error) {
      console.error("Error creating assessment:", error);
      alert(
        error instanceof Error ? error.message : "Failed to create assessment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/tutor-dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Create New {assessmentType === "quiz" ? "Quiz" : "Exam"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">Assessment Details</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Assessment Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Algebra Fundamentals Quiz"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this assessment covers"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="courseId">Course</Label>
                    <Select
                      value={formData.courseId}
                      onValueChange={(value) =>
                        handleSelectChange("courseId", value)
                      }
                    >
                      <SelectTrigger id="courseId">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {data?.courses?.map((course) => (
                          <SelectItem key={course._id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      name="timeLimit"
                      type="number"
                      min="1"
                      value={formData.timeLimit}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                      id="passingScore"
                      name="passingScore"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.passingScore}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setActiveTab("questions")}
                  className="w-full"
                >
                  Continue to Questions
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="questions">
              <div className="space-y-6">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Questions</h3>
                  <Button onClick={addQuestion} size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Question
                  </Button>
                </div>

                {questions.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">
                      No questions added yet. Click "Add Question" to get
                      started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <Card key={question.id} className="relative">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => removeQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Question {index + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`question-${question.id}-text`}>
                              Question Text
                            </Label>
                            <Textarea
                              id={`question-${question.id}-text`}
                              value={question.text}
                              onChange={(e) =>
                                updateQuestion(
                                  question.id,
                                  "text",
                                  e.target.value
                                )
                              }
                              placeholder="Enter your question here"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`question-${question.id}-type`}>
                              Question Type
                            </Label>
                            <Select
                              value={question.type}
                              onValueChange={(value) =>
                                updateQuestion(
                                  question.id,
                                  "type",
                                  value as QuestionType
                                )
                              }
                            >
                              <SelectTrigger
                                id={`question-${question.id}-type`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="multiple-choice">
                                  Multiple Choice
                                </SelectItem>
                                <SelectItem value="multiple-select">
                                  Multiple Select
                                </SelectItem>
                                <SelectItem value="true-false">
                                  True/False
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <Label>Options</Label>
                            {question.type === "true-false" ? (
                              <div className="space-y-2">
                                {["True", "False"].map((option, i) => {
                                  const optionId = `${question.id}-${
                                    i === 0 ? "a" : "b"
                                  }`;
                                  return (
                                    <div
                                      key={optionId}
                                      className="flex items-center space-x-2"
                                    >
                                      <input
                                        type="radio"
                                        id={optionId}
                                        name={`question-${question.id}-answer`}
                                        checked={
                                          question.correctAnswer === optionId
                                        }
                                        onChange={() =>
                                          toggleCorrectAnswer(
                                            question.id,
                                            optionId
                                          )
                                        }
                                        className="h-4 w-4"
                                      />
                                      <Label htmlFor={optionId}>{option}</Label>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {question.options.map((option) => (
                                  <div
                                    key={option.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type={
                                        question.type === "multiple-choice"
                                          ? "radio"
                                          : "checkbox"
                                      }
                                      id={option.id}
                                      name={`question-${question.id}-answer`}
                                      checked={
                                        question.type === "multiple-select"
                                          ? question.correctAnswers?.includes(
                                              option.id
                                            )
                                          : question.correctAnswer === option.id
                                      }
                                      onChange={() =>
                                        toggleCorrectAnswer(
                                          question.id,
                                          option.id
                                        )
                                      }
                                      className="h-4 w-4"
                                    />
                                    <Input
                                      value={option.text}
                                      onChange={(e) =>
                                        updateOption(
                                          question.id,
                                          option.id,
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Option ${
                                        option.id.split("-")[1]
                                      }`}
                                      className="flex-1"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("details")}
                  >
                    Back to Details
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Assessment"}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
