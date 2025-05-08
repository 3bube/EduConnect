"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, GraduationCap, Search, Trash2, User } from "lucide-react"

import { useEffect, useState } from "react";
import { fetchCourses, deleteCourse } from "../api";
import type { Course } from "@/types/course";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseDeleting, setCourseDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      setError(null);
      try {
        const coursesRes = await fetchCourses();
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
    loadCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setCourseDeleting(courseId);
    // Optimistically update UI
    const prevCourses = courses;
    setCourses((prev) => prev.filter((course) => course._id !== courseId));
    try {
      await deleteCourse(courseId);
    } catch (err: unknown) {
      setCourses(prevCourses);
      if (typeof err === "object" && err !== null && "response" in err) {
        alert((err as any).response?.data?.message || (err as Error).message || "Failed to delete course");
      } else {
        alert((err as Error).message || "Failed to delete course");
      }
    } finally {
      setCourseDeleting(null);
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
            <form className="hidden md:flex relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-[200px] lg:w-[300px] pl-8" />
            </form>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[250px] flex-col border-r md:flex">
          <div className="flex h-14 items-center border-b px-4 font-medium">Admin Dashboard</div>
          <nav className="grid gap-1 p-2">
            <Link
              href="/admin-dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <User className="h-4 w-4" />
              Users
            </Link>
            <Link
              href="/admin-dashboard/courses"
              className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium"
            >
              <BookOpen className="h-4 w-4" />
              Courses
            </Link>
            <Link
              href="/admin-dashboard/profile"
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
              <h1 className="text-2xl font-bold">Course Management</h1>
              <p className="text-muted-foreground">View and manage all courses on the platform</p>
            </div>

            {/* Show error or loading state */}
            {error && <div className="text-red-500">{error}</div>}
            {loading ? (
              <div className="py-8 text-center">Loading courses...</div>
            ) : (
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Instructor</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Students</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {courses.map((course) => (
                        <tr
                          key={course._id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{course._id}</td>
                          <td className="p-4 align-middle font-medium">{course.title}</td>
                          <td className="p-4 align-middle">{course.instructor?.name || "-"}</td>
                          <td className="p-4 align-middle">{course.students !== undefined ? course.students : (course.numberOfStudents !== undefined ? course.numberOfStudents : "-")}</td>
                          <td className="p-4 align-middle">{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "-"}</td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              {/* <Button variant="outline" size="sm" asChild>
                                <Link href={`/course/${course._id}`}>View</Link>
                              </Button> */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteCourse(course._id)}
                                disabled={courseDeleting === course._id}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}
