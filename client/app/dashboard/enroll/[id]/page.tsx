import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, GraduationCap, User } from "lucide-react"

export default function EnrollCoursePage({ params }: { params: { id: string } }) {
  // Mock course data
  const course = {
    id: params.id,
    title: "Web Development Basics",
    tutor: "Sarah Williams",
    rating: 4.8,
    students: 1250,
    price: "Free",
    image: "/placeholder.svg?height=300&width=600",
    category: "Computer Science",
    description:
      "This comprehensive course covers the fundamentals of web development, including HTML, CSS, and JavaScript. You'll learn how to build responsive websites from scratch and understand the core principles of modern web development.",
    features: [
      "Full lifetime access",
      "Access on mobile and desktop",
      "Certificate of completion",
      "30-day money-back guarantee",
      "Direct instructor support",
    ],
  }

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
      <main className="flex-1 p-4 md:p-6">
        <div className="container max-w-4xl space-y-6">
          <div>
            <Link
              href="/student-dashboard/browse"
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              ← Back to Browse Courses
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <img
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                className="aspect-video w-full rounded-lg object-cover"
              />
              <h1 className="mt-4 text-2xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
              <p className="mt-2 text-sm">
                Instructor: <span className="font-medium">{course.tutor}</span>
              </p>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Enroll in this course</CardTitle>
                  <CardDescription>Get started with your learning journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Price:</span>
                    <span className="text-2xl font-bold">{course.price}</span>
                  </div>
                  <div className="space-y-2">
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/student-dashboard/course/${course.id}`}>Enroll Now</Link>
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    By enrolling, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 md:grid-cols-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>HTML5 structure and semantics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>CSS3 styling and responsive design</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>JavaScript fundamentals</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>DOM manipulation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Building interactive web pages</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Web accessibility best practices</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
w