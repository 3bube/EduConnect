"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, GraduationCap, Plus, Save, Trash2, Upload, User, Users, Video } from "lucide-react"

export default function EditCoursePage({ params }: { params: { id: string } }) {
  // Mock course data
  const [course, setCourse] = useState({
    id: params.id,
    title: "Introduction to Computer Science",
    description:
      "This course provides a comprehensive introduction to the fundamental concepts of computer science, including algorithms, data structures, and programming basics.",
    sections: [
      {
        id: 1,
        title: "Getting Started with Programming",
        lessons: [
          {
            id: 1,
            title: "Introduction to Programming Concepts",
            type: "video",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
          {
            id: 2,
            title: "Setting Up Your Development Environment",
            type: "video",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
        ],
      },
    ],
    materials: [
      {
        id: 1,
        title: "Programming Basics Cheat Sheet",
        type: "pdf",
      },
      {
        id: 2,
        title: "Development Environment Setup Guide",
        type: "pdf",
      },
    ],
    assessments: [
      {
        id: 1,
        title: "Programming Fundamentals Quiz",
        questions: [
          {
            id: 1,
            question: "What does HTML stand for?",
            options: [
              "Hyper Text Markup Language",
              "High Tech Multi Language",
              "Hyper Transfer Markup Language",
              "Home Tool Markup Language",
            ],
            correctAnswer: 0,
          },
          {
            id: 2,
            question: "Which of the following is NOT a programming language?",
            options: ["Java", "Python", "HTML", "C++"],
            correctAnswer: 2,
          },
        ],
      },
    ],
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span>EduConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[250px] flex-col border-r md:flex">
          <div className="flex h-14 items-center border-b px-4 font-medium">Tutor Dashboard</div>
          <nav className="grid gap-1 p-2">
            <Link
              href="/tutor-dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              My Courses
            </Link>
            <Link
              href="/tutor-dashboard/students"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              Students
            </Link>
            <Link
              href="/tutor-dashboard/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="container max-w-6xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Edit Course</h1>
              <p className="text-muted-foreground">Update your course content and materials</p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            <Tabs defaultValue="content">
              <TabsList>
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="materials">Study Materials</TabsTrigger>
                <TabsTrigger value="assessments">Assessments</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-4">
                {course.sections.map((section, sectionIndex) => (
                  <Card key={section.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Input
                          value={section.title}
                          onChange={(e) => {
                            const updatedSections = [...course.sections]
                            updatedSections[sectionIndex].title = e.target.value
                            setCourse({ ...course, sections: updatedSections })
                          }}
                          className="text-lg font-semibold"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete Section</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex items-center gap-4 rounded-md border p-3">
                          <Video className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1 space-y-2">
                            <Input
                              value={lesson.title}
                              onChange={(e) => {
                                const updatedSections = [...course.sections]
                                updatedSections[sectionIndex].lessons[lessonIndex].title = e.target.value
                                setCourse({ ...course, sections: updatedSections })
                              }}
                              className="font-medium"
                            />
                            <Input
                              value={lesson.videoUrl}
                              onChange={(e) => {
                                const updatedSections = [...course.sections]
                                updatedSections[sectionIndex].lessons[lessonIndex].videoUrl = e.target.value
                                setCourse({ ...course, sections: updatedSections })
                              }}
                              placeholder="YouTube URL"
                            />
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Lesson</span>
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Lesson
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </TabsContent>
              <TabsContent value="materials" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Materials</CardTitle>
                    <CardDescription>
                      Upload PDF documents, presentations, and other resources for your students
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.materials.map((material, index) => (
                      <div key={material.id} className="flex items-center gap-4 rounded-md border p-3">
                        <div className="flex-1">
                          <Input
                            value={material.title}
                            onChange={(e) => {
                              const updatedMaterials = [...course.materials]
                              updatedMaterials[index].title = e.target.value
                              setCourse({ ...course, materials: updatedMaterials })
                            }}
                          />
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete Material</span>
                        </Button>
                      </div>
                    ))}
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Upload study materials</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Drag and drop files or click to browse</p>
                        <Button className="mt-4">Upload Files</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="assessments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Assessments</CardTitle>
                    <CardDescription>Create quizzes and tests to evaluate student understanding</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.assessments.map((assessment, assessmentIndex) => (
                      <div key={assessment.id} className="space-y-4 rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <Input
                            value={assessment.title}
                            onChange={(e) => {
                              const updatedAssessments = [...course.assessments]
                              updatedAssessments[assessmentIndex].title = e.target.value
                              setCourse({ ...course, assessments: updatedAssessments })
                            }}
                            className="text-lg font-semibold"
                          />
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Assessment</span>
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {assessment.questions.map((question, questionIndex) => (
                            <Card key={question.id}>
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <Input
                                    value={question.question}
                                    onChange={(e) => {
                                      const updatedAssessments = [...course.assessments]
                                      updatedAssessments[assessmentIndex].questions[questionIndex].question =
                                        e.target.value
                                      setCourse({ ...course, assessments: updatedAssessments })
                                    }}
                                    className="font-medium"
                                  />
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete Question</span>
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <Input
                                      type="radio"
                                      checked={optionIndex === question.correctAnswer}
                                      onChange={() => {
                                        const updatedAssessments = [...course.assessments]
                                        updatedAssessments[assessmentIndex].questions[questionIndex].correctAnswer =
                                          optionIndex
                                        setCourse({ ...course, assessments: updatedAssessments })
                                      }}
                                      className="h-4 w-4"
                                    />
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const updatedAssessments = [...course.assessments]
                                        updatedAssessments[assessmentIndex].questions[questionIndex].options[
                                          optionIndex
                                        ] = e.target.value
                                        setCourse({ ...course, assessments: updatedAssessments })
                                      }}
                                      className="flex-1"
                                    />
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete Option</span>
                                    </Button>
                                  </div>
                                ))}
                                <Button variant="outline" size="sm">
                                  <Plus className="mr-2 h-3 w-3" />
                                  Add Option
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                          <Button variant="outline" className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Question
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Assessment
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
