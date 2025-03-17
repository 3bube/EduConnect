"use client"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"

// Mock results data
const resultsData = {
  id: "assessment-1",
  title: "Algebra Fundamentals Quiz",
  course: "Introduction to Mathematics",
  score: 80,
  passingScore: 70,
  timeSpent: "24:15", // minutes:seconds
  completedAt: "2023-09-15T14:30:00",
  questions: [
    {
      id: "q1",
      text: "Which of the following is a solution to the equation 2x + 5 = 11?",
      userAnswer: "q1-b",
      correctAnswer: "q1-b",
      isCorrect: true,
      explanation:
        "To solve 2x + 5 = 11, subtract 5 from both sides to get 2x = 6, then divide both sides by 2 to get x = 3.",
      options: [
        { id: "q1-a", text: "x = 2" },
        { id: "q1-b", text: "x = 3" },
        { id: "q1-c", text: "x = 4" },
        { id: "q1-d", text: "x = 5" },
      ],
    },
    {
      id: "q2",
      text: "Simplify the expression: 3(2x - 4) + 5",
      userAnswer: "q2-a",
      correctAnswer: "q2-b",
      isCorrect: false,
      explanation: "Using the distributive property: 3(2x - 4) + 5 = 6x - 12 + 5 = 6x - 7",
      options: [
        { id: "q2-a", text: "6x - 12 + 5" },
        { id: "q2-b", text: "6x - 7" },
        { id: "q2-c", text: "6x - 12" },
        { id: "q2-d", text: "6x - 17" },
      ],
    },
    {
      id: "q3",
      text: "Which of the following are quadratic equations? (Select all that apply)",
      userAnswer: ["q3-b", "q3-d"],
      correctAnswer: ["q3-b", "q3-d"],
      isCorrect: true,
      explanation:
        "A quadratic equation has the form ax² + bx + c = 0, where a ≠ 0. Options B and D are quadratic equations.",
      options: [
        { id: "q3-a", text: "y = 2x + 3" },
        { id: "q3-b", text: "y = x² + 2x + 1" },
        { id: "q3-c", text: "y = 3x³ - 2x² + x" },
        { id: "q3-d", text: "y = 4x² - 7" },
      ],
    },
    {
      id: "q4",
      text: "The equation y = mx + b represents a linear function.",
      userAnswer: "q4-a",
      correctAnswer: "q4-a",
      isCorrect: true,
      explanation:
        "The equation y = mx + b is the slope-intercept form of a linear function, where m is the slope and b is the y-intercept.",
      options: [
        { id: "q4-a", text: "True" },
        { id: "q4-b", text: "False" },
      ],
    },
    {
      id: "q5",
      text: "What is the slope of the line passing through the points (2, 3) and (4, 7)?",
      userAnswer: "q5-b",
      correctAnswer: "q5-b",
      isCorrect: true,
      explanation: "The slope is calculated using the formula (y₂ - y₁)/(x₂ - x₁) = (7 - 3)/(4 - 2) = 4/2 = 2.",
      options: [
        { id: "q5-a", text: "1" },
        { id: "q5-b", text: "2" },
        { id: "q5-c", text: "3" },
        { id: "q5-d", text: "4" },
      ],
    },
  ],
  performance: {
    strengths: ["Linear equations", "Quadratic equations", "Graphing"],
    weaknesses: ["Algebraic expressions", "Inequalities"],
    recommendations: [
      "Review the rules for simplifying algebraic expressions",
      "Practice solving more complex equations",
      "Work on word problems involving algebraic concepts",
    ],
  },
}

export function ResultsView({ assessmentId }: { assessmentId: string }) {
  // Calculate statistics
  const totalQuestions = resultsData.questions.length;
  const correctAnswers = resultsData.questions.filter((q) => q.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const accuracy = (correctAnswers / totalQuestions) * 100;
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{resultsData.title} - Results</h1>
            <p className="text-muted-foreground">{resultsData.course}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-[1fr_auto] lg:grid-cols-[2fr_1fr]">\

