"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, GraduationCap, PlusCircle, User, Users } from "lucide-react"

import { useEffect, useState } from "react";
import { fetchTutorCourses } from "./api";
import type { Course } from "@/types/course";

export default function TutorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      setError(null);
      try {
        const tutorId = user?._id || null;
        if (!tutorId) {
          setError("No tutor ID found. Please log in.");
          setLoading(false);
          return;
        }
        const coursesRes = await fetchTutorCourses(tutorId);
        setCourses(coursesRes);
      } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "response" in err) {
          setError((err as any).response?.data?.message || (err as Error).message || "Failed to load courses");
        } else {
          setError((err as Error).message || "Failed to load courses");
        }
      } finally {
        setLoading(false);
      }
    }
    if (user && user._id) {
      loadCourses();
    }
  }, [user]);


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
              className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium"
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
                <h1 className="text-2xl font-bold">Welcome back, Tutor</h1>
                <p className="text-muted-foreground">Manage your courses and students</p>
              </div>
              <Button asChild>
                <Link href="/tutor-dashboard/create-course">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Course
                </Link>
              </Button>
            </div>

            <Tabs defaultValue="courses">
              <TabsList>
                <TabsTrigger value="courses">My Courses</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>
              <TabsContent value="courses" className="space-y-4">
              {error && <div className="text-red-500">{error}</div>}
              {loading ? (
                <div className="py-8 text-center">Loading courses...</div>
              ) : courses.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No courses added yet.</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <Card key={course._id}>
                      <CardHeader className="p-0">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="aspect-video w-full object-cover rounded-t-lg"
                        />
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>
                          Last updated: {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "-"}
                        </CardDescription>
                        <div className="mt-2 flex items-center text-sm">
                          <Users className="mr-1 h-4 w-4" />
                          <span>{(course.numberOfStudents !== undefined ? course.numberOfStudents : "-")} students enrolled</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" asChild>
                          <Link href={`/tutor-dashboard/edit-course/${course._id}`}>Edit</Link>
                        </Button>
                        <Button asChild>
                          <Link href={`/course/${course._id}`}>View</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
              <TabsContent value="drafts" className="space-y-4">
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No draft courses</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You don&apos;t have any draft courses. Start creating a new course.
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/tutor-dashboard/create-course">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Course
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
