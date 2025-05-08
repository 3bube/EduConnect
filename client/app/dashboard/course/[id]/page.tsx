"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Download, FileText, GraduationCap, User, Video, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { getCourseById, Course, markLessonComplete } from "@/api/course"
import { getCourseProgress } from "@/api/student"

interface Lesson {
  id: string;
  title: string;
  content: string | { description: string; videoUrl?: string; problems?: any[] };
  duration: string;
  order: number;
  completed?: boolean;
  type?: string;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  lessons: Lesson[];
}

interface Resource {
  id: string;
  title: string;
  type: string;
  url: string;
  size?: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: string;
  totalPoints: number;
  dueDate?: string;
  questions?: number;
}

export default function StudentCoursePage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string>("");
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  
  // Convert YouTube watch URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Match YouTube URL patterns
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    // If valid YouTube URL, return embed URL
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    // Return original URL if not a valid YouTube URL
    return url;
  };

  // Fetch course data
  useEffect(() => {
    async function loadCourseData() {
      try {
        setLoading(true);
        // Get course details
        const courseData = await getCourseById(params.id);
        setCourse(courseData);
        
        // Get course progress
        const progressData = await getCourseProgress(params.id);
        setProgress(progressData.progressPercentage || 0);
        setCompletedLessons(progressData.completedLessons || []);
        
        // Organize lessons into modules
        let moduleData: Module[] = [];
        
        // If course has modules, use them
        if (courseData.modules && courseData.modules.length > 0) {
          moduleData = courseData.modules.map((module: any) => ({
            id: module.id || module._id,
            title: module.title,
            description: module.description,
            duration: module.duration,
            lessons: (module.lessons || []).map((lesson: any) => ({
              id: lesson.id || lesson._id,
              title: lesson.title,
              content: lesson.content,
              duration: lesson.duration,
              order: lesson.order,
              type: lesson.type || "video",
              completed: completedLessons.includes(lesson.id || lesson._id)
            }))
          }));
        } 
        // If no modules but has lessons, create a default module
        else if (courseData.lessons && courseData.lessons.length > 0) {
          moduleData = [{
            id: "default-module",
            title: "Course Content",
            lessons: courseData.lessons.map((lesson: any) => ({
              id: lesson.id || lesson._id,
              title: lesson.title,
              content: lesson.content,
              duration: lesson.duration,
              order: lesson.order,
              type: lesson.type || "video",
              completed: completedLessons.includes(lesson.id || lesson._id)
            }))
          }];
        }
        
        setModules(moduleData);
        
        // Set resources
        if (courseData.resources) {
          setResources(Array.isArray(courseData.resources) ? courseData.resources : []);
        }
        
        // Set current lesson (either next lesson or first lesson)
        if (progressData.nextLesson && progressData.nextLesson.id) {
          setCurrentLessonId(progressData.nextLesson.id);
        } else if (moduleData.length > 0 && moduleData[0].lessons.length > 0) {
          setCurrentLessonId(moduleData[0].lessons[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load course data");
      } finally {
        setLoading(false);
      }
    }
    
    loadCourseData();
  }, [params.id]);
  
  // Update current lesson when currentLessonId changes
  useEffect(() => {
    if (!currentLessonId || modules.length === 0) return;
    
    // Find the current lesson in modules
    for (const module of modules) {
      const lesson = module.lessons.find(l => l.id === currentLessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        return;
      }
    }
  }, [currentLessonId, modules]);
  
  // Handle marking a lesson as complete
  const handleMarkComplete = async () => {
    if (!currentLesson || !course || !currentLessonId) return;
    
    try {
      await markLessonComplete({
        courseId: params.id,
        lessonId: currentLessonId
      });
      
      // Update completed lessons locally
      const updatedCompletedLessons = [...completedLessons, currentLessonId];
      setCompletedLessons(updatedCompletedLessons);
      
      // Update modules to reflect completion
      const updatedModules = modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => 
          lesson.id === currentLessonId 
            ? { ...lesson, completed: true }
            : lesson
        )
      }));
      setModules(updatedModules);
      
      // Calculate new progress
      const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
      const newProgress = totalLessons > 0 
        ? Math.round((updatedCompletedLessons.length / totalLessons) * 100)
        : 0;
      setProgress(newProgress);
      
      // Move to next lesson if available
      const allLessons = modules.flatMap(module => module.lessons);
      const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
      
      if (currentIndex < allLessons.length - 1) {
        // There's a next lesson
        setCurrentLessonId(allLessons[currentIndex + 1].id);
      }
    } catch (err: any) {
      console.error("Error marking lesson as complete:", err);
    }
  };
  
  // Handle navigation to previous lesson
  const handlePreviousLesson = () => {
    const allLessons = modules.flatMap(module => module.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
    
    if (currentIndex > 0) {
      setCurrentLessonId(allLessons[currentIndex - 1].id);
    }
  };
  
  // Handle navigation to next lesson
  const handleNextLesson = () => {
    const allLessons = modules.flatMap(module => module.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
    
    if (currentIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentIndex + 1].id);
    }
  };
  
  // Get navigation button states
  const allLessons = modules.flatMap(module => module.lessons);
  const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;
  
  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading course content...</div>;
  if (error) return <div className="flex min-h-screen items-center justify-center text-red-500">{error}</div>;
  if (!course || !currentLesson) return <div className="flex min-h-screen items-center justify-center">No course data available</div>;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
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
        <aside className="hidden w-[300px] flex-col border-r md:flex">
          <div className="flex h-14 items-center border-b px-4 font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <div className="px-4 py-2">
              <h2 className="font-semibold">{course.title}</h2>
              <div className="mt-2 flex items-center text-sm">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
            {modules.map((moduleItem) => (
              <div key={moduleItem.id} className="px-4 py-2">
                <h3 className="font-medium">{moduleItem.title}</h3>
                <ul className="mt-2 space-y-1">
                  {moduleItem.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <button
                        onClick={() => setCurrentLessonId(lesson.id)}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted ${
                          lesson.id === currentLessonId ? "bg-muted font-medium" : ""
                        }`}
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border">
                          {lesson.completed ? (
                            <div className="h-3 w-3 rounded-full bg-primary" />
                          ) : (
                            <Video className="h-3 w-3" />
                          )}
                        </div>
                        <span>{lesson.title}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{lesson.duration}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <div className="container max-w-6xl px-4 py-6 md:px-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-muted-foreground">Instructor: {course.instructor?.name}</p>
              </div>

              {currentLesson && (
                <>
                  {typeof currentLesson.content === 'object' && currentLesson.content.videoUrl ? (
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <iframe
                        src={getYouTubeEmbedUrl(currentLesson.content.videoUrl)}
                        title={currentLesson.title}
                        className="h-full w-full"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="rounded-lg border p-4 bg-muted-foreground/5">
                      <p className="text-sm">No video available for this lesson</p>
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl font-semibold">{currentLesson.title}</h2>
                    <div className="mt-2">
                      {typeof currentLesson.content === 'string' ? (
                        <p>{currentLesson.content}</p>
                      ) : (
                        <p>{currentLesson.content.description}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Tabs defaultValue="materials">
                <TabsList>
                  <TabsTrigger value="materials">Study Materials</TabsTrigger>
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                  <TabsTrigger value="notes">My Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="materials" className="space-y-4">
                  {resources.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {resources.map((material) => (
                        <Card key={material.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <CardTitle className="text-base">{material.title}</CardTitle>
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <Link href={material.url} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Link>
                              </Button>
                            </div>
                            <CardDescription>
                              {material.type.toUpperCase()}{material.size ? ` • ${material.size}` : ''}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No study materials available for this course</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="assessments" className="space-y-4">
                  {course.assessments && course.assessments.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {course.assessments.map((assessment) => (
                        <Card key={assessment.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{assessment.title}</CardTitle>
                            <CardDescription>
                              {assessment.type} • {assessment.duration}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button asChild>
                              <Link href={`/dashboard/assessment/${assessment.id}`}>Start Assessment</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No assessments available for this course</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="notes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Notes</CardTitle>
                      <CardDescription>Your personal notes for this lesson</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Type your notes here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      ></textarea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  disabled={!hasPrevious}
                  onClick={handlePreviousLesson}
                >
                  Previous Lesson
                </Button>
                <Button 
                  onClick={currentLesson?.completed ? handleNextLesson : handleMarkComplete}
                  variant={currentLesson?.completed ? "outline" : "default"}
                >
                  {currentLesson?.completed ? "Next Lesson" : "Mark as Complete"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
