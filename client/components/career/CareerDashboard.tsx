"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  MapPin,
  Newspaper,
  ScrollText,
  Star,
  Users,
} from "lucide-react";

// Mock data for job opportunities
const jobOpportunities = [
  {
    id: "1",
    title: "Junior Software Developer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA (Remote)",
    type: "Full-time",
    salary: "$70,000 - $90,000",
    posted: "2 days ago",
    deadline: "2025-04-15",
    skills: ["JavaScript", "React", "Node.js"],
    featured: true,
  },
  {
    id: "2",
    title: "Data Analyst Intern",
    company: "Analytics Pro",
    location: "New York, NY (On-site)",
    type: "Internship",
    salary: "$25/hour",
    posted: "1 week ago",
    deadline: "2025-03-30",
    skills: ["SQL", "Python", "Excel"],
    featured: false,
  },
  {
    id: "3",
    title: "UX/UI Designer",
    company: "Creative Designs Inc.",
    location: "Austin, TX (Hybrid)",
    type: "Contract",
    salary: "$50/hour",
    posted: "3 days ago",
    deadline: "2025-04-10",
    skills: ["Figma", "Adobe XD", "Sketch"],
    featured: true,
  },
];

// Mock data for scholarships
const scholarships = [
  {
    id: "1",
    title: "STEM Excellence Scholarship",
    organization: "National Science Foundation",
    amount: "$10,000",
    deadline: "2025-05-01",
    eligibility: "Undergraduate students in STEM fields",
    featured: true,
  },
  {
    id: "2",
    title: "Future Leaders Grant",
    organization: "Leadership Academy",
    amount: "$5,000",
    deadline: "2025-04-15",
    eligibility: "Students with leadership experience",
    featured: false,
  },
  {
    id: "3",
    title: "Creative Arts Scholarship",
    organization: "Arts Council",
    amount: "$7,500",
    deadline: "2025-04-30",
    eligibility: "Students in visual or performing arts",
    featured: false,
  },
];

// Mock data for career resources
const careerResources = [
  {
    id: "1",
    title: "Resume Writing Workshop",
    type: "Workshop",
    date: "March 25, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Online",
    description:
      "Learn how to craft a compelling resume that stands out to employers.",
  },
  {
    id: "2",
    title: "Interview Preparation Guide",
    type: "Guide",
    description:
      "Comprehensive guide to acing your job interviews with practice questions and tips.",
  },
  {
    id: "3",
    title: "Networking for Career Success",
    type: "Webinar",
    date: "April 5, 2025",
    time: "1:00 PM - 2:30 PM",
    location: "Online",
    description:
      "Strategies for building and leveraging your professional network.",
  },
  {
    id: "4",
    title: "Career Fair",
    type: "Event",
    date: "April 12, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Main Campus, Building A",
    description:
      "Meet with recruiters from top companies across various industries.",
  },
];

