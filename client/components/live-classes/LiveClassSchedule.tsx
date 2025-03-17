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
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  Clock,
  Filter,
  Play,
  Search,
  Users,
  Video,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data
const liveClasses = [
  {
    id: "class-1",
    title: "Algebra Fundamentals",
    course: "Introduction to Mathematics",
    description: "Learn the basics of algebraic expressions and equations",
    startTime: "2023-09-14T10:00:00",
    endTime: "2023-09-14T11:30:00",
    tutor: {
      name: "Dr. Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    participants: 24,
    maxParticipants: 30,
    status: "upcoming", // upcoming, live, completed
    category: "Mathematics",
  },
  {
    id: "class-2",
    title: "Shakespeare's Sonnets Analysis",
    course: "Advanced English Literature",
    description: "Explore the themes and structure of Shakespeare's sonnets",
    startTime: "2023-09-15T14:00:00",
    endTime: "2023-09-15T15:30:00",
    tutor: {
      name: "Prof. Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    participants: 18,
    maxParticipants: 25,
    status: "upcoming",
    category: "Literature",
  },
  {
    id: "class-3",
    title: "Newton's Laws of Motion",
    course: "Physics 101",
    description: "Understanding the fundamental laws that govern motion",
    startTime: "2023-09-13T09:00:00",
    endTime: "2023-09-13T10:30:00",
    tutor: {
      name: "Dr. Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    participants: 28,
    maxParticipants: 30,
    status: "live",
    category: "Physics",
  },
  {
    id: "class-4",
    title: "Introduction to Programming",
    course: "Computer Science Basics",
    description: "Learn the fundamentals of programming and algorithms",
    startTime: "2023-09-12T13:00:00",
    endTime: "2023-09-12T14:30:00",
    tutor: {
      name: "Prof. Davis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    participants: 22,
    maxParticipants: 25,
    status: "completed",
    recording: "https://example.com/recording-1",
    category: "Computer Science",
  },
  {
    id: "class-5",
    title: "Ancient Egyptian Civilization",
    course: "World History",
    description:
      "Explore the culture, achievements, and legacy of Ancient Egypt",
    startTime: "2023-09-11T11:00:00",
    endTime: "2023-09-11T12:30:00",
    tutor: {
      name: "Dr. Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    participants: 20,
    maxParticipants: 30,
    status: "completed",
    recording: "https://example.com/recording-2",
    category: "History",
  },
];

const categories = [
  "All Categories",
  "Mathematics",
  "Literature",
  "Physics",
  "Computer Science",
  "History",
];

export function LiveClassSchedule() {
  const [view, setView] = useState("calendar");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter classes based on search query and category
  const filteredClasses = liveClasses.filter((classItem) => {
    const matchesSearch =
      classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      classItem.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Filter classes for the selected date
  const classesForSelectedDate = filteredClasses.filter((classItem) => {
    if (!date) return false;

    const classDate = new Date(classItem.startTime);
    return (
      classDate.getDate() === date.getDate() &&
      classDate.getMonth() === date.getMonth() &&
      classDate.getFullYear() === date.getFullYear()
    );
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleTimeString("en-US", options);
  };

  // Calculate duration in minutes
  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    return Math.round(durationMs / (1000 * 60));
  };

  return (
    <div className="container px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Live Classes & Webinars
        </h1>
        <p className="text-muted-foreground">
          Join interactive live sessions with expert tutors or watch recordings
          of past classes.
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="mb-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="live">Live Now</TabsTrigger>
            <TabsTrigger value="recordings">Recordings</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              variant={view === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("calendar")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("list")}
            >
              <Filter className="mr-2 h-4 w-4" />
              List
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
        </div>

        <div
          className={`mt-6 grid gap-6 ${
            view === "calendar" ? "lg:grid-cols-[300px_1fr]" : ""
          }`}
        >
          {view === "calendar" && (
            <div className="rounded-lg border p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="mx-auto"
              />
            </div>
          )}

          <div className="space-y-6">
            <TabsContent value="upcoming">
              {view === "calendar" ? (
                <div>
                  <h3 className="mb-4 text-lg font-medium">
                    Classes on{" "}
                    {date?.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>

                  {classesForSelectedDate.length > 0 ? (
                    <div className="space-y-4">
                      {classesForSelectedDate
                        .filter((classItem) => classItem.status === "upcoming")
                        .sort(
                          (a, b) =>
                            new Date(a.startTime).getTime() -
                            new Date(b.startTime).getTime()
                        )
                        .map((classItem) => (
                          <ClassCard
                            key={classItem.id}
                            classItem={classItem}
                            getDuration={getDuration}
                            formatDate={formatDate}
                            formatTime={formatTime}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border p-8 text-center">
                      <p className="text-muted-foreground">
                        No classes scheduled for this date.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredClasses
                    .filter((classItem) => classItem.status === "upcoming")
                    .sort(
                      (a, b) =>
                        new Date(a.startTime).getTime() -
                        new Date(b.startTime).getTime()
                    )
                    .map((classItem) => (
                      <ClassCard
                        key={classItem.id}
                        classItem={classItem}
                        getDuration={getDuration}
                        formatDate={formatDate}
                        formatTime={formatTime}
                      />
                    ))}

                  {filteredClasses.filter(
                    (classItem) => classItem.status === "upcoming"
                  ).length === 0 && (
                    <div className="rounded-lg border p-8 text-center">
                      <p className="text-muted-foreground">
                        No upcoming classes found.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="live">
              <div className="space-y-4">
                {filteredClasses
                  .filter((classItem) => classItem.status === "live")
                  .map((classItem) => (
                    <ClassCard
                      key={classItem.id}
                      classItem={classItem}
                      getDuration={getDuration}
                      formatDate={formatDate}
                      formatTime={formatTime}
                    />
                  ))}

                {filteredClasses.filter(
                  (classItem) => classItem.status === "live"
                ).length === 0 && (
                  <div className="rounded-lg border p-8 text-center">
                    <p className="text-muted-foreground">
                      No live classes at the moment.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recordings">
              <div className="space-y-4">
                {filteredClasses
                  .filter(
                    (classItem) =>
                      classItem.status === "completed" && classItem.recording
                  )
                  .map((classItem) => (
                    <ClassCard
                      key={classItem.id}
                      classItem={classItem}
                      getDuration={getDuration}
                      formatDate={formatDate}
                      formatTime={formatTime}
                    />
                  ))}

                {filteredClasses.filter(
                  (classItem) =>
                    classItem.status === "completed" && classItem.recording
                ).length === 0 && (
                  <div className="rounded-lg border p-8 text-center">
                    <p className="text-muted-foreground">
                      No recordings found.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function ClassCard({
  classItem,
  getDuration,
  formatDate,
  formatTime,
}: {
  classItem: any;
  getDuration: any;
  formatDate: any;
  formatTime: any;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{classItem.title}</CardTitle>
            <CardDescription>{classItem.course}</CardDescription>
          </div>
          {classItem.status === "live" ? (
            <Badge className="bg-red-500 hover:bg-red-600">Live Now</Badge>
          ) : classItem.status === "upcoming" ? (
            <Badge variant="outline">Upcoming</Badge>
          ) : (
            <Badge variant="outline">Recorded</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="mb-4 text-sm">{classItem.description}</p>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formatDate(classItem.startTime)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {formatTime(classItem.startTime)} -{" "}
              {formatTime(classItem.endTime)} (
              {getDuration(classItem.startTime, classItem.endTime)} min)
            </span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {classItem.participants}/{classItem.maxParticipants} participants
            </span>
          </div>
          <div className="flex items-center">
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={classItem.tutor.avatar}
                alt={classItem.tutor.name}
              />
              <AvatarFallback>{classItem.tutor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{classItem.tutor.name}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {classItem.status === "live" ? (
          <Button asChild className="w-full">
            <Link href={`/live-classes/${classItem.id}`}>
              <Play className="mr-2 h-4 w-4" />
              Join Now
            </Link>
          </Button>
        ) : classItem.status === "upcoming" ? (
          <Button variant="outline" asChild className="w-full">
            <Link href={`/live-classes/${classItem.id}`}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Add to Calendar
            </Link>
          </Button>
        ) : (
          <Button variant="outline" asChild className="w-full">
            <Link href={`/live-classes/recordings/${classItem.id}`}>
              <Video className="mr-2 h-4 w-4" />
              Watch Recording
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function formatTime(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleTimeString("en-US", options);
}
