"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Check, Clock, GraduationCap, Search, User, Users } from "lucide-react"
import { getCourseById, Course, enrollCourse } from "@/api/course"
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function CourseDetailsPage() {
  const { id } = useParams();
  // Ensure id is a string (use first if array)
  const courseId = Array.isArray(id) ? id[0] : id;
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    getCourseById(courseId)
      .then(c => {
        setCourse(c);
        // Check if this specific course is enrolled
        console.log('Course enrollment status:', c.enrolled);
        setIsEnrolled(c.enrolled === true);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId]);
  
  // Additional check for enrollment status whenever course changes
  useEffect(() => {
    if (course?.enrolled === true) {
      setIsEnrolled(true);
      console.log('User is enrolled in this course');
    }
  }, [course]);

  if (loading) return <div className="text-center mt-8">Loading course...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">Error: {error}</div>;
  if (!course) return null;

  const handleEnroll = async () => {
    if (isEnrolled) {
      setEnrollError("You are already enrolled in this course.");
      return;
    }
    setEnrollError(null);
    setEnrollLoading(true);
    try {
      const res = await enrollCourse(courseId!);
      alert(res.message);
      
      // Refresh course data to get updated enrollment status
      const updatedCourse = await getCourseById(courseId!);
      setCourse(updatedCourse);
      setIsEnrolled(updatedCourse.enrolled === true);
    } catch (err: any) {
      setEnrollError(err.message);
    } finally {
      setEnrollLoading(false);
    }
  };

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
        <aside className="hidden w-[250px] flex-col border-r md:flex">
          <div className="flex h-14 items-center border-b px-4 font-medium">Student Dashboard</div>
          <nav className="grid gap-1 p-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              My Courses
            </Link>
            <Link
              href="/dashboard/browse"
              className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium"
            >
              <Search className="h-4 w-4" />
              Browse Courses
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="aspect-video w-full rounded-lg object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{course.category}</span>
                  </div>
                  <h1 className="mt-1 text-2xl font-bold">{course.title}</h1>
                  <p className="text-muted-foreground">{course.description}</p>
                  {course.longDescription && <p className="mt-2 text-sm">{course.longDescription}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={`h-4 w-4 ${i < Math.floor(course.rating ?? 0) ? "opacity-100" : "opacity-30"}`}
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                    </div>
                    <span className="text-sm font-medium">{course.rating ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{course.students ?? 0} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{course.duration}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created by {course.instructor?.name}</p>
                  <p className="text-sm text-muted-foreground">Category: {course.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* <span className="text-2xl font-bold">{course.price === 0 ? 'Free' : `$${course.price}`}</span> */}
                  {/* Explicitly check enrollment status */}
                  {course.enrolled || isEnrolled ? (
                    <>
                      <Button
                        className="flex-1"
                        size="lg"
                        disabled={true}
                      >
                        Enrolled
                      </Button>
                      <Button className="flex-1" size="lg" variant="outline" asChild>
                        <Link href={`/dashboard/course/${courseId}`}>Go to Course</Link>
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={handleEnroll}
                      disabled={enrollLoading}
                    >
                      {enrollLoading ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  )}
                  {enrollError && <p className="text-sm text-red-500 mt-2">{enrollError}</p>}
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>What You Will Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  {(course.objectives || []).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {isEnrolled && course.nextLesson?.id && (
              <Card>
                <CardHeader>
                  <CardTitle>Next Lesson</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <Link href={`/dashboard/course-details/${courseId}/lesson/${course.nextLesson.id}`}>{course.nextLesson.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Course Modules</CardTitle>
                <CardDescription>
                  {course.modules?.length ?? 0} modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules?.map(module => (
                    <div key={module.id}>
                      <h3 className="text-lg font-medium">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">{module.description} ({module.duration})</p>
                      <ul className="ml-4 list-disc">
                        {module.lessons.map(lesson => (
                          <li key={lesson.id} className="flex justify-between">
                            <span>{lesson.title}</span>
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
