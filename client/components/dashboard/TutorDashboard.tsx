"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileUp,
  MessageSquare,
  Plus,
  PlusCircle,
} from "lucide-react";
import { getCoursesForInstructor } from "@/api/course";
import type { Course } from "@/api/course";
import { useQuery } from "@tanstack/react-query";

export function TutorDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data,
    isLoading: isCoursesLoading,
    error,
  } = useQuery<Course[]>({
    queryKey: ["courses", user?._id],
    queryFn: () => getCoursesForInstructor(user?._id || ""),
    enabled: !!user?._id && user?.role === "tutor", // Only fetch if we have a tutor user
    retry: false, // Don't retry on error
  });

  // Calculate dashboard stats
  const totalStudents = data?.courses?.reduce(
    (sum, course) => sum + (course.students?.length || 0),
    0
  );
  const activeCourses = data?.courses?.length;

  // If still loading auth, show loading state
  if (isAuthLoading) {
    return <div className="container p-8">Loading...</div>;
  }

  // If not a tutor, show unauthorized message
  if (!user || user.role !== "tutor") {
    return (
      <div className="container p-8">
        <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
        <p className="mt-2">
          You must be logged in as a tutor to access this dashboard.
        </p>
        <Button asChild className="mt-4">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your teaching today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/courses/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
          {/* <Button variant="outline" asChild>
            <Link href="/messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Link>
          </Button> */}
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Across all courses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCourses}</div>
                <p className="text-xs text-muted-foreground">
                  Currently teaching
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">5 need grading</p>
              </CardContent>
            </Card>{" "}
          </div>

          {/* Recent Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
              <CardDescription>
                Manage and update your current courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCoursesLoading ? (
                <div className="text-center py-4">Loading courses...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-4">
                  {error instanceof Error
                    ? error.message
                    : "Error loading courses"}
                </div>
              ) : data?.courses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No courses yet.</p>
                  <Button asChild className="mt-2">
                    <Link href="/courses/create">Create your first course</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.courses.map((course) => (
                    <div
                      key={course._id}
                      className="flex items-center justify-between space-x-4"
                    >
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium leading-none">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">{course.category}</Badge>
                          <Badge variant="outline">{course.level}</Badge>
                          <span className="text-muted-foreground">
                            {course.students?.length || 0} students
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" asChild>
                        <Link href={`/courses/${course._id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignments to Grade */}
          <Card>
            <CardHeader>
              <CardTitle>Assignments to Grade</CardTitle>
              <CardDescription>
                Recent submissions that need your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add logic to fetch and display assignments */}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/assignments">View All Assignments</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Courses</CardTitle>
                <CardDescription>
                  Create and manage your courses
                </CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link href="/courses/create">
                  <Plus className="mr-1 h-4 w-4" />
                  Create Course
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.courses.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{course.level}</Badge>
                        <Badge variant="outline">{course.category}</Badge>
                        <Badge variant="outline">
                          {course.students?.length || 0} students
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/courses/${course._id}/lessons`}>
                          <BookOpen className="mr-1 h-4 w-4" />
                          Lessons
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/courses/${course._id}/assessments`}>
                          <FileUp className="mr-1 h-4 w-4" />
                          Assessments
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/courses/edit?courseId=${course._id}`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/courses/create">
                  <Plus className="mr-1 h-4 w-4" />
                  Create New Course
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assessments</CardTitle>
                <CardDescription>
                  Create, manage, and grade assessments
                </CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link href="/assessments/create">
                  <Plus className="mr-1 h-4 w-4" />
                  Create Assessment
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 font-medium">Pending Submissions</h3>
                  <div className="space-y-3">
                    {/* Add logic to fetch and display pending submissions */}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Create New Assessment</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">Quiz</CardTitle>
                        <CardDescription>
                          Create a quick assessment with multiple choice
                          questions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Perfect for checking student understanding with
                          multiple choice, true/false, and multiple select
                          questions.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link href="/assessments/create?type=quiz">
                            Create Quiz
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">Exam</CardTitle>
                        <CardDescription>
                          Create a comprehensive exam with various question
                          types
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Ideal for midterms and finals with a mix of question
                          types and timed sections.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link href="/assessments/create?type=exam">
                            Create Exam
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
