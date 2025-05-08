"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, GraduationCap, Search, User, Users } from "lucide-react"
import { useState, useEffect } from "react";
import { fetchInstructorStudents } from "../api";

export default function TutorStudentsPage() {
  type Student = { id: string; name: string; email: string; course: string; enrollmentDate: string; progress: number };
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const user = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
    if (!user || !user._id) {
      setError("You must be logged in");
      setLoading(false);
      return;
    }
    fetchInstructorStudents(user._id)
      .then(data => setStudents(data))
      .catch(err => setError(err.message || "Failed to load students"))
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter(s =>
    [s.name, s.email, s.course].some(field => field.toLowerCase().includes(search.toLowerCase()))
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
              className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium"
            >
              <Users className="h-4 w-4" />
              Students
            </Link>
                  <Link
                          href="/tutor-dashboard/assessments"
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
                <h1 className="text-2xl font-bold">My Students</h1>
                <p className="text-muted-foreground">View and manage students enrolled in your courses</p>
              </div>
              <div className="flex items-center gap-2">
                <form className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search students..."
                    className="w-[200px] pl-8"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </form>
              </div>
            </div>

            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Course</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Enrollment Date
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Progress</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center">Loading students...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-red-600">{error}</td>
                      </tr>
                    ) : filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle font-medium">{student.name}</td>
                          <td className="p-4 align-middle">{student.email}</td>
                          <td className="p-4 align-middle">{student.course}</td>
                          <td className="p-4 align-middle">{student.enrollmentDate}</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-24">
                                <div className="h-2 w-full rounded-full bg-muted">
                                  <div
                                    className="h-full rounded-full bg-primary"
                                    style={{ width: `${student.progress}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-xs">{student.progress}%</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/tutor-dashboard/student/${student.id}`}>View Details</Link>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center">No students found.</td>
                      </tr>
                    )}
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
