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
import { Play, Star, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  getEnrolledCourses,
  getRecommendedCourses,
  EnrolledCourse,
} from "@/api/student";
import { Course } from "@/api/course";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { GenerateProgressButton } from "./GenerateProgressButton";

interface LearningStats {
  overallCompletion: number;
  coursesEnrolled: number;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: enrolledCourses = [] } = useQuery<EnrolledCourse[]>({
    queryKey: ["enrolledCourses"],
    queryFn: getEnrolledCourses,
    enabled: !!user?._id,
  });

  console.log(enrolledCourses);

  const { data: recommendedCourses = [] } = useQuery<Course[]>({
    queryKey: ["recommendedCourses"],
    queryFn: getRecommendedCourses,
    enabled: !!user?._id,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/student/stats");
        setStats(response.data.stats);
      } catch (error) {
        console.error("Failed to fetch learning stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

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
          {/* <Button asChild>
            <Link href="/live-classes">
              <Play className="mr-2 h-4 w-4" />
              Join Next Class
            </Link>
          </Button> */}
          <Button variant="outline" asChild>
            <Link href="/courses">Continue Learning</Link>
          </Button>
        </div>
      </div>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Your overall progress across all courses
              </CardDescription>
            </div>
            <GenerateProgressButton />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading stats...</p>
              </div>
            ) : (
              <>
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
                </div>
                <Progress
                  value={stats?.overallCompletion || 0}
                  className="h-2 w-full"
                />
              </>
            )}
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
