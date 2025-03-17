"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Download,
  FileText,
  MessageSquare,
  Play,
  Settings,
  ThumbsUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock course data
const courseData = {
  id: "course-1",
  title: "Introduction to Mathematics",
  progress: 15,
  modules: [
    {
      id: "module-1",
      title: "Foundations of Mathematics",
      description:
        "Review of basic arithmetic and introduction to mathematical thinking",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Numbers and Operations",
          duration: "45 minutes",
          type: "video",
          completed: true,
          content: {
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
            description:
              "This lesson covers the fundamental concepts of numbers and basic arithmetic operations.",
            transcript:
              "In this lesson, we'll explore the foundation of all mathematics: numbers and operations...",
          },
        },
        {
          id: "lesson-1-2",
          title: "Order of Operations",
          duration: "30 minutes",
          type: "video",
          completed: true,
          content: {
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
            description:
              "Learn about the order of operations (PEMDAS) and how to apply it to solve complex expressions.",
            transcript:
              "When evaluating mathematical expressions, we follow a specific order called PEMDAS...",
          },
        },
        {
          id: "lesson-1-3",
          title: "Fractions and Decimals",
          duration: "50 minutes",
          type: "video",
          completed: false,
          content: {
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
            description:
              "This lesson explains fractions, decimals, and the relationship between them.",
            transcript:
              "Fractions and decimals are different ways to represent parts of a whole...",
          },
        },
        {
          id: "lesson-1-4",
          title: "Week 1 Practice Problems",
          duration: "60 minutes",
          type: "exercise",
          completed: false,
          content: {
            problems: [
              {
                id: "problem-1",
                question: "Evaluate the expression: 3 + 4 × (2 + 1) ÷ 3 - 1",
                options: ["6", "8", "5", "7"],
                correctAnswer: "6",
              },
              {
                id: "problem-2",
                question: "Convert 3/4 to a decimal.",
                options: ["0.75", "0.25", "0.5", "0.375"],
                correctAnswer: "0.75",
              },
              {
                id: "problem-3",
                question: "What is the result of 2.5 + 1.75?",
                options: ["3.25", "4.25", "3.75", "4"],
                correctAnswer: "4.25",
              },
            ],
          },
        },
      ],
    },
    {
      id: "module-2",
      title: "Introduction to Algebra",
      description: "Learn about variables, expressions, and equations",
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
  ],
  discussions: [
    {
      id: "discussion-1",
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-09-10T14:30:00",
      content:
        "I'm having trouble understanding the order of operations. Can someone explain why we do multiplication before addition?",
      replies: [
        {
          id: "reply-1",
          user: {
            name: "Dr. Smith",
            avatar: "/placeholder.svg?height=40&width=40",
            isInstructor: true,
          },
          date: "2023-09-10T15:45:00",
          content:
            "Great question! The order of operations is a convention that mathematicians agreed upon to ensure everyone gets the same answer when evaluating expressions. Multiplication and division are performed before addition and subtraction because they represent more 'powerful' operations. Think of it as building blocks - multiplication is repeated addition, so we handle it first.",
        },
      ],
    },
  ],
};

