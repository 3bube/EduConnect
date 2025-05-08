"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, GraduationCap, Plus, User, Users } from "lucide-react"

import { useRouter } from "next/navigation";
import { createCourse } from "./api";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string>("");
  const [tags, setTags] = useState("");
  const [requirements, setRequirements] = useState("");
  const [objectives, setObjectives] = useState("");
  const [resources, setResources] = useState("");

  // Modules and lessons
  const [modules, setModules] = useState([
    {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      duration: "",
      lessons: [
        { id: crypto.randomUUID(), title: "", videoUrl: "", duration: "", type: "video" }
      ]
    }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const handleCreateCourse = async () => {
    setError(null);
    if (!title.trim() || !description.trim()) {
      setError("Course title and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
      const instructor = user && user._id ? {
        id: user._id,
        name: user.name,
        avatar: user.avatar || ""
      } : null;
      if (!instructor) {
        setError("You must be logged in as a tutor to create a course.");
        setSubmitting(false);
        return;
      }
      // assemble payloads
      const modulesPayload = modules.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        duration: m.duration,
        lessons: m.lessons.map(l => ({
          id: l.id,
          title: l.title,
          duration: l.duration,
          type: l.type,
          content: { videoUrl: l.videoUrl, description: "" },
          resources: [],
          nextLessonId: "",
          prevLessonId: "",
        })),
      }));
      const lessonsPayload = modulesPayload.flatMap(m => m.lessons);
      const resourcesPayload = resources.split(",").map(r => r.trim()).filter(Boolean).map(r => ({
        id: crypto.randomUUID(), title: r, type: "link", size: "", url: r
      }));
      const courseData = {
        title,
        description,
        longDescription,
        category,
        level,
        lessons: lessonsPayload,
        duration,
        price: Number(price),
        image: image || "",
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        requirements: requirements.split(",").map(r => r.trim()).filter(Boolean),
        objectives: objectives.split(",").map(o => o.trim()).filter(Boolean),
        modules: modulesPayload,
        resources: resourcesPayload,
        instructor,
      };
      await createCourse(courseData);
      router.push("/tutor-dashboard");
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  // Module/lesson handlers
  const addModule = () => {
    setModules([
      ...modules,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        duration: "",
        lessons: [
          { id: crypto.randomUUID(), title: "", videoUrl: "", duration: "", type: "video" }
        ]
      }
    ]);
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons.push({
      id: crypto.randomUUID(),
      title: "",
      videoUrl: "",
      duration: "",
      type: "video"
    });
    setModules(updated);
  };

  const updateModuleTitle = (index: number, title: string) => {
    const updated = [...modules];
    updated[index].title = title;
    setModules(updated);
  };

  const updateModuleDescription = (i: number, desc: string) => {
    const u = [...modules]; u[i].description = desc; setModules(u);
  };

  const updateModuleDuration = (i: number, d: string) => {
    const u = [...modules]; u[i].duration = d; setModules(u);
  };

  const updateLessonTitle = (moduleIndex: number, lessonIndex: number, title: string) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex].title = title;
    setModules(updated);
  };

  const updateLessonVideoUrl = (moduleIndex: number, lessonIndex: number, url: string) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex].videoUrl = url;
    setModules(updated);
  };

  const updateLessonDuration = (mi: number, li: number, d: string) => {
    const u = [...modules]; u[mi].lessons[li].duration = d; setModules(u);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span>EduConnect</span>
          </Link>

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
              <h1 className="text-2xl font-bold">Create New Course</h1>
              <p className="text-muted-foreground">Fill in the details to create your new course</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                  <CardDescription>Basic information about your course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Introduction to Programming"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Short summary of your course"
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longDescription">Long Description</Label>
                    <Textarea
                      id="longDescription"
                      placeholder="Full detailed description of your course"
                      rows={4}
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Programming, Math"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Input
                        id="level"
                        placeholder="e.g., Beginner, Intermediate, Advanced"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        placeholder="e.g., 10h 30m"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g., 49.99"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Course Thumbnail URL</Label>
                    <Input
                      id="image"
                      type="text"
                      placeholder="https://..."
                      value={image}
                      onChange={e => setImage(e.target.value)}
                    />
                    {image && (
                      <img src={image} alt="Course Thumbnail Preview" className="mt-2 h-32 rounded object-cover border" />
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        placeholder="e.g., programming, python, web"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Requirements (comma separated)</Label>
                      <Input
                        id="requirements"
                        placeholder="e.g., Laptop, Internet"
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objectives">Objectives (comma separated)</Label>
                    <Input
                      id="objectives"
                      placeholder="e.g., Build a website, Understand JS"
                      value={objectives}
                      onChange={(e) => setObjectives(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Modules & Lessons</CardTitle>
                  <CardDescription>Add modules and lessons to your course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="space-y-4 rounded-md border p-4">
                      <div className="space-y-2">
                        <Label htmlFor={`module-${moduleIndex}`}>Module Title</Label>
                        <Input
                          id={`module-${moduleIndex}`}
                          placeholder="e.g., Getting Started"
                          value={module.title}
                          onChange={(e) => updateModuleTitle(moduleIndex, e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Module Description</Label>
                        <Textarea
                          value={module.description}
                          onChange={(e) => updateModuleDescription(moduleIndex, e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Module Duration</Label>
                        <Input
                          value={module.duration}
                          onChange={(e) => updateModuleDuration(moduleIndex, e.target.value)}
                        />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Lessons</h4>
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="space-y-2 rounded-md border p-3">
                            <div className="space-y-2">
                              <Label htmlFor={`lesson-${moduleIndex}-${lessonIndex}`}>Lesson Title</Label>
                              <Input
                                id={`lesson-${moduleIndex}-${lessonIndex}`}
                                placeholder="e.g., Introduction to Variables"
                                value={lesson.title}
                                onChange={(e) => updateLessonTitle(moduleIndex, lessonIndex, e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`video-${moduleIndex}-${lessonIndex}`}>Video URL</Label>
                              <Input
                                id={`video-${moduleIndex}-${lessonIndex}`}
                                placeholder="YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                                value={lesson.videoUrl}
                                onChange={(e) => updateLessonVideoUrl(moduleIndex, lessonIndex, e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Lesson Duration</Label>
                              <Input
                                value={lesson.duration}
                                onChange={(e) => updateLessonDuration(moduleIndex, lessonIndex, e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" onClick={() => addLesson(moduleIndex)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Lesson
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addModule}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Module
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Materials</CardTitle>
                  <CardDescription>List additional resources for your students (comma separated URLs or file names)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="resources">Resources (comma separated)</Label>
                    <Input
                      id="resources"
                      placeholder="e.g., syllabus.pdf, https://drive.com/resource"
                      value={resources}
                      onChange={(e) => setResources(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {error && (
                <div className="mb-4 text-center text-sm text-red-600 font-medium">
                  {error}
                </div>
              )}
              <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link href="/tutor-dashboard">Cancel</Link>
                </Button>
                <Button onClick={handleCreateCourse} disabled={submitting}>
                  {submitting ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
