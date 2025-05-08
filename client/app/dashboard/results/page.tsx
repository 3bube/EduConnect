import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, Search, User } from "lucide-react"

export default function StudentResultsPage() {
  // Mock assessment results
  const assessmentResults = [
    {
      id: 1,
      title: "Programming Fundamentals Quiz",
      course: "Introduction to Computer Science",
      score: 92,
      totalQuestions: 15,
      correctAnswers: 14,
      timeTaken: "25 minutes",
      submittedAt: "2023-10-16 14:30",
      status: "Passed",
    },
    {
      id: 2,
      title: "Basic Algorithms Assessment",
      course: "Introduction to Computer Science",
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      timeTaken: "28 minutes",
      submittedAt: "2023-10-20 15:45",
      status: "Passed",
    },
    {
      id: 3,
      title: "Web Development Basics Test",
      course: "Web Development Basics",
      score: 65,
      totalQuestions: 20,
      correctAnswers: 13,
      timeTaken: "30 minutes",
      submittedAt: "2023-11-05 11:30",
      status: "Failed",
    },
  ]

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
              href="/dashboard/results"
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
              Assessment Results
            </Link>
                        <Link
                          href="/dashboard/certificates"
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
              <h1 className="text-2xl font-bold">Assessment Results</h1>
              <p className="text-muted-foreground">View your performance on course assessments</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Assessments Taken</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assessmentResults.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      assessmentResults.reduce((acc, result) => acc + result.score, 0) / assessmentResults.length,
                    )}
                    %
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      (assessmentResults.filter((result) => result.status === "Passed").length /
                        assessmentResults.length) *
                        100,
                    )}
                    %
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Results</h2>
              {assessmentResults.map((result) => (
                <Card key={result.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{result.title}</CardTitle>
                        <CardDescription>{result.course}</CardDescription>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          result.status === "Passed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {result.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className="font-medium">{result.score}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Correct Answers</p>
                        <p className="font-medium">
                          {result.correctAnswers} / {result.totalQuestions}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time Taken</p>
                        <p className="font-medium">{result.timeTaken}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted</p>
                        <p className="font-medium">{result.submittedAt}</p>
                      </div>
                    </div>
                  </CardContent>
                  <div className="border-t px-6 py-3">
                    {/* <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/results/${result.id}`}>View Details</Link>
                    </Button> */}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
