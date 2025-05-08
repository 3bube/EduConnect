import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, GraduationCap, User, Video } from "lucide-react"

export default function CoursePage({ params }: { params: { id: string } }) {
  // Mock course data
  const course = {
    id: params.id,
    title: "Introduction to Computer Science",
    tutor: "Dr. Jane Smith",
    description:
      "This course provides a comprehensive introduction to the fundamental concepts of computer science, including algorithms, data structures, and programming basics.",
    image: "/placeholder.svg?height=300&width=600",
    sections: [
      {
        id: 1,
        title: "Getting Started with Programming",
        lessons: [
          {
            id: 1,
            title: "Introduction to Programming Concepts",
            type: "video",
            duration: "10:25",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          },
          {
            id: 2,
            title: "Setting Up Your Development Environment",
            type: "video",
            duration: "15:30",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          },
        ],
      },
      {
        id: 2,
        title: "Basic Programming Constructs",
        lessons: [
          {
            id: 3,
            title: "Variables and Data Types",
            type: "video",
            duration: "12:45",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          },
          {
            id: 4,
            title: "Control Structures",
            type: "video",
            duration: "18:20",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          },
        ],
      },
    ],
    materials: [
      {
        id: 1,
        title: "Programming Basics Cheat Sheet",
        type: "pdf",
        size: "1.2 MB",
      },
      {
        id: 2,
        title: "Development Environment Setup Guide",
        type: "pdf",
        size: "850 KB",
      },
      {
        id: 3,
        title: "Programming Exercises - Week 1",
        type: "doc",
        size: "620 KB",
      },
    ],
    assessments: [
      {
        id: 1,
        title: "Programming Fundamentals Quiz",
        questions: 15,
        timeLimit: "30 minutes",
      },
      {
        id: 2,
        title: "Basic Algorithms Assessment",
        questions: 10,
        timeLimit: "45 minutes",
      },
    ],
  }

  // Current lesson (first lesson for demo)
  const currentLesson = course.sections[0].lessons[0]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
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
          <div className="flex h-14 items-center border-b px-4 font-medium">Course Content</div>
          <div className="flex-1 overflow-auto py-2">
            {course.sections.map((section) => (
              <div key={section.id} className="px-4 py-2">
                <h3 className="font-medium">{section.title}</h3>
                <ul className="mt-2 space-y-1">
                  {section.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        href={`#lesson-${lesson.id}`}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted ${
                          lesson.id === currentLesson.id ? "bg-muted font-medium" : ""
                        }`}
                      >
                        <Video className="h-4 w-4" />
                        <span>{lesson.title}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{lesson.duration}</span>
                      </Link>
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
                <p className="text-muted-foreground">Instructor: {course.tutor}</p>
              </div>

              <div className="aspect-video overflow-hidden rounded-lg">
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  className="h-full w-full"
                  allowFullScreen
                ></iframe>
              </div>

              <div>
                <h2 className="text-xl font-semibold">{currentLesson.title}</h2>
                <p className="mt-2">{course.description}</p>
              </div>

              <Tabs defaultValue="materials">
                <TabsList>
                  <TabsTrigger value="materials">Study Materials</TabsTrigger>
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                </TabsList>
                <TabsContent value="materials" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {course.materials.map((material) => (
                      <Card key={material.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <CardTitle className="text-base">{material.title}</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                          <CardDescription>
                            {material.type.toUpperCase()} • {material.size}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="assessments" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {course.assessments.map((assessment) => (
                      <Card key={assessment.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{assessment.title}</CardTitle>
                          <CardDescription>
                            {assessment.questions} questions • {assessment.timeLimit}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button asChild>
                            <Link href={`/assessment/${assessment.id}`}>Start Assessment</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
