"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Download,
  FileText,
  Globe,
  Play,
  Star,
  User,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Mock course data
const courseData = {
  id: "course-1",
  title: "Introduction to Mathematics",
  description:
    "Learn the fundamentals of mathematics including algebra, geometry, and calculus. This comprehensive course is designed for beginners and will give you a solid foundation in mathematical concepts.",
  longDescription: `
    <p>Mathematics is the foundation of many disciplines and is essential for problem-solving in everyday life. This course provides a comprehensive introduction to key mathematical concepts, from basic arithmetic to more advanced topics like calculus.</p>
    <p>Throughout this course, you'll develop critical thinking skills, learn to approach problems methodically, and gain confidence in your mathematical abilities. Whether you're preparing for further studies or simply want to strengthen your math skills, this course will provide the knowledge and practice you need.</p>
    <h3>What you'll learn:</h3>
    <ul>
      <li>Master fundamental arithmetic operations and their applications</li>
      <li>Understand algebraic expressions, equations, and functions</li>
      <li>Explore geometric principles and spatial relationships</li>
      <li>Learn the basics of calculus, including limits, derivatives, and integrals</li>
      <li>Apply mathematical concepts to real-world problems</li>
    </ul>
  `,
  category: "Mathematics",
  level: "Beginner",
  duration: "10 weeks",
  rating: 4.8,
  reviews: 245,
  students: 1245,
  instructor: {
    name: "Dr. Smith",
    title: "Professor of Mathematics",
    bio: "Dr. Smith has over 15 years of experience teaching mathematics at university level. He specializes in making complex mathematical concepts accessible to beginners.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  price: 49.99,
  image: "/placeholder.svg?height=400&width=800",
  featured: true,
  tags: ["algebra", "geometry", "calculus"],
  requirements: [
    "Basic arithmetic skills",
    "No prior knowledge of algebra or calculus required",
    "A calculator (scientific calculator recommended)",
  ],
  objectives: [
    "Understand fundamental mathematical concepts",
    "Solve algebraic equations and inequalities",
    "Apply geometric principles to solve problems",
    "Grasp the basics of calculus",
    "Develop critical thinking and problem-solving skills",
  ],
  modules: [
    {
      id: "module-1",
      title: "Foundations of Mathematics",
      description:
        "Review of basic arithmetic and introduction to mathematical thinking",
      duration: "1 week",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Numbers and Operations",
          duration: "45 minutes",
          type: "video",
          completed: true,
        },
        {
          id: "lesson-1-2",
          title: "Order of Operations",
          duration: "30 minutes",
          type: "video",
          completed: true,
        },
        {
          id: "lesson-1-3",
          title: "Fractions and Decimals",
          duration: "50 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-1-4",
          title: "Week 1 Practice Problems",
          duration: "60 minutes",
          type: "exercise",
          completed: false,
        },
      ],
    },
    {
      id: "module-2",
      title: "Introduction to Algebra",
      description: "Learn about variables, expressions, and equations",
      duration: "2 weeks",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Variables and Expressions",
          duration: "40 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-2-2",
          title: "Solving Linear Equations",
          duration: "55 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-2-3",
          title: "Inequalities",
          duration: "45 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-2-4",
          title: "Week 2 Practice Problems",
          duration: "60 minutes",
          type: "exercise",
          completed: false,
        },
        {
          id: "lesson-2-5",
          title: "Week 3 Practice Problems",
          duration: "60 minutes",
          type: "exercise",
          completed: false,
        },
      ],
    },
    {
      id: "module-3",
      title: "Geometry Basics",
      description: "Explore shapes, angles, and spatial relationships",
      duration: "2 weeks",
      lessons: [
        {
          id: "lesson-3-1",
          title: "Points, Lines, and Planes",
          duration: "35 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-3-2",
          title: "Angles and Triangles",
          duration: "50 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-3-3",
          title: "Circles and Polygons",
          duration: "45 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-3-4",
          title: "Area and Volume",
          duration: "55 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-3-5",
          title: "Week 4-5 Practice Problems",
          duration: "90 minutes",
          type: "exercise",
          completed: false,
        },
      ],
    },
    {
      id: "module-4",
      title: "Functions and Graphs",
      description: "Understand functions and their graphical representations",
      duration: "2 weeks",
      lessons: [
        {
          id: "lesson-4-1",
          title: "Introduction to Functions",
          duration: "40 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-4-2",
          title: "Linear Functions",
          duration: "45 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-4-3",
          title: "Quadratic Functions",
          duration: "50 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-4-4",
          title: "Exponential and Logarithmic Functions",
          duration: "55 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-4-5",
          title: "Week 6-7 Practice Problems",
          duration: "90 minutes",
          type: "exercise",
          completed: false,
        },
      ],
    },
    {
      id: "module-5",
      title: "Introduction to Calculus",
      description: "Learn the basics of limits, derivatives, and integrals",
      duration: "3 weeks",
      lessons: [
        {
          id: "lesson-5-1",
          title: "Limits and Continuity",
          duration: "50 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-5-2",
          title: "Introduction to Derivatives",
          duration: "55 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-5-3",
          title: "Applications of Derivatives",
          duration: "60 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-5-4",
          title: "Introduction to Integrals",
          duration: "55 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-5-5",
          title: "Applications of Integrals",
          duration: "60 minutes",
          type: "video",
          completed: false,
        },
        {
          id: "lesson-5-6",
          title: "Week 8-10 Practice Problems",
          duration: "120 minutes",
          type: "exercise",
          completed: false,
        },
      ],
    },
  ],
  resources: [
    {
      id: "resource-1",
      title: "Course Syllabus",
      type: "pdf",
      size: "1.2 MB",
    },
    {
      id: "resource-2",
      title: "Formula Sheet",
      type: "pdf",
      size: "0.8 MB",
    },
    {
      id: "resource-3",
      title: "Practice Problem Set",
      type: "pdf",
      size: "2.5 MB",
    },
    {
      id: "resource-4",
      title: "Graphing Calculator Guide",
      type: "pdf",
      size: "1.5 MB",
    },
  ],
  enrolled: true,
  progress: 15,
};

