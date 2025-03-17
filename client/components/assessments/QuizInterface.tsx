"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ArrowLeft, ArrowRight, Clock, Flag } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock assessment data
const assessmentData = {
  id: "assessment-1",
  title: "Algebra Fundamentals Quiz",
  course: "Introduction to Mathematics",
  description: "Test your understanding of basic algebraic concepts",
  timeLimit: 30, // minutes
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      text: "Which of the following is a solution to the equation 2x + 5 = 11?",
      options: [
        { id: "q1-a", text: "x = 2" },
        { id: "q1-b", text: "x = 3" },
        { id: "q1-c", text: "x = 4" },
        { id: "q1-d", text: "x = 5" },
      ],
      correctAnswer: "q1-b",
    },
    {
      id: "q2",
      type: "multiple-choice",
      text: "Simplify the expression: 3(2x - 4) + 5",
      options: [
        { id: "q2-a", text: "6x - 12 + 5" },
        { id: "q2-b", text: "6x - 7" },
        { id: "q2-c", text: "6x - 12" },
        { id: "q2-d", text: "6x - 17" },
      ],
      correctAnswer: "q2-b",
    },
    {
      id: "q3",
      type: "multiple-select",
      text: "Which of the following are quadratic equations? (Select all that apply)",
      options: [
        { id: "q3-a", text: "y = 2x + 3" },
        { id: "q3-b", text: "y = x² + 2x + 1" },
        { id: "q3-c", text: "y = 3x³ - 2x² + x" },
        { id: "q3-d", text: "y = 4x² - 7" },
      ],
      correctAnswers: ["q3-b", "q3-d"],
    },
    {
      id: "q4",
      type: "true-false",
      text: "The equation y = mx + b represents a linear function.",
      options: [
        { id: "q4-a", text: "True" },
        { id: "q4-b", text: "False" },
      ],
      correctAnswer: "q4-a",
    },
    {
      id: "q5",
      type: "multiple-choice",
      text: "What is the slope of the line passing through the points (2, 3) and (4, 7)?",
      options: [
        { id: "q5-a", text: "1" },
        { id: "q5-b", text: "2" },
        { id: "q5-c", text: "3" },
        { id: "q5-d", text: "4" },
      ],
      correctAnswer: "q5-b",
    },
    {
      id: "q6",
      type: "multiple-choice",
      text: "Solve for x: 3x - 7 = 5x + 3",
      options: [
        { id: "q6-a", text: "x = -5" },
        { id: "q6-b", text: "x = -4" },
        { id: "q6-c", text: "x = 4" },
        { id: "q6-d", text: "x = 5" },
      ],
      correctAnswer: "q6-a",
    },
    {
      id: "q7",
      type: "multiple-select",
      text: "Which of the following are solutions to the inequality x² - 4 < 0? (Select all that apply)",
      options: [
        { id: "q7-a", text: "x = 0" },
        { id: "q7-b", text: "x = 1" },
        { id: "q7-c", text: "x = 2" },
        { id: "q7-d", text: "x = 3" },
      ],
      correctAnswers: ["q7-a", "q7-b"],
    },
    {
      id: "q8",
      type: "true-false",
      text: "The graph of y = |x| is a parabola.",
      options: [
        { id: "q8-a", text: "True" },
        { id: "q8-b", text: "False" },
      ],
      correctAnswer: "q8-b",
    },
    {
      id: "q9",
      type: "multiple-choice",
      text: "What is the value of x in the equation 2(x + 3) = 3(x - 1)?",
      options: [
        { id: "q9-a", text: "x = 7" },
        { id: "q9-b", text: "x = 9" },
        { id: "q9-c", text: "x = 11" },
        { id: "q9-d", text: "x = 13" },
      ],
      correctAnswer: "q9-b",
    },
    {
      id: "q10",
      type: "multiple-choice",
      text: "Which of the following is the factored form of x² - 9?",
      options: [
        { id: "q10-a", text: "(x - 3)(x - 3)" },
        { id: "q10-b", text: "(x + 3)(x - 3)" },
        { id: "q10-c", text: "(x + 9)(x - 1)" },
        { id: "q10-d", text: "(x - 9)(x + 1)" },
      ],
      correctAnswer: "q10-b",
    },
  ],
};

