"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Download,
  FileText,
  Hand,
  MessageSquare,
  Mic,
  MicOff,
  MoreVertical,
  Share2,
  Video,
  VideoOff,
} from "lucide-react";

// Mock session data
const sessionData = {
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
  participants: [
    {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "student",
    },
    {
      id: "user-2",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "student",
    },
    {
      id: "user-3",
      name: "Dr. Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "tutor",
    },
    {
      id: "user-4",
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "student",
    },
    {
      id: "user-5",
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "student",
    },
  ],
  resources: [
    {
      id: "resource-1",
      title: "Newton's Laws Slides",
      type: "pdf",
      size: "2.5 MB",
    },
    {
      id: "resource-2",
      title: "Practice Problems",
      type: "pdf",
      size: "1.2 MB",
    },
    {
      id: "resource-3",
      title: "Simulation Demo",
      type: "html",
      size: "4.8 MB",
    },
  ],
  chat: [
    {
      id: "msg-1",
      user: {
        name: "Dr. Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "tutor",
      },
      message: "Welcome everyone to our session on Newton's Laws of Motion!",
      time: "09:00 AM",
    },
    {
      id: "msg-2",
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "student",
      },
      message: "Looking forward to learning about this topic.",
      time: "09:01 AM",
    },
    {
      id: "msg-3",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "student",
      },
      message: "Will we be covering all three laws today?",
      time: "09:02 AM",
    },
    {
      id: "msg-4",
      user: {
        name: "Dr. Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "tutor",
      },
      message:
        "Yes, we'll cover all three laws and their applications. I've shared some slides and practice problems in the resources tab.",
      time: "09:03 AM",
    },
  ],
};

export function LiveSession({ sessionId }: { sessionId: string }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [message, setMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real app, this would send the message to the server
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/live-classes">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to classes</span>
            </Link>
          </Button>
          <div className="ml-2">
            <h1 className="text-lg font-medium">{sessionData.title}</h1>
            <p className="text-sm text-muted-foreground">
              {sessionData.course}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-red-500 hover:bg-red-600">Live</Badge>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="grid h-full grid-rows-[1fr_auto]">
            {/* Video Area */}
            <div className="relative bg-black p-4">
              <div className="mx-auto aspect-video max-h-[calc(100vh-16rem)] overflow-hidden rounded-lg bg-muted">
                {/* This would be replaced with actual video component in a real app */}
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="mx-auto h-12 w-12 opacity-50" />
                    <p className="mt-2">Video stream would appear here</p>
                  </div>
                </div>
              </div>

              {/* Participant Videos */}
              <div className="absolute bottom-8 right-8 flex space-x-2">
                {sessionData.participants.slice(0, 4).map((participant) => (
                  <div
                    key={participant.id}
                    className="h-24 w-32 overflow-hidden rounded-lg bg-gray-800"
                  >
                    <div className="flex h-full items-center justify-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={participant.avatar}
                          alt={participant.name}
                        />
                        <AvatarFallback>
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between border-t bg-background p-4">
              <div className="flex space-x-2">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant={isVideoOff ? "destructive" : "outline"}
                  size="icon"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                >
                  {isVideoOff ? (
                    <VideoOff className="h-5 w-5" />
                  ) : (
                    <Video className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant={isHandRaised ? "default" : "outline"}
                  size="icon"
                  onClick={() => setIsHandRaised(!isHandRaised)}
                >
                  <Hand className="h-5 w-5" />
                </Button>
              </div>

              <div>
                <Button variant="destructive">Leave Session</Button>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="hidden w-80 border-l md:block">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="participants">People</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent
              value="chat"
              className="flex h-[calc(100%-40px)] flex-col"
            >
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {sessionData.chat.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-2">
                      <Avatar className="mt-1 h-8 w-8">
                        <AvatarImage
                          src={msg.user.avatar}
                          alt={msg.user.name}
                        />
                        <AvatarFallback>
                          {msg.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">{msg.user.name}</span>
                          {msg.user.role === "tutor" && (
                            <Badge className="ml-2" variant="outline">
                              Tutor
                            </Badge>
                          )}
                          <span className="ml-auto text-xs text-muted-foreground">
                            {msg.time}
                          </span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent
              value="participants"
              className="h-[calc(100%-40px)] overflow-y-auto p-4"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-medium">Tutor</h3>
                  <div className="space-y-2">
                    {sessionData.participants
                      .filter((p) => p.role === "tutor")
                      .map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={participant.avatar}
                                alt={participant.name}
                              />
                              <AvatarFallback>
                                {participant.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{participant.name}</span>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 font-medium">
                    Students (
                    {
                      sessionData.participants.filter(
                        (p) => p.role === "student"
                      ).length
                    }
                    )
                  </h3>
                  <div className="space-y-2">
                    {sessionData.participants
                      .filter((p) => p.role === "student")
                      .map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={participant.avatar}
                                alt={participant.name}
                              />
                              <AvatarFallback>
                                {participant.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{participant.name}</span>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="resources"
              className="h-[calc(100%-40px)] overflow-y-auto p-4"
            >
              <div className="space-y-4">
                <h3 className="font-medium">Session Resources</h3>
                <p className="text-sm text-muted-foreground">
                  Download these resources to follow along with the session.
                </p>

                <div className="space-y-2">
                  {sessionData.resources.map((resource) => (
                    <Card key={resource.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {resource.type.toUpperCase()} • {resource.size}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
}