export function CourseDetails({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolled, setIsEnrolled] = useState(courseData.enrolled);

  // Calculate total lessons and completed lessons
  const totalLessons = courseData.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  const completedLessons = courseData.modules.reduce(
    (total, module) =>
      total + module.lessons.filter((lesson) => lesson.completed).length,
    0
  );

  const handleEnroll = () => {
    // In a real app, this would make an API call to enroll the user
    setIsEnrolled(true);
    // Navigate to the first lesson
    router.push(`/courses/${courseId}/learn`);
  };

  const handleContinueLearning = () => {
    router.push(`/courses/${courseId}/learn`);
  };

  return (
    <div className="container px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              {courseData.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {courseData.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{courseData.rating}</span>
                <span className="ml-1 text-muted-foreground">
                  ({courseData.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Users className="mr-1 h-4 w-4" />
                {courseData.students} students
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {courseData.duration}
              </div>
              <div className="flex items-center">
                <Badge variant="outline">{courseData.level}</Badge>
              </div>
              <div className="flex items-center">
                <Badge variant="outline">{courseData.category}</Badge>
              </div>
            </div>

            <div className="mt-4 flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                />
                <AvatarFallback>
                  {courseData.instructor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium">
                  {courseData.instructor.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {courseData.instructor.title}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-xl">
            <Image
              src={courseData.image || "/placeholder.svg"}
              alt={courseData.title}
              width={800}
              height={400}
              className="h-auto w-full object-cover"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <div
                  dangerouslySetInnerHTML={{
                    __html: courseData.longDescription,
                  }}
                />

                <div>
                  <h3 className="mb-3 text-lg font-medium">Requirements</h3>
                  <ul className="space-y-2">
                    {courseData.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium">
                    What you'll learn
                  </h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {courseData.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Course Content</h3>
                    <p className="text-sm text-muted-foreground">
                      {courseData.modules.length} modules • {totalLessons}{" "}
                      lessons • {courseData.duration} total
                    </p>
                  </div>
                  {isEnrolled && (
                    <div className="text-sm">
                      <span className="font-medium">
                        {completedLessons}/{totalLessons}
                      </span>{" "}
                      lessons completed
                    </div>
                  )}
                </div>

                <Accordion type="multiple" className="w-full">
                  {courseData.modules.map((module) => (
                    <AccordionItem key={module.id} value={module.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-1 items-center justify-between pr-4 text-left">
                          <div>
                            <h4 className="font-medium">{module.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {module.description}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {module.lessons.length} lessons • {module.duration}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          {module.lessons.map((lesson) => (
                            <li
                              key={lesson.id}
                              className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
                            >
                              <div className="flex items-center">
                                {lesson.type === "video" ? (
                                  <Play className="mr-3 h-4 w-4" />
                                ) : (
                                  <FileText className="mr-3 h-4 w-4" />
                                )}
                                <span
                                  className={
                                    lesson.completed
                                      ? "text-muted-foreground"
                                      : ""
                                  }
                                >
                                  {lesson.title}
                                </span>
                                {lesson.completed && (
                                  <Badge variant="outline" className="ml-2">
                                    Completed
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {lesson.duration}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="instructor" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={courseData.instructor.avatar}
                      alt={courseData.instructor.name}
                    />
                    <AvatarFallback>
                      {courseData.instructor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">
                      {courseData.instructor.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {courseData.instructor.title}
                    </p>
                    <div className="mt-2 flex items-center">
                      <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{courseData.rating}</span>
                      <span className="ml-1 text-muted-foreground">
                        Instructor Rating
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-muted-foreground">
                      <FileText className="mr-1 h-4 w-4" />
                      12 Courses
                    </div>
                    <div className="mt-1 flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      3,245 Students
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-md font-medium">
                    About the Instructor
                  </h4>
                  <p>{courseData.instructor.bio}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Course Resources</h3>
                <p className="text-muted-foreground">
                  Download these resources to enhance your learning experience.
                </p>

                <ul className="space-y-2">
                  {courseData.resources.map((resource) => (
                    <li key={resource.id}>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>{resource.title}</span>
                          <Badge variant="outline" className="ml-2">
                            {resource.type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2 text-sm text-muted-foreground">
                            {resource.size}
                          </span>
                          <Download className="h-4 w-4" />
                        </div>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">${courseData.price}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEnrolled ? (
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>Your progress</span>
                        <span className="font-medium">
                          {courseData.progress}%
                        </span>
                      </div>
                      <Progress value={courseData.progress} className="h-2" />
                    </div>
                    <Button className="w-full" onClick={handleContinueLearning}>
                      <Play className="mr-2 h-4 w-4" />
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" onClick={handleEnroll}>
                    Enroll Now
                  </Button>
                )}

                <div className="space-y-3 pt-2">
                  <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Access on mobile and desktop</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Flexible learning schedule</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 pt-2">
                  <h4 className="font-medium">This course includes:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{totalLessons} lessons</span>
                    </li>
                    <li className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{courseData.duration} of content</span>
                    </li>
                    <li className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {courseData.resources.length} downloadable resources
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    30-day money-back guarantee
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