export function LearningMaterial({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  const currentModule = courseData.modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];

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

  const handleLessonSelect = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      // Next lesson in current module
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < courseData.modules.length - 1) {
      // First lesson in next module
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      // Previous lesson in current module
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      // Last lesson in previous module
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(
        courseData.modules[currentModuleIndex - 1].lessons.length - 1
      );
    }
  };

  const markAsCompleted = () => {
    // In a real app, this would make an API call to update the lesson status
    // For now, we'll just navigate to the next lesson
    handleNextLesson();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/courses/${courseId}`}>
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to course</span>
            </Link>
          </Button>
          <h1 className="ml-2 text-lg font-medium">{courseData.title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Hide" : "Show"} Curriculum
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 overflow-y-auto border-r">
            <div className="p-4">
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Your progress</span>
                  <span className="font-medium">{courseData.progress}%</span>
                </div>
                <Progress value={courseData.progress} className="h-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {completedLessons} of {totalLessons} lessons completed
                </p>
              </div>

              <Accordion
                type="multiple"
                defaultValue={[currentModule.id]}
                className="w-full"
              >
                {courseData.modules.map((module, moduleIndex) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="text-left">
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {module.lessons.length} lessons
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1 pt-1">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lesson.id}>
                            <Button
                              variant="ghost"
                              className={`w-full justify-start ${
                                moduleIndex === currentModuleIndex &&
                                lessonIndex === currentLessonIndex
                                  ? "bg-muted"
                                  : ""
                              }`}
                              onClick={() =>
                                handleLessonSelect(moduleIndex, lessonIndex)
                              }
                            >
                              <div className="flex w-full items-center">
                                {lesson.completed ? (
                                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                ) : lesson.type === "video" ? (
                                  <Play className="mr-2 h-4 w-4" />
                                ) : (
                                  <FileText className="mr-2 h-4 w-4" />
                                )}
                                <span className="text-left">
                                  {lesson.title}
                                </span>
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {lesson.duration}
                                </span>
                              </div>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{currentLesson?.title}</h2>
              <p className="text-muted-foreground">
                {currentModule.title} • Lesson {currentLessonIndex + 1} of{" "}
                {currentModule.lessons.length}
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-6">
                {currentLesson?.type === "video" && currentLesson?.content ? (
                  <div className="space-y-6">
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <iframe
                        src={currentLesson.content.videoUrl}
                        className="h-full w-full"
                        allowFullScreen
                        title={currentLesson.title}
                      ></iframe>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-medium">Description</h3>
                      <p>{currentLesson.content.description}</p>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-medium">Transcript</h3>
                      <p className="whitespace-pre-line">
                        {currentLesson.content.transcript}
                      </p>
                    </div>
                  </div>
                ) : currentLesson?.type === "exercise" &&
                  currentLesson?.content ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-lg font-medium">
                        Practice Problems
                      </h3>
                      <p className="mb-6">
                        Complete these practice problems to test your
                        understanding of the material.
                      </p>

                      <div className="space-y-8">
                        {currentLesson.content.problems.map(
                          (problem, index) => (
                            <div
                              key={problem.id}
                              className="rounded-lg border p-4"
                            >
                              <h4 className="mb-3 font-medium">
                                Question {index + 1}: {problem.question}
                              </h4>
                              <div className="space-y-2">
                                {problem.options.map((option) => (
                                  <div
                                    key={option}
                                    className="flex items-center"
                                  >
                                    <input
                                      type="radio"
                                      id={`${problem.id}-${option}`}
                                      name={problem.id}
                                      className="h-4 w-4 border-gray-300"
                                    />
                                    <label
                                      htmlFor={`${problem.id}-${option}`}
                                      className="ml-2 block text-sm"
                                    >
                                      {option}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <div className="mt-6">
                        <Button>Submit Answers</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-lg border">
                    <p className="text-muted-foreground">
                      No content available for this lesson.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="discussion" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Discussion</h3>

                  <div className="space-y-4">
                    {courseData.discussions.map((discussion) => (
                      <div
                        key={discussion.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={discussion.user.avatar}
                              alt={discussion.user.name}
                            />
                            <AvatarFallback>
                              {discussion.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">
                                {discussion.user.name}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(discussion.date)}
                              </span>
                            </div>
                            <p className="mt-1">{discussion.content}</p>
                            <div className="mt-2 flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="mr-1 h-4 w-4" />
                                Like
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="mr-1 h-4 w-4" />
                                Reply
                              </Button>
                            </div>

                            {discussion.replies &&
                              discussion.replies.length > 0 && (
                                <div className="mt-4 space-y-4 pl-6">
                                  {discussion.replies.map((reply) => (
                                    <div
                                      key={reply.id}
                                      className="rounded-lg bg-muted p-3"
                                    >
                                      <div className="flex items-start space-x-3">
                                        <Avatar>
                                          <AvatarImage
                                            src={reply.user.avatar}
                                            alt={reply.user.name}
                                          />
                                          <AvatarFallback>
                                            {reply.user.name.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="flex items-center">
                                            <h5 className="font-medium">
                                              {reply.user.name}
                                            </h5>
                                            {reply.user.isInstructor && (
                                              <Badge
                                                className="ml-2"
                                                variant="secondary"
                                              >
                                                Instructor
                                              </Badge>
                                            )}
                                            <span className="ml-auto text-xs text-muted-foreground">
                                              {formatDate(reply.date)}
                                            </span>
                                          </div>
                                          <p className="mt-1">
                                            {reply.content}
                                          </p>
                                          <div className="mt-2 flex items-center space-x-2">
                                            <Button variant="ghost" size="sm">
                                              <ThumbsUp className="mr-1 h-4 w-4" />
                                              Like
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Add a comment</h4>
                    <textarea
                      className="mb-2 h-24 w-full rounded-md border p-2"
                      placeholder="Write your comment here..."
                    ></textarea>
                    <Button>Post Comment</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Lesson Resources</h3>

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

            <Separator className="my-6" />

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousLesson}
                disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Lesson
              </Button>

              {!currentLesson?.completed ? (
                <Button onClick={markAsCompleted}>Mark as Completed</Button>
              ) : (
                <Button variant="outline" disabled>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Completed
                </Button>
              )}

              <Button
                onClick={handleNextLesson}
                disabled={
                  currentModuleIndex === courseData.modules.length - 1 &&
                  currentLessonIndex === currentModule.lessons.length - 1
                }
              >
                Next Lesson
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
