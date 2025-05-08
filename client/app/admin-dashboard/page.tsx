"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, GraduationCap, Search, Trash2, User, Users } from "lucide-react"

import { useEffect, useState } from "react";
import { fetchUsers, deleteUser, fetchCourses, deleteCourse } from "./api";
import type { User } from "@/types/user";
import type { Course } from "@/types/course";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDeleting, setUserDeleting] = useState<string | null>(null);
  const [courseDeleting, setCourseDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [usersRes, coursesRes] = await Promise.all([
          fetchUsers(),
          fetchCourses(),
        ]);
        setUsers(usersRes);
        setCourses(coursesRes);
      } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "response" in err) {
          setError((err as any).response?.data?.message || (err as Error).message || "Failed to load data");
        } else {
          setError((err as Error).message || "Failed to load data");
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
  


  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setUserDeleting(userId);
    // Optimistically update UI
    const prevUsers = users;
    setUsers((prev) => prev.filter((user) => user._id !== userId));
    try {
      await deleteUser(userId);
    } catch (err: unknown) {
      // Revert if error
      setUsers(prevUsers);
      if (typeof err === "object" && err !== null && "response" in err) {
        alert((err as any).response?.data?.message || (err as Error).message || "Failed to delete user");
      } else {
        alert((err as Error).message || "Failed to delete user");
      }
    } finally {
      setUserDeleting(null);
    }
  };


  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setCourseDeleting(courseId);
    try {
      await deleteCourse(courseId);
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
    } catch (err: unknown) {
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
              className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium"
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link
              href="/admin-dashboard/courses"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              Courses
            </Link>
            {/* <Link
              href="/admin-dashboard/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <User className="h-4 w-4" />
              Profile
            </Link> */}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage users and courses</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : users.length}</div>
                  <p className="text-xs text-muted-foreground">Total users in system</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : courses.length}</div>
                  <p className="text-xs text-muted-foreground">Total courses in system</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : users.filter(u => u.role === "student").length}</div>
                  <p className="text-xs text-muted-foreground">Active students</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="users">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
              </TabsList>
              <TabsContent value="users" className="space-y-4">
                {error && <div className="text-red-500">{error}</div>}
                {loading ? (
                  <div className="py-8 text-center">Loading users...</div>
                ) : (
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Join Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {users.map((user) => (
                            <tr
                              key={user._id}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                              <td className="p-4 align-middle">{user._id}</td>
                              <td className="p-4 align-middle font-medium">{user.name}</td>
                              <td className="p-4 align-middle">{user.email}</td>
                              <td className="p-4 align-middle">{user.role}</td>
                              <td className="p-4 align-middle">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                              <td className="p-4 align-middle">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDeleteUser(user._id)}
                                  disabled={userDeleting === user._id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="courses" className="space-y-4">
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
                              <td className="p-4 align-middle">{course.numberOfStudents !== undefined ? course.numberOfStudents : "-"}</td>
                              <td className="p-4 align-middle">{"createdAt" in course && course.createdAt ? new Date((course as any).createdAt).toLocaleDateString() : "-"}</td>
                              <td className="p-4 align-middle">
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
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
