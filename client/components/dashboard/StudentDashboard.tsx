"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText, Play, Star, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  getEnrolledCourses,
  getUpcomingAssignments,
  getRecommendedCourses,
  getUpcomingClasses,
  getLearningStats,
  EnrolledCourse,
  UpcomingAssignment,
  UpcomingClass,
} from "@/api/student";
import { Course } from "@/api/course";

export function StudentDashboard() {
  const { user } = useAuth();

  const { data: enrolledCourses = [], isLoading: isLoadingCourses } = useQuery<
    EnrolledCourse[]
  >({
    queryKey: ["enrolledCourses"],
    queryFn: getEnrolledCourses,
    enabled: !!user?._id,
  });

  const { data: upcomingAssignments = [], isLoading: isLoadingAssignments } =
    useQuery<UpcomingAssignment[]>({
      queryKey: ["upcomingAssignments"],
      queryFn: getUpcomingAssignments,
      enabled: !!user?._id,
    });

  const { data: upcomingClasses = [], isLoading: isLoadingClasses } = useQuery<
    UpcomingClass[]
  >({
    queryKey: ["upcomingClasses"],
    queryFn: getUpcomingClasses,
    enabled: !!user?._id,
  });

  const { data: recommendedCourses = [], isLoading: isLoadingRecommended } =
    useQuery<Course[]>({
      queryKey: ["recommendedCourses"],
      queryFn: getRecommendedCourses,
      enabled: !!user?._id,
    });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["learningStats"],
    queryFn: getLearningStats,
    enabled: !!user?._id,
  });

  const isLoading =
    isLoadingCourses ||
    isLoadingAssignments ||
    isLoadingClasses ||
    isLoadingRecommended ||
    isLoadingStats;

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Calculate days remaining
  const getDaysRemaining = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading your dashboard...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your data
          </p>
        </div>
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
            Here&#39;s what&#39;s happening with your learning journey today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/live-classes">
              <Play className="mr-2 h-4 w-4" />
              Join Next Class
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/courses">Continue Learning</Link>
          </Button>
        </div>
      </div>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>
            Your overall progress across all courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Overall Completion</p>
                <p className="text-2xl font-bold">
                  {stats?.overallCompletion || 0}%
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Courses Enrolled</p>
                <p className="text-2xl font-bold">
                  {stats?.coursesEnrolled || 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Hours Studied</p>
                <p className="text-2xl font-bold">{stats?.hoursStudied || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Assignments Completed</p>
                <p className="text-2xl font-bold">
                  {stats?.assignmentsCompleted || 0}/
                  {stats?.totalAssignments || 0}
                </p>
              </div>
            </div>
            <Progress
              value={stats?.overallCompletion || 0}
              className="h-2 w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Ongoing Courses */}
      <div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Your Ongoing Courses
        </h2>
        {enrolledCourses.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="mb-4 text-muted-foreground">
              You haven&#39;t enrolled in any courses yet.
            </p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <Card key={course._id} className="overflow-hidden">
                <div className="relative h-[100px]">
                  <Image
                    src={
                      course.image || "/placeholder.svg?height=100&width=180"
                    }
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Progress: {course.progress}%
                    </p>
                    <Badge variant="outline">
                      {course.completedLessons} / {course.lessons?.length || 0}{" "}
                      Lessons
                    </Badge>
                  </div>
                  <Progress value={course.progress} className="h-1" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Play className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Next Lesson
                        </p>
                        <p className="text-sm font-medium">
                          {course.nextLesson?.title || "No upcoming lessons"}
                        </p>
                      </div>
                    </div>
                    <Button className="w-full" size="sm" asChild>
                      <Link href={`/courses/${course._id}`}>
                        Continue Learning
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Activities */}
      <div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Upcoming Activities
        </h2>
        <Tabs defaultValue="assignments">
          <TabsList className="mb-4">
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="classes">Live Classes</TabsTrigger>
          </TabsList>
          <TabsContent value="assignments">
            {upcomingAssignments.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  You don&#39;t have any upcoming assignments.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingAssignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <FileText className="mt-1 h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">{assignment.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {assignment.courseName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              assignment.status === "completed"
                                ? "success"
                                : assignment.status === "overdue"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {assignment.status === "completed"
                              ? "Completed"
                              : assignment.status === "overdue"
                              ? "Overdue"
                              : `${getDaysRemaining(
                                  assignment.dueDate
                                )} days left`}
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Due {formatDate(assignment.dueDate)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="classes">
            {upcomingClasses.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  You don&#39;t have any upcoming live classes.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingClasses.map((liveClass) => (
                  <Card key={liveClass.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Calendar className="mt-1 h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">{liveClass.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {liveClass.courseName}
                            </p>
                            <p className="mt-1 text-xs">
                              <span className="font-medium">Tutor:</span>{" "}
                              {liveClass.tutor}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <p className="text-xs">
                              {formatDate(liveClass.startTime)}
                            </p>
                          </div>
                          <Button size="sm" className="mt-2">
                            Join Class
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Recommended Courses */}
      <div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Recommended For You
        </h2>
        {recommendedCourses.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No recommended courses available at the moment.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedCourses.map((course) => (
              <Card key={course._id} className="overflow-hidden">
                <div className="relative h-[120px]">
                  <Image
                    src={
                      course.image || "/placeholder.svg?height=120&width=200"
                    }
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-medium">
                        {course.rating || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {course.numberOfStudents || 0} students
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" size="sm" asChild>
                    <Link href={`/courses/${course._id}`}>View Course</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
