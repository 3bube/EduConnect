"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCourseById, markLessonComplete } from "@/api/course";
import type { Course, MarkLessonCompleteParams } from "@/api/course";
import Link from "next/link";
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

export function LearningMaterial({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  const {
    data: course,
    isLoading,
    error,
  } = useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const response = await getCourseById(courseId);
      return response.course;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  console.log();

  const { mutate: markLessonCompleteMutation } = useMutation<
    Course,
    Error,
    MarkLessonCompleteParams
  >({
    mutationFn: markLessonComplete,
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading course materials...</div>;
  }

  if (error || !course) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading course materials
      </div>
    );
  }

  const currentModule = course?.modules?.[currentModuleIndex];
  const currentLesson = course?.lessons?.[currentLessonIndex];

  console.log(currentLesson);

  // Calculate total lessons and completed lessons
  const totalLessons = course?.modules?.reduce(
    (total, module) => total + (module.lessons?.length || 0),
    0
  );

  const completedLessons = course?.modules?.reduce(
    (total, module) =>
      total + module.lessons?.filter((lesson) => lesson.completed).length,
    0
  );

  const handleLessonSelect = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < currentModule?.lessons?.length - 1) {
      // Next lesson in current module
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < course?.modules?.length - 1) {
      // First lesson in next module
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      // Previous lesson in current module
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (
      currentModuleIndex > 0 &&
      course?.modules?.[currentModuleIndex - 1]?.lessons?.length
    ) {
      // Last lesson in previous module
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(
        course?.modules?.[currentModuleIndex - 1]?.lessons?.length - 1
      );
    }
  };

  const markAsCompleted = async () => {
    if (!currentLesson?.id) return;

    try {
      await markLessonCompleteMutation(
        {
          courseId,
          lessonId: currentLesson.id,
        },
        {
          onSuccess: () => {
            handleNextLesson();
          },
          onError: (error) => {
            console.error("Failed to mark lesson as complete:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
    }
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
          <h1 className="ml-2 text-lg font-medium">{course.title}</h1>
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
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {completedLessons} of {totalLessons} lessons completed
                </p>
              </div>

              <Accordion
                type="multiple"
                defaultValue={[currentModule?.id]}
                className="w-full"
              >
                {course.modules?.map((module, moduleIndex) => (
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
                                ) : lesson.type.toLowerCase() === "video" ? (
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
                {currentModule?.title} • Lesson {currentLessonIndex + 1} of{" "}
                {currentModule?.lessons.length}
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                {/* <TabsTrigger value="discussion">Discussion</TabsTrigger> */}
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-6">
                {currentLesson?.type.toLowerCase() === "video" &&
                currentLesson?.content ? (
                  <div className="space-y-6">
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <iframe
                        src={`https://www.youtube.com/embed/${
                          currentLesson.content.videoUrl
                            .split("v=")[1]
                            ?.split("&")[0]
                        }?autoplay=0&rel=0&modestbranding=1&origin=${encodeURIComponent(
                          window.location.origin
                        )}`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        frameBorder="0"
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
                    {course.discussions?.map((discussion) => (
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
                    {course.resources?.map((resource) => (
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
                  currentModuleIndex === course.modules?.length - 1 &&
                  currentLessonIndex === currentModule.lessons?.length - 1
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
