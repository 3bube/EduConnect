import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Download, GraduationCap, Search, User, Users } from "lucide-react"

export default function AssessmentResultsPage({ params }: { params: { id: string } }) {
  // Mock assessment data
  const assessment = {
    id: params.id,
    title: "Programming Fundamentals Quiz",
    course: "Introduction to Computer Science",
    questions: 15,
    timeLimit: "30 minutes",
    submissions: 87,
    averageScore: 78,
    lastUpdated: "2023-10-15",
  }

  // Mock student results
  const studentResults = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      score: 92,
      timeTaken: "25 minutes",
      submittedAt: "2023-10-16 14:30",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      score: 85,
      timeTaken: "28 minutes",
      submittedAt: "2023-10-16 15:45",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      score: 78,
      timeTaken: "22 minutes",
      submittedAt: "2023-10-17 09:15",
    },
    {
      id: 4,
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      score: 65,
      timeTaken: "30 minutes",
      submittedAt: "2023-10-17 11:30",
    },
    {
      id: 5,
      name: "David Lee",
      email: "david.lee@example.com",
      score: 70,
      timeTaken: "27 minutes",
      submittedAt: "2023-10-18 10:20",
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
            <div>
              <Link
                href="/tutor-dashboard/assessments"
                className="text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                ← Back to Assessments
              </Link>
              <div className="mt-2">
                <h1 className="text-2xl font-bold">{assessment.title} - Results</h1>
                <p className="text-muted-foreground">View student performance on this assessment</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assessment.submissions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assessment.averageScore}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Passing Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((studentResults.filter((r) => r.score >= 70).length / studentResults.length) * 100)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search students..." className="pl-8" />
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Results
              </Button>
            </div>

            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Score</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Time Taken</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Submitted At
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {studentResults.map((result) => (
                      <tr
                        key={result.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle font-medium">{result.name}</td>
                        <td className="p-4 align-middle">{result.email}</td>
                        <td className="p-4 align-middle">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              result.score >= 80
                                ? "bg-green-100 text-green-800"
                                : result.score >= 70
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.score}%
                          </span>
                        </td>
                        <td className="p-4 align-middle">{result.timeTaken}</td>
                        <td className="p-4 align-middle">{result.submittedAt}</td>
                        <td className="p-4 align-middle">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/tutor-dashboard/assessments/${assessment.id}/results/${result.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
