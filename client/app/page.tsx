import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ChevronRight,
  GraduationCap,
  Users,
  Video,
  Calendar,
  Award,
  BookOpen,
  Star,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navigation */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold">Student Tutor App</span>
            </Link>
          </div>
          <nav className="hidden space-x-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              How It Works
            </Link>
            {/* <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Testimonials
            </Link> */}
            {/* <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Pricing
            </Link> */}
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Log in
            </Link>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
          <div className="container px-4 sm:px-6">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <Badge className="mb-4 rounded-md px-3 py-1">
                    Learning Made Simple
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Connect, Learn, and Grow Together
                  </h1>
                  <p className="mt-6 text-xl text-muted-foreground">
                    The all-in-one platform that connects students with expert
                    tutors for personalized learning experiences.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Get Started
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#how-it-works">Learn More</Link>
                  </Button>
                </div>
                {/* <div className="flex items-center space-x-4 text-sm">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="inline-block h-8 w-8 overflow-hidden rounded-full border-2 border-background"
                      >
                        <Image
                          src="https://plus.unsplash.com/premium_photo-1714618897426-b0578c60affe?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          alt="User"
                          width={32}
                          height={32}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-muted-foreground">
                    Trusted by{" "}
                    <span className="font-medium text-foreground">10,000+</span>{" "}
                    students worldwide
                  </div>
                </div> */}
              </div>
              <div className="relative flex items-center justify-center">
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-xl md:h-[500px]">
                  <Image
                    src="https://plus.unsplash.com/premium_photo-1714618897426-b0578c60affe?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Student Tutor App Dashboard"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge className="mb-4">Features</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to succeed
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our platform provides all the tools needed for effective
                learning and teaching.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-0 shadow-md transition-all hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-muted/30 py-20">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge className="mb-4">How It Works</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple steps to start learning
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Getting started with Student Tutor App is easy and
                straightforward.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <h3 className="mt-6 text-xl font-medium">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* <section id="testimonials" className="py-20">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge className="mb-4">Testimonials</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What our users say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Don't just take our word for it. Here's what students and tutors
                have to say.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 overflow-hidden rounded-full">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {testimonial.name}
                        </CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{testimonial.quote}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section> */}

        {/* Pricing Section */}
        {/* <section id="pricing" className="bg-muted/30 py-20">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge className="mb-4">Pricing</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that works best for your learning needs.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.title}
                  className={`border-0 shadow-md ${
                    plan.featured ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardHeader>
                    {plan.featured && (
                      <Badge className="mb-2 w-fit">Most Popular</Badge>
                    )}
                    <CardTitle>{plan.title}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground"> /month</span>
                    </div>
                    <CardDescription className="mt-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-6 w-full"
                      variant={plan.featured ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section> */}

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge className="mb-4">FAQ</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Find answers to common questions about our platform.
              </p>
            </div>

            <div className="mt-16 mx-auto max-w-3xl space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.question} className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to transform your learning journey?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Join thousands of students and tutors on our platform and start
                learning today.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6" />
                <span className="font-bold">Student Tutor App</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Connecting students with expert tutors for personalized learning
                experiences.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    For Students
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    For Tutors
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Student Tutor App. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Features data
const features = [
  {
    title: "Expert Tutors",
    description:
      "Learn from qualified tutors with expertise in various subjects and teaching methods.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Flexible Scheduling",
    description:
      "Book sessions that fit your schedule, with 24/7 availability across time zones.",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    title: "Comprehensive Courses",
    description:
      "Access structured courses with curated learning materials and resources.",
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with detailed progress reports and analytics.",
    icon: <CheckCircle className="h-6 w-6" />,
  },
  {
    title: "Certifications",
    description:
      "Earn certificates upon course completion to showcase your new skills.",
    icon: <Award className="h-6 w-6" />,
  },
];

// How it works steps
const steps = [
  {
    title: "Create an account",
    description:
      "Sign up as a student or tutor and complete your profile with your learning goals or teaching expertise.",
  },
  {
    title: "Find your match",
    description:
      "Browse tutors by subject, rating, and availability or wait for students to discover your profile.",
  },
  {
    title: "Start learning",
    description:
      "Schedule sessions, join live classes, and track your progress as you advance through your courses.",
  },
];

// Testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Math Student",
    avatar: "/placeholder.svg?height=48&width=48&text=SJ",
    quote:
      "The Student Tutor App transformed my relationship with mathematics. My tutor's personalized approach helped me overcome my fear of calculus and excel in my exams.",
  },
  {
    name: "David Chen",
    role: "Science Tutor",
    avatar: "/placeholder.svg?height=48&width=48&text=DC",
    quote:
      "As a tutor, this platform has given me the tools to deliver engaging lessons and track my students' progress effectively. The interactive features make teaching a joy.",
  },
  {
    name: "Emily Rodriguez",
    role: "Language Student",
    avatar: "/placeholder.svg?height=48&width=48&text=ER",
    quote:
      "Learning Spanish has never been easier! The live classes and practice exercises have helped me become conversational in just three months.",
  },
];

// Pricing plans
const pricingPlans = [
  {
    title: "Basic",
    price: 9.99,
    description: "Perfect for occasional learning needs",
    features: [
      "Access to 10 live classes per month",
      "Basic progress tracking",
      "Email support",
      "1 subject area",
    ],
    featured: false,
  },
  {
    title: "Pro",
    price: 19.99,
    description: "Ideal for dedicated students",
    features: [
      "Unlimited live classes",
      "Advanced progress tracking",
      "Priority support",
      "3 subject areas",
      "Downloadable resources",
    ],
    featured: true,
  },
  {
    title: "Premium",
    price: 39.99,
    description: "For serious academic achievement",
    features: [
      "Everything in Pro",
      "1-on-1 tutoring sessions",
      "Personalized study plan",
      "All subject areas",
      "Certification on completion",
      "24/7 support",
    ],
    featured: false,
  },
];

// FAQs
const faqs = [
  {
    question: "How do I get started with Student Tutor App?",
    answer:
      "Simply create an account, complete your profile, and you can start browsing tutors or courses immediately. You can book your first session in minutes!",
  },
  {
    question: "What subjects are available on the platform?",
    answer:
      "We offer a wide range of subjects including Mathematics, Science, Languages, Humanities, Computer Science, and more. Our tutors specialize in various academic levels from elementary to university.",
  },
  {
    question: "How are the tutors vetted?",
    answer:
      "All tutors undergo a rigorous verification process including credential checks, subject knowledge assessments, and teaching ability evaluations. We also maintain a rating system based on student feedback.",
  },
  {
    question: "Can I change my subscription plan?",
    answer:
      "Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes will take effect at the start of your next billing cycle.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Yes, we offer mobile apps for both iOS and Android devices, allowing you to learn on the go. All features available on the web platform are also accessible via our mobile apps.",
  },
];
