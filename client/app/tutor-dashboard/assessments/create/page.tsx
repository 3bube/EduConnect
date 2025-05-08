"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, GraduationCap, Plus, Save, Trash2, User, Users, Loader2 } from "lucide-react"
import { createAssessment } from "@/api/assessment"
import { getCoursesForInstructor } from "@/api/course"
import { useToast } from "@/components/ui/use-toast"

interface Course {
  _id: string;
  title: string;
  instructor?: {
    id: string;
    name: string;
  };
}

interface AssessmentQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

// Removed unused interface

export default function CreateAssessmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [assessmentType, setAssessmentType] = useState<"quiz" | "exam">("quiz");
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [passingScore, setPassingScore] = useState<number>(70);
  const [dueDate, setDueDate] = useState("");
  
  // Questions state
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load instructor's courses
  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true);
        const user = localStorage.getItem("user");
        if (!user) return;

        const userData = JSON.parse(user);
        const response = await getCoursesForInstructor(userData._id);
        if (response && response.courses) {
          setCourses(response.courses);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, []);

  // Helper functions for questions
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
    validateForm();
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    validateForm();
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
    validateForm();
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
    validateForm();
  };

  const setCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswer = optionIndex;
    setQuestions(updatedQuestions);
  };
  
  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!title.trim()) {
      errors.title = "Title is required";
    }
    
    if (!courseId) {
      errors.courseId = "Course is required";
    }
    
    if (timeLimit <= 0) {
      errors.timeLimit = "Time limit must be greater than 0";
    }
    
    if (passingScore < 0 || passingScore > 100) {
      errors.passingScore = "Passing score must be between 0 and 100";
    }
    
    // Validate questions
    questions.forEach((question, index) => {
      if (!question.question.trim()) {
        errors[`question_${index}`] = "Question text is required";
      }
      
      let hasEmptyOption = false;
      question.options.forEach((option) => {
        if (!option.trim()) {
          hasEmptyOption = true;
        }
      });
      
      if (hasEmptyOption) {
        errors[`options_${index}`] = "All options must be filled";
      }
    });
    
    if (questions.length === 0) {
      errors.questions = "At least one question is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (saveAsDraft = true) => {
    if (!validateForm()) {
      toast({
        title: "Validation Failed",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const assessment = {
        title,
        description: description || "", // Ensure description is always a string
        courseId,
        type: assessmentType,
        timeLimit,
        passingScore,
        category: "", // Add required category field
        dueDate: dueDate || undefined,
        status: saveAsDraft ? "draft" : "published",
        questions: questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        }))
      };
      
      await createAssessment(assessment);
      
      toast({
        title: saveAsDraft ? "Draft Saved" : "Assessment Published",
        description: saveAsDraft 
          ? "Your assessment has been saved as a draft." 
          : "Your assessment has been published successfully.",
      });
      
      // Redirect to assessments page after successful creation
      router.push("/tutor-dashboard/assessments");
      
    } catch (err) {
      console.error("Failed to create assessment:", err);
      setError("Failed to create assessment. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span>EduConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => handleSubmit(true)} 
              variant="outline" 
              disabled={isSubmitting || isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Draft"
              )}
            </Button>
            <Button 
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
                </>
              ) : (
                "Publish Assessment"
              )}
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
          <div className="container max-w-4xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Create Assessment</h1>
              <p className="text-muted-foreground">Create a new assessment for your course</p>
            </div>

            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading courses...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Details</CardTitle>
                  <CardDescription>Basic information about your assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Assessment Title <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      placeholder="e.g., Programming Fundamentals Quiz"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={validationErrors.title ? "border-red-500" : ""}
                    />
                    {validationErrors.title && (
                      <p className="text-sm text-red-500">{validationErrors.title}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a brief description of this assessment"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="course">Course <span className="text-red-500">*</span></Label>
                    <Select value={courseId} onValueChange={setCourseId}>
                      <SelectTrigger className={validationErrors.courseId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.courseId && (
                      <p className="text-sm text-red-500">{validationErrors.courseId}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="assessment-type">Assessment Type</Label>
                    <Select value={assessmentType} onValueChange={(value) => setAssessmentType(value as "quiz" | "exam")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="time-limit">Time Limit (minutes) <span className="text-red-500">*</span></Label>
                      <Input
                        id="time-limit"
                        type="number"
                        placeholder="e.g., 30"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                        className={validationErrors.timeLimit ? "border-red-500" : ""}
                      />
                      {validationErrors.timeLimit && (
                        <p className="text-sm text-red-500">{validationErrors.timeLimit}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passing-score">Passing Score (%) <span className="text-red-500">*</span></Label>
                      <Input
                        id="passing-score"
                        type="number"
                        placeholder="e.g., 70"
                        value={passingScore}
                        onChange={(e) => setPassingScore(Number(e.target.value))}
                        className={validationErrors.passingScore ? "border-red-500" : ""}
                      />
                      {validationErrors.passingScore && (
                        <p className="text-sm text-red-500">{validationErrors.passingScore}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date (optional)</Label>
                    <Input
                      id="due-date"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Questions</h2>
                <Button onClick={addQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {questions.map((question, questionIndex) => (
                <Card key={questionIndex}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-base">Question {questionIndex + 1}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(questionIndex)}
                      disabled={questions.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Question</span>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${questionIndex}`}>
                        Question <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id={`question-${questionIndex}`}
                        placeholder="Enter your question here"
                        value={question.question}
                        onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                        className={validationErrors[`question_${questionIndex}`] ? "border-red-500" : ""}
                      />
                      {validationErrors[`question_${questionIndex}`] && (
                        <p className="text-sm text-red-500">{validationErrors[`question_${questionIndex}`]}</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Options <span className="text-red-500">*</span></Label>
                        <p className="text-xs text-muted-foreground">
                          Select the radio button for the correct answer
                        </p>
                      </div>
                      {validationErrors[`options_${questionIndex}`] && (
                        <p className="text-sm text-red-500">{validationErrors[`options_${questionIndex}`]}</p>
                      )}
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-answer-${questionIndex}`}
                            checked={optionIndex === question.correctAnswer}
                            onChange={() => setCorrectAnswer(questionIndex, optionIndex)}
                            className="h-4 w-4"
                            id={`option-${questionIndex}-${optionIndex}`}
                          />
                          <Input
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                            className={`flex-1 ${!option.trim() ? "border-red-500" : ""}`}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {validationErrors.questions && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{validationErrors.questions}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href="/tutor-dashboard/assessments">Cancel</Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSubmit(true)}  
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>Save as Draft</>
                )}
              </Button>
              <Button 
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>Publish Assessment</>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
