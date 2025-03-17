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

// Mock data
const ongoingCourses = [
  {
    id: "course-1",
    title: "Introduction to Mathematics",
    progress: 65,
    nextLesson: "Algebra Fundamentals",
    image: "/placeholder.svg?height=100&width=180",
  },
  {
    id: "course-2",
    title: "Advanced English Literature",
    progress: 42,
    nextLesson: "Shakespeare's Sonnets",
    image: "/placeholder.svg?height=100&width=180",
  },
  {
    id: "course-3",
    title: "Physics 101",
    progress: 78,
    nextLesson: "Newton's Laws of Motion",
    image: "/placeholder.svg?height=100&width=180",
  },
];

const upcomingAssignments = [
  {
    id: "assignment-1",
    title: "Mathematics Problem Set",
    course: "Introduction to Mathematics",
    dueDate: "2023-09-15T23:59:59",
    status: "pending",
  },
  {
    id: "assignment-2",
    title: "Literary Analysis Essay",
    course: "Advanced English Literature",
    dueDate: "2023-09-18T23:59:59",
    status: "pending",
  },
  {
    id: "assignment-3",
    title: "Physics Lab Report",
    course: "Physics 101",
    dueDate: "2023-09-20T23:59:59",
    status: "pending",
  },
];

const upcomingClasses = [
  {
    id: "class-1",
    title: "Algebra Fundamentals",
    course: "Introduction to Mathematics",
    startTime: "2023-09-14T10:00:00",
    endTime: "2023-09-14T11:30:00",
    tutor: "Dr. Smith",
  },
  {
    id: "class-2",
    title: "Shakespeare's Sonnets Analysis",
    course: "Advanced English Literature",
    startTime: "2023-09-15T14:00:00",
    endTime: "2023-09-15T15:30:00",
    tutor: "Prof. Johnson",
  },
];

const recommendedCourses = [
  {
    id: "rec-course-1",
    title: "Chemistry Basics",
    description: "Learn the fundamentals of chemistry and chemical reactions",
    rating: 4.8,
    students: 1245,
    image: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "rec-course-2",
    title: "Introduction to Computer Science",
    description: "Explore programming concepts and algorithms",
    rating: 4.9,
    students: 2389,
    image: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "rec-course-3",
    title: "World History: Ancient Civilizations",
    description: "Discover the wonders of ancient civilizations",
    rating: 4.7,
    students: 987,
    image: "/placeholder.svg?height=120&width=200",
  },
];

export function StudentDashboard() {
  const { user } = useAuth();

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

  return (
    <div className="container space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your learning journey today.
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
                <p className="text-2xl font-bold">62%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Courses Enrolled</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div>
                <p className="text-sm font-medium">Hours Studied</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <div>
                <p className="text-sm font-medium">Assignments Completed</p>
                <p className="text-2xl font-bold">12/18</p>
              </div>
            </div>
            <Progress value={62} className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Ongoing Courses */}
      <div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Your Ongoing Courses
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ongoingCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video w-full">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  width={320}
                  height={180}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>Next: {course.nextLesson}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {course.progress}% complete
                  </span>
                  <span className="text-sm font-medium">
                    {course.progress}/100
                  </span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link href={`/courses/${course.id}`}>
                      Continue Learning
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        {assignment.title}
                      </CardTitle>
                      <Badge
                        variant={
                          getDaysRemaining(assignment.dueDate) <= 2
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {getDaysRemaining(assignment.dueDate)} days left
                      </Badge>
                    </div>
                    <CardDescription>{assignment.course}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      Due: {formatDate(assignment.dueDate)}
                    </div>
                    <div className="mt-4">
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/assignments/${assignment.id}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          View Assignment
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="classes">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingClasses.map((classItem) => (
                <Card key={classItem.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        {classItem.title}
                      </CardTitle>
                      <Badge>Live</Badge>
                    </div>
                    <CardDescription>{classItem.course}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(classItem.startTime)}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        Tutor: {classItem.tutor}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button asChild className="w-full">
                        <Link href={`/live-classes/${classItem.id}`}>
                          <Play className="mr-2 h-4 w-4" />
                          Join Class
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recommended Courses */}
      <div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Recommended for You
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video w-full">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  width={320}
                  height={180}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    {course.students} students
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/courses/${course.id}`}>View Course</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
