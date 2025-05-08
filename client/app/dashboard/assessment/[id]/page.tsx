import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GraduationCap } from "lucide-react"
import { Label } from "@/components/ui/label"

export default function StudentAssessmentPage({ params }: { params: { id: string } }) {
  // Mock assessment data
  const assessment = {
    id: params.id,
    title: "Programming Fundamentals Quiz",
    courseTitle: "Introduction to Computer Science",
    timeLimit: "30 minutes",
    questions: [
      {
        id: 1,
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Multi Language",
          "Hyper Transfer Markup Language",
          "Home Tool Markup Language",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Which of the following is NOT a programming language?",
        options: ["Java", "Python", "HTML", "C++"],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["var x = 5;", "variable x = 5;", "x = 5;", "int x = 5;"],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "Which data structure operates on a Last-In-First-Out (LIFO) principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What does CSS stand for?",
        options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"],
        correctAnswer: 0,
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span>EduConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">
              Time Remaining: <span className="text-primary">28:45</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <p className="text-muted-foreground">Course: {assessment.courseTitle}</p>
          </div>

          <div className="space-y-6">
            {assessment.questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Question {index + 1}: {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={optionIndex.toString()} id={`q${question.id}-option${optionIndex}`} />
                        <Label htmlFor={`q${question.id}-option${optionIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between">
            <Button variant="outline">Previous</Button>
            <Button asChild>
              <Link href="/student-dashboard/course/1">Submit Assessment</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
