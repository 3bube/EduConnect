"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Search, Star, Users } from "lucide-react";

// Mock data
const courses = [
  {
    id: "course-1",
    title: "Introduction to Mathematics",
    description:
      "Learn the fundamentals of mathematics including algebra, geometry, and calculus.",
    category: "Mathematics",
    level: "Beginner",
    duration: "10 weeks",
    rating: 4.8,
    students: 1245,
    instructor: "Dr. Smith",
    price: 49.99,
    image: "/placeholder.svg?height=180&width=320",
    featured: true,
    tags: ["algebra", "geometry", "calculus"],
  },
  {
    id: "course-2",
    title: "Advanced English Literature",
    description:
      "Explore classic and contemporary literature with in-depth analysis and critical thinking.",
    category: "Language",
    level: "Advanced",
    duration: "12 weeks",
    rating: 4.7,
    students: 876,
    instructor: "Prof. Johnson",
    price: 59.99,
    image: "/placeholder.svg?height=180&width=320",
    featured: false,
    tags: ["shakespeare", "poetry", "novels"],
  },
  {
    id: "course-3",
    title: "Physics 101",
    description:
      "Understand the basic principles of physics and how they apply to the world around us.",
    category: "Science",
    level: "Beginner",
    duration: "8 weeks",
    rating: 4.9,
    students: 1532,
    instructor: "Dr. Brown",
    price: 54.99,
    image: "/placeholder.svg?height=180&width=320",
    featured: true,
    tags: ["mechanics", "thermodynamics", "waves"],
  },
  {
    id: "course-4",
    title: "Introduction to Computer Science",
    description:
      "Learn programming fundamentals, algorithms, and data structures.",
    category: "Technology",
    level: "Beginner",
    duration: "14 weeks",
    rating: 4.9,
    students: 2389,
    instructor: "Prof. Davis",
    price: 69.99,
    image: "/placeholder.svg?height=180&width=320",
    featured: true,
    tags: ["programming", "algorithms", "data structures"],
  },
  {
    id: "course-5",
    title: "World History: Ancient Civilizations",
    description:
      "Explore the rise and fall of ancient civilizations and their impact on modern society.",
    category: "History",
    level: "Intermediate",
    duration: "10 weeks",
    rating: 4.6,
    students: 987,
    instructor: "Dr. Wilson",
    price: 49.99,
    image: "/placeholder.svg?height=180&width=320",
    featured: false,
    tags: ["ancient egypt", "mesopotamia", "greece", "rome"],
  },
  {
    id: "course-6",
    title: "Chemistry Basics",
    description:
      "Learn about atoms, molecules, reactions, and the fundamentals of chemistry.",
    category: "Science",
    level: "Beginner",
    duration: "8 weeks",
    rating: 4.7,
    students: 1123,
    instructor: "Prof. Martinez",
    price: 54.99,
    image: "/placeholder.svg?height=180&width=320",
    featured: false,
    tags: ["atoms", "periodic table", "reactions"],
  },
  {
    id: "course-7",
    title: "Business Management Fundamentals",
    description:
      "Develop essential skills for managing businesses and organizations effectively.",
    category: "Business",
    level: "Intermediate",
    duration: "12 weeks",
    rating: 4.5,
    students: 1567,
    instructor: "Dr. Thompson",
    price: 64.99,
    image: "/placeholder.svg?height=180&width=320",
    featured: true,
    tags: ["management", "leadership", "strategy"],
  },
  {
    id: "course-8",
    title: "Digital Marketing Essentials",
    description:
      "Master the tools and techniques for effective digital marketing campaigns.",
    category: "Marketing",
    level: "Beginner",
    duration: "6 weeks",
    rating: 4.8,
    students: 2134,
    instructor: "Prof. Garcia",
    price: 59.99,
    image: "/placeholder.svg?height=180&width=320",
    featured: false,
    tags: ["social media", "SEO", "content marketing"],
  },
];

const categories = [
  "All Categories",
  "Mathematics",
  "Language",
  "Science",
  "Technology",
  "History",
  "Business",
  "Marketing",
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export function CourseCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("popularity");

  // Filter courses based on search query, category, and level
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All Categories" ||
      course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "All Levels" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Sort courses based on selected sort option
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "popularity") return b.students - a.students;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  // Get featured courses
  const featuredCourses = courses.filter((course) => course.featured);

  return (
    <div className="container px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Course Catalog</h1>
        <p className="text-muted-foreground">
          Browse our wide range of courses and find the perfect one for your
          learning journey.
        </p>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="popular">Most Popular</TabsTrigger>
          <TabsTrigger value="new">Newly Added</TabsTrigger>
        </TabsList>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {sortedCourses.length === 0 && (
            <div className="mt-8 text-center">
              <h3 className="text-lg font-medium">No courses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...courses]
              .sort((a, b) => b.students - a.students)
              .slice(0, 8)
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...courses]
              .sort(() => 0.5 - Math.random())
              .slice(0, 4)
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full">
        <Image
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          width={320}
          height={180}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2">
              {course.category}
            </Badge>
            <CardTitle className="line-clamp-1 text-lg">
              {course.title}
            </CardTitle>
          </div>
          {course.featured && <Badge variant="secondary">Featured</Badge>}
        </div>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="mr-1 h-4 w-4" />
            {course.students} students
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {course.duration}
          </div>
          <div className="flex items-center">
            <Badge variant="outline">{course.level}</Badge>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${course.price}</span>
          <Button asChild>
            <Link href={`/courses/${course.id}`}>View Course</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