export function CareerDashboard() {
  const [activeTab, setActiveTab] = useState("opportunities");

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="opportunities"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="profile">Career Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Job Opportunities
                </CardTitle>
                <CardDescription>
                  Explore job and internship opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  {jobOpportunities.slice(0, 2).map((job) => (
                    <div key={job.id} className="rounded-lg border p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {job.company}
                          </p>
                        </div>
                        {job.featured && (
                          <Badge className="bg-yellow-500">
                            <Star className="mr-1 h-3 w-3" /> Featured
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="mr-1 h-3 w-3" /> {job.location}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="mr-1 h-3 w-3" /> {job.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/career/opportunities">
                    View All Opportunities
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Scholarships
                </CardTitle>
                <CardDescription>
                  Find scholarships and financial aid
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  {scholarships.slice(0, 2).map((scholarship) => (
                    <div key={scholarship.id} className="rounded-lg border p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{scholarship.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {scholarship.organization}
                          </p>
                        </div>
                        {scholarship.featured && (
                          <Badge className="bg-yellow-500">
                            <Star className="mr-1 h-3 w-3" /> Featured
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {scholarship.amount}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="mr-1 h-3 w-3" /> Deadline:{" "}
                          {new Date(scholarship.deadline).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/career/scholarships">
                    View All Scholarships
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <ScrollText className="mr-2 h-5 w-5" />
                  Resume Builder
                </CardTitle>
                <CardDescription>
                  Create and manage your professional resume
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 font-medium">Create Your Resume</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Build a professional resume with our easy-to-use templates
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/career/resume-builder">
                    Build Your Resume
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Featured Opportunities</CardTitle>
              <CardDescription>
                Top opportunities matching your profile and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobOpportunities
                  .filter((job) => job.featured)
                  .map((job) => (
                    <div key={job.id} className="rounded-lg border p-4">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{job.title}</h3>
                            <Badge className="ml-2 bg-yellow-500">
                              <Star className="mr-1 h-3 w-3" /> Featured
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-muted-foreground">
                            <Building2 className="mr-1 h-4 w-4" />
                            {job.company}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">
                            <MapPin className="mr-1 h-3 w-3" /> {job.location}
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" /> {job.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {job.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-primary/10"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">{job.salary}</span>
                          <span className="mx-2">•</span>
                          <span>Posted {job.posted}</span>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/career/opportunities/${job.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/career/opportunities">
                  View All Opportunities
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>
                  Career workshops, webinars, and networking events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {careerResources
                    .filter(
                      (resource) =>
                        resource.type === "Workshop" ||
                        resource.type === "Webinar" ||
                        resource.type === "Event"
                    )
                    .map((resource) => (
                      <div key={resource.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{resource.title}</h3>
                            <Badge variant="outline" className="mt-1">
                              {resource.type}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            Register
                          </Button>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {resource.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {resource.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {resource.location}
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{resource.description}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Newspaper className="mr-2 h-5 w-5" />
                  Career Resources
                </CardTitle>
                <CardDescription>
                  Guides, articles, and tools for career development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {careerResources
                    .filter((resource) => resource.type === "Guide")
                    .map((resource) => (
                      <div key={resource.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{resource.title}</h3>
                            <Badge variant="outline" className="mt-1">
                              {resource.type}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="#">View</Link>
                          </Button>
                        </div>
                        <p className="mt-2 text-sm">{resource.description}</p>
                      </div>
                    ))}

                  <div className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">Career Assessment Tool</h3>
                        <Badge variant="outline" className="mt-1">
                          Tool
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="#">Start</Link>
                      </Button>
                    </div>
                    <p className="mt-2 text-sm">
                      Discover career paths that match your skills, interests,
                      and values with our comprehensive assessment tool.
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">Industry Insights</h3>
                        <Badge variant="outline" className="mt-1">
                          Articles
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="#">Browse</Link>
                      </Button>
                    </div>
                    <p className="mt-2 text-sm">
                      Stay updated with the latest trends, insights, and
                      opportunities across various industries.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Career Mentorship
              </CardTitle>
              <CardDescription>
                Connect with industry professionals and mentors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-20 w-20 overflow-hidden rounded-full">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt="Mentor"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="mt-4 font-medium">Dr. Emily Chen</h3>
                    <p className="text-sm text-muted-foreground">
                      Senior Data Scientist at TechCorp
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      <Badge variant="secondary" className="bg-primary/10">
                        Data Science
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10">
                        AI
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10">
                        Machine Learning
                      </Badge>
                    </div>
                    <Button className="mt-4" size="sm">
                      Request Mentorship
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-20 w-20 overflow-hidden rounded-full">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt="Mentor"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="mt-4 font-medium">James Wilson</h3>
                    <p className="text-sm text-muted-foreground">
                      Product Manager at InnovateTech
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      <Badge variant="secondary" className="bg-primary/10">
                        Product Management
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10">
                        UX
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10">
                        Strategy
                      </Badge>
                    </div>
                    <Button className="mt-4" size="sm">
                      Request Mentorship
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-20 w-20 overflow-hidden rounded-full">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt="Mentor"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="mt-4 font-medium">Sarah Johnson</h3>
                    <p className="text-sm text-muted-foreground">
                      Marketing Director at GlobalBrands
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      <Badge variant="secondary" className="bg-primary/10">
                        Marketing
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10">
                        Branding
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10">
                        Digital Strategy
                      </Badge>
                    </div>
                    <Button className="mt-4" size="sm">
                      Request Mentorship
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Mentors
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Career Profile</CardTitle>
              <CardDescription>
                Manage your career profile and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                  <div className="h-24 w-24 overflow-hidden rounded-full">
                    <img
                      src="/placeholder.svg?height=96&width=96"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold">Alex Johnson</h3>
                    <p className="text-muted-foreground">
                      Computer Science Student
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center gap-1 sm:justify-start">
                      <Badge variant="secondary" className="bg-primary/10">
                        Software Development
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10">
                        Web Design
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10">
                        UI/UX
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" variant="outline">
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Career Interests</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Software Development</span>
                      <Badge>High Interest</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Data Science</span>
                      <Badge>Medium Interest</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Product Management</span>
                      <Badge>Medium Interest</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>UX/UI Design</span>
                      <Badge>High Interest</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="mt-2">
                    Update Interests
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="secondary">JavaScript</Badge>
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">HTML/CSS</Badge>
                    <Badge variant="secondary">Python</Badge>
                    <Badge variant="secondary">UI Design</Badge>
                    <Badge variant="secondary">Git</Badge>
                    <Badge variant="secondary">Figma</Badge>
                  </div>
                  <Button size="sm" variant="ghost" className="mt-2">
                    Update Skills
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Job Preferences</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Job Type</span>
                      <div className="flex gap-1">
                        <Badge variant="outline">Full-time</Badge>
                        <Badge variant="outline">Internship</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Location</span>
                      <div className="flex gap-1">
                        <Badge variant="outline">Remote</Badge>
                        <Badge variant="outline">San Francisco</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Salary Range</span>
                      <Badge variant="outline">$70,000 - $100,000</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="mt-2">
                    Update Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Application Tracker</CardTitle>
                <CardDescription>
                  Track your job and scholarship applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">
                          Junior Developer at TechCorp
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Applied on March 10, 2025
                        </p>
                      </div>
                      <Badge>In Review</Badge>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">
                          UX Design Intern at CreativeCo
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Applied on March 5, 2025
                        </p>
                      </div>
                      <Badge className="bg-green-500">Interview</Badge>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">
                          STEM Excellence Scholarship
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Applied on February 28, 2025
                        </p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Applications
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>
                  Personalized recommendations based on your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium">Frontend Developer Workshop</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced React techniques for modern web applications
                    </p>
                    <Button size="sm" variant="ghost" className="mt-2">
                      Learn More
                    </Button>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium">Web Developer at StartupX</h3>
                    <p className="text-sm text-muted-foreground">
                      Job opportunity matching your skills and interests
                    </p>
                    <Button size="sm" variant="ghost" className="mt-2">
                      View Job
                    </Button>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium">Tech Innovation Scholarship</h3>
                    <p className="text-sm text-muted-foreground">
                      $8,000 scholarship for students in computer science
                    </p>
                    <Button size="sm" variant="ghost" className="mt-2">
                      View Scholarship
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