export function QuizInterface({ assessmentId }: { assessmentId: string }) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(
    assessmentData.timeLimit * 60
  ); // in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const currentQuestion = assessmentData.questions[currentQuestionIndex];
  const totalQuestions = assessmentData.questions.length;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time remaining
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle single choice answer
  const handleSingleChoiceAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Handle multiple choice answer
  const handleMultipleChoiceAnswer = (
    questionId: string,
    optionId: string,
    checked: boolean
  ) => {
    setAnswers((prev) => {
      const currentAnswers = (prev[questionId] as string[]) || [];

      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, optionId],
        };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((id) => id !== optionId),
        };
      }
    });
  };

  // Toggle flagged question
  const toggleFlaggedQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Navigate to specific question
  const handleNavigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // Submit assessment
  const handleSubmit = () => {
    setIsSubmitting(true);

    // In a real app, this would submit the answers to the server
    // For now, we'll just navigate to the results page
    setTimeout(() => {
      router.push(`/assessments/${assessmentId}/results`);
    }, 1500);
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (!answer) return false;

    if (Array.isArray(answer)) {
      return answer.length > 0;
    }

    return true;
  };

  // Calculate progress
  const calculateProgress = () => {
    const answeredQuestions = Object.keys(answers).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{assessmentData.title}</h1>
          <p className="text-muted-foreground">{assessmentData.course}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center rounded-full px-3 py-1 ${
              timeRemaining < 300
                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                : "bg-muted"
            }`}
          >
            <Clock className="mr-2 h-4 w-4" />
            <span className="font-medium">{formatTimeRemaining()}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span>Progress</span>
          <span>
            {Object.keys(answers).length}/{totalQuestions} questions answered
          </span>
        </div>
        <Progress value={calculateProgress()} className="h-2" />
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_250px]">
        {/* Question Area */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </CardTitle>
                  <CardDescription>
                    {currentQuestion.type === "multiple-choice" &&
                      "Select one answer"}
                    {currentQuestion.type === "multiple-select" &&
                      "Select all that apply"}
                    {currentQuestion.type === "true-false" &&
                      "Select True or False"}
                  </CardDescription>
                </div>
                <Button
                  variant={
                    flaggedQuestions.includes(currentQuestion.id)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleFlaggedQuestion(currentQuestion.id)}
                >
                  <Flag className="mr-2 h-4 w-4" />
                  {flaggedQuestions.includes(currentQuestion.id)
                    ? "Flagged"
                    : "Flag for Review"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-lg">{currentQuestion.text}</div>

                {(currentQuestion.type === "multiple-choice" ||
                  currentQuestion.type === "true-false") && (
                  <RadioGroup
                    value={(answers[currentQuestion.id] as string) || ""}
                    onValueChange={(value) =>
                      handleSingleChoiceAnswer(currentQuestion.id, value)
                    }
                  >
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label
                            htmlFor={option.id}
                            className="flex-1 cursor-pointer py-2"
                          >
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {currentQuestion.type === "multiple-select" && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={option.id}
                          checked={(
                            (answers[currentQuestion.id] as string[]) || []
                          ).includes(option.id)}
                          onCheckedChange={(checked) =>
                            handleMultipleChoiceAnswer(
                              currentQuestion.id,
                              option.id,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={option.id}
                          className="flex-1 cursor-pointer py-2"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button
                  onClick={() => setShowConfirmSubmit(true)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>

          {showConfirmSubmit && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Confirm Submission</AlertTitle>
              <AlertDescription>
                <p className="mb-4">
                  Are you sure you want to submit your quiz? You have answered{" "}
                  {Object.keys(answers).length} out of {totalQuestions}{" "}
                  questions.
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="destructive"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Yes, Submit Quiz"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmSubmit(false)}
                  >
                    No, Continue Quiz
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Question Navigation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {assessmentData.questions.map((question, index) => (
                  <Button
                    key={question.id}
                    variant={
                      currentQuestionIndex === index ? "default" : "outline"
                    }
                    size="sm"
                    className={`h-10 w-10 p-0 ${
                      answers[question.id]
                        ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                        : ""
                    } ${
                      flaggedQuestions.includes(question.id)
                        ? "border-yellow-500 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : ""
                    }`}
                    onClick={() => handleNavigateToQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span>Flagged for review</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-muted"></div>
                  <span>Unanswered</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quiz Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Questions
                  </p>
                  <p className="text-lg font-medium">{totalQuestions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Answered</p>
                  <p className="text-lg font-medium">
                    {Object.keys(answers).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Flagged</p>
                  <p className="text-lg font-medium">
                    {flaggedQuestions.length}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Time Remaining
                  </p>
                  <p
                    className={`text-lg font-medium ${
                      timeRemaining < 300 ? "text-red-500" : ""
                    }`}
                  >
                    {formatTimeRemaining()}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => setShowConfirmSubmit(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
