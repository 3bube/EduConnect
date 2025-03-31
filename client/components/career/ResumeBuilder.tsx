"use client";

import { useState, useRef } from "react";
import { usePDF } from "react-to-pdf";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  Check,
  Download,
  Plus,
  Save,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const resumeTemplates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design with a focus on readability",
    preview: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional layout ideal for corporate and formal settings",
    preview: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold design for creative fields and standing out",
    preview: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant design with focus on content",
    preview: "/placeholder.svg?height=200&width=150",
  },
];

const initialResumeData = {
  personalInfo: {
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    website: "alexjohnson.dev",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
  },
  summary:
    "Computer Science student with a passion for web development and UI/UX design. Seeking opportunities to apply my skills in a collaborative environment and contribute to innovative projects.",
  education: [
    {
      id: "edu1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science in Computer Science",
      startDate: "2022-09",
      endDate: "2026-05",
      location: "Berkeley, CA",
      description:
        "GPA: 3.8/4.0. Relevant coursework: Data Structures, Algorithms, Web Development, UI/UX Design, Database Systems.",
    },
  ],
  experience: [
    {
      id: "exp1",
      title: "Web Development Intern",
      company: "TechStart Inc.",
      startDate: "2024-06",
      endDate: "2024-08",
      location: "San Francisco, CA",
      description:
        "Developed and maintained responsive web applications using React and Node.js. Collaborated with the design team to implement UI/UX improvements. Participated in code reviews and agile development processes.",
      current: false,
    },
  ],
  skills: [
    { id: "skill1", name: "JavaScript", level: "advanced" },
    { id: "skill2", name: "React", level: "intermediate" },
    { id: "skill3", name: "HTML/CSS", level: "advanced" },
    { id: "skill4", name: "Node.js", level: "intermediate" },
    { id: "skill5", name: "Python", level: "intermediate" },
    { id: "skill6", name: "UI/UX Design", level: "intermediate" },
    { id: "skill7", name: "Git", level: "intermediate" },
    { id: "skill8", name: "Figma", level: "intermediate" },
  ],
  projects: [
    {
      id: "proj1",
      title: "Personal Portfolio Website",
      description:
        "Designed and developed a responsive personal portfolio website using React, Next.js, and Tailwind CSS.",
      link: "https://alexjohnson.dev",
      technologies: ["React", "Next.js", "Tailwind CSS"],
    },
  ],
  certifications: [
    {
      id: "cert1",
      name: "React Developer Certification",
      issuer: "Frontend Masters",
      date: "2024-02",
      link: "https://frontendmasters.com/cert/123456",
    },
  ],
};

function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function getSectionDefaults(section: string) {
  switch (section) {
    case "education":
      return {
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
      };
    case "experience":
      return {
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
        current: false,
      };
    case "skills":
      return { name: "", level: "beginner" };
    case "projects":
      return { title: "", description: "", link: "", technologies: [] };
    case "certifications":
      return { name: "", issuer: "", date: "", link: "" };
    default:
      return {};
  }
}

function PersonalInfoSection({
  data,
  onChange,
}: {
  data: any;
  onChange: (field: string, value: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Add your contact and personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={data.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => onChange("location", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              value={data.website}
              onChange={(e) => onChange("website", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
            <Input
              id="linkedin"
              value={data.linkedin}
              onChange={(e) => onChange("linkedin", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub (Optional)</Label>
            <Input
              id="github"
              value={data.github}
              onChange={(e) => onChange("github", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummarySection({
  summary,
  onChange,
}: {
  summary: string;
  onChange: (value: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Summary</CardTitle>
        <CardDescription>
          Write a brief summary of your professional background and goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          className="min-h-[100px]"
          value={summary}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Keep your summary concise (2-4 sentences) and focused on your key
          strengths and career objectives.
        </p>
      </CardContent>
    </Card>
  );
}

function DynamicSection({
  title,
  description,
  items,
  onAdd,
  onRemove,
  renderItem,
}: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button onClick={onAdd} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add {title}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-4">
          {items.map((item: any, index: number) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border rounded-lg"
            >
              <AccordionTrigger className="px-4">
                {item.title || item.institution || `${title} ${index + 1}`}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {renderItem(item)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <h3 className="mt-2 font-medium">No {title} Added</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click the "Add {title}" button to add your {title.toLowerCase()}
            </p>
            <Button onClick={onAdd} className="mt-4" size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add {title}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EducationItem({ item, onChange, onRemove }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor={`institution-${item.id}`}>Institution</Label>
        <Input
          id={`institution-${item.id}`}
          value={item.institution}
          onChange={(e) => onChange(item.id, "institution", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`degree-${item.id}`}>Degree</Label>
        <Input
          id={`degree-${item.id}`}
          value={item.degree}
          onChange={(e) => onChange(item.id, "degree", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`startDate-${item.id}`}>Start Date</Label>
        <Input
          id={`startDate-${item.id}`}
          type="month"
          value={item.startDate}
          onChange={(e) => onChange(item.id, "startDate", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`endDate-${item.id}`}>End Date (or Expected)</Label>
        <Input
          id={`endDate-${item.id}`}
          type="month"
          value={item.endDate}
          onChange={(e) => onChange(item.id, "endDate", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`location-${item.id}`}>Location</Label>
        <Input
          id={`location-${item.id}`}
          value={item.location}
          onChange={(e) => onChange(item.id, "location", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <Label htmlFor={`description-${item.id}`}>
          Description (GPA, Achievements, Coursework)
        </Label>
        <Textarea
          id={`description-${item.id}`}
          value={item.description}
          onChange={(e) => onChange(item.id, "description", e.target.value)}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Remove
        </Button>
      </div>
    </div>
  );
}

function ExperienceItem({ item, onChange, onRemove }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor={`title-${item.id}`}>Job Title</Label>
        <Input
          id={`title-${item.id}`}
          value={item.title}
          onChange={(e) => onChange(item.id, "title", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`company-${item.id}`}>Company</Label>
        <Input
          id={`company-${item.id}`}
          value={item.company}
          onChange={(e) => onChange(item.id, "company", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`startDate-${item.id}`}>Start Date</Label>
        <Input
          id={`startDate-${item.id}`}
          type="month"
          value={item.startDate}
          onChange={(e) => onChange(item.id, "startDate", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`endDate-${item.id}`}>End Date</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id={`current-${item.id}`}
              checked={item.current}
              onCheckedChange={(checked) =>
                onChange(item.id, "current", checked)
              }
            />
            <Label htmlFor={`current-${item.id}`} className="text-sm">
              Current Position
            </Label>
          </div>
        </div>
        <Input
          id={`endDate-${item.id}`}
          type="month"
          value={item.endDate}
          onChange={(e) => onChange(item.id, "endDate", e.target.value)}
          disabled={item.current}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`location-${item.id}`}>Location</Label>
        <Input
          id={`location-${item.id}`}
          value={item.location}
          onChange={(e) => onChange(item.id, "location", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <Label htmlFor={`description-${item.id}`}>Description</Label>
        <Textarea
          id={`description-${item.id}`}
          value={item.description}
          onChange={(e) => onChange(item.id, "description", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Describe your responsibilities and achievements. Use bullet points for
          better readability.
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Remove
        </Button>
      </div>
    </div>
  );
}

function SkillsSection({ skills, onAdd, onChange, onRemove }: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Skills</CardTitle>
            <CardDescription>
              Add your technical and soft skills
            </CardDescription>
          </div>
          <Button onClick={onAdd} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Skill
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {skills.map((skill: any) => (
            <div key={skill.id} className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  value={skill.name}
                  onChange={(e) => onChange(skill.id, "name", e.target.value)}
                  placeholder="Skill name"
                />
              </div>
              <Select
                value={skill.level}
                onValueChange={(value) => onChange(skill.id, "level", value)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(skill.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {skills.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
              <h3 className="font-medium">No Skills Added</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Click the "Add Skill" button to add your skills
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectsSection({ projects, onAdd, onChange, onRemove }: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Add your personal or academic projects
            </CardDescription>
          </div>
          <Button onClick={onAdd} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-4">
          {projects.map((project: any) => (
            <AccordionItem
              key={project.id}
              value={project.id}
              className="border rounded-lg"
            >
              <AccordionTrigger className="px-4">
                {project.title || `Project ${projects.indexOf(project) + 1}`}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${project.id}`}>Project Title</Label>
                    <Input
                      id={`title-${project.id}`}
                      value={project.title}
                      onChange={(e) =>
                        onChange(project.id, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`description-${project.id}`}>
                      Description
                    </Label>
                    <Textarea
                      id={`description-${project.id}`}
                      value={project.description}
                      onChange={(e) =>
                        onChange(project.id, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`link-${project.id}`}>
                      Project Link (Optional)
                    </Label>
                    <Input
                      id={`link-${project.id}`}
                      value={project.link}
                      onChange={(e) =>
                        onChange(project.id, "link", e.target.value)
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Technologies Used</Label>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map(
                        (tech: string, techIndex: number) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tech}
                            <button
                              onClick={() => {
                                const newTech = [...project.technologies];
                                newTech.splice(techIndex, 1);
                                onChange(project.id, "technologies", newTech);
                              }}
                              className="ml-1 rounded-full hover:bg-muted"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        )
                      )}
                      <div className="flex">
                        <Input
                          placeholder="Add technology"
                          className="h-8 w-32"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value) {
                              e.preventDefault();
                              const newTech = [
                                ...project.technologies,
                                e.currentTarget.value,
                              ];
                              onChange(project.id, "technologies", newTech);
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(project.id)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {projects.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
            <h3 className="font-medium">No Projects Added</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click the "Add Project" button to add your projects
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CertificationItem({ item, onChange, onRemove }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor={`name-${item.id}`}>Certification Name</Label>
        <Input
          id={`name-${item.id}`}
          value={item.name}
          onChange={(e) => onChange(item.id, "name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`issuer-${item.id}`}>Issuing Organization</Label>
        <Input
          id={`issuer-${item.id}`}
          value={item.issuer}
          onChange={(e) => onChange(item.id, "issuer", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`date-${item.id}`}>Date Issued</Label>
        <Input
          id={`date-${item.id}`}
          type="month"
          value={item.date}
          onChange={(e) => onChange(item.id, "date", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`link-${item.id}`}>Credential Link (Optional)</Label>
        <Input
          id={`link-${item.id}`}
          value={item.link}
          onChange={(e) => onChange(item.id, "link", e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
          <Trash2 className="mr-1 h-4 w-4" />
          Remove
        </Button>
      </div>
    </div>
  );
}

function ResumeTemplateSelector({
  templates,
  selectedTemplate,
  onSelect,
  onBack,
  onContinue,
}: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a Resume Template</CardTitle>
        <CardDescription>
          Select a template that best represents your professional style
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template: any) => (
            <div
              key={template.id}
              className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                selectedTemplate === template.id
                  ? "border-primary ring-2 ring-primary"
                  : ""
              }`}
              onClick={() => onSelect(template.id)}
            >
              <div className="relative mb-2 overflow-hidden rounded-md">
                <Image
                  src={template.preview || "/placeholder.svg"}
                  alt={template.name}
                  className="h-auto w-full object-cover"
                  width={150}
                  height={200}
                />
                {selectedTemplate === template.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                    <div className="rounded-full bg-primary p-1 text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Content
        </Button>
        <Button onClick={onContinue}>
          Preview Resume
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function ResumePreview({ data, onBack, onSave, onDownload, targetRef }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Preview</CardTitle>
        <CardDescription>
          Preview your resume before downloading
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border p-6">
          <div
            className="mx-auto max-w-[800px] bg-white p-8 shadow-lg"
            ref={targetRef}
          >
            <div className="border-b pb-4">
              <h1 className="text-3xl font-bold">
                {data.personalInfo.fullName}
              </h1>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{data.personalInfo.email}</span>
                <span>{data.personalInfo.phone}</span>
                <span>{data.personalInfo.location}</span>
                {data.personalInfo.website && (
                  <span>{data.personalInfo.website}</span>
                )}
                {data.personalInfo.linkedin && (
                  <span>{data.personalInfo.linkedin}</span>
                )}
                {data.personalInfo.github && (
                  <span>{data.personalInfo.github}</span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">Professional Summary</h2>
              <p className="mt-2">{data.summary}</p>
            </div>

            {data.education.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Education</h2>
                <div className="mt-2 space-y-4">
                  {data.education.map((edu: any) => (
                    <div key={edu.id}>
                      <div className="flex flex-col justify-between sm:flex-row">
                        <div>
                          <h3 className="font-medium">{edu.institution}</h3>
                          <p>{edu.degree}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{edu.location}</p>
                          <p>
                            {formatDate(edu.startDate)} -{" "}
                            {formatDate(edu.endDate)}
                          </p>
                        </div>
                      </div>
                      {edu.description && (
                        <p className="mt-1 text-sm">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.experience.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Experience</h2>
                <div className="mt-2 space-y-4">
                  {data.experience.map((exp: any) => (
                    <div key={exp.id}>
                      <div className="flex flex-col justify-between sm:flex-row">
                        <div>
                          <h3 className="font-medium">{exp.title}</h3>
                          <p>{exp.company}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{exp.location}</p>
                          <p>
                            {formatDate(exp.startDate)} -{" "}
                            {exp.current ? "Present" : formatDate(exp.endDate)}
                          </p>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="mt-1 text-sm">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.skills.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Skills</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.skills.map((skill: any) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}{" "}
                      {skill.level !== "beginner" &&
                        `(${
                          skill.level.charAt(0).toUpperCase() +
                          skill.level.slice(1)
                        })`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.projects.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Projects</h2>
                <div className="mt-2 space-y-4">
                  {data.projects.map((project: any) => (
                    <div key={project.id}>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="mt-1 text-sm">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {project.technologies.map(
                            (tech: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tech}
                              </Badge>
                            )
                          )}
                        </div>
                      )}
                      {project.link && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Link: {project.link}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.certifications.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Certifications</h2>
                <div className="mt-2 space-y-2">
                  {data.certifications.map((cert: any) => (
                    <div key={cert.id}>
                      <div className="flex flex-col justify-between sm:flex-row">
                        <div>
                          <h3 className="font-medium">{cert.name}</h3>
                          <p className="text-sm">{cert.issuer}</p>
                        </div>
                        {cert.date && (
                          <p className="text-sm text-muted-foreground">
                            {formatDate(cert.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Templates
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Resume
          </Button>
          <Button onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState("content");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState(initialResumeData);
  const resumeRef = useRef<HTMLDivElement>(null);

  const { toPDF, targetRef } = usePDF({
    filename: `${resumeData.personalInfo.fullName || "resume"}.pdf`,
    page: { margin: 20 },
  });

  const createSectionHandler = (section: keyof typeof resumeData) => ({
    add: () =>
      setResumeData((prev) => ({
        ...prev,
        [section]: [
          ...prev[section],
          {
            id: `${section}${prev[section].length + 1}`,
            ...getSectionDefaults(section),
          },
        ],
      })),
    remove: (id: string) =>
      setResumeData((prev) => ({
        ...prev,
        [section]: prev[section].filter((item) => item.id !== id),
      })),
    change: (id: string, field: string, value: any) =>
      setResumeData((prev) => ({
        ...prev,
        [section]: prev[section].map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      })),
  });

  const education = createSectionHandler("education");
  const experience = createSectionHandler("experience");
  const skills = createSectionHandler("skills");
  const projects = createSectionHandler("projects");
  const certifications = createSectionHandler("certifications");

  const handlePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const handleSummary = (value: string) => {
    setResumeData((prev) => ({ ...prev, summary: value }));
  };

  const handleSaveResume = () =>
    toast.message("Resume Saved", {
      description: "Your resume has been saved successfully.",
    });

  const handleDownloadResume = () => {
    toPDF();
    toast.message("Resume Downloaded", {
      description: "Your resume has been downloaded as a PDF.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Resume Content</TabsTrigger>
          <TabsTrigger value="template">Choose Template</TabsTrigger>
          <TabsTrigger value="preview">Preview & Download</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <PersonalInfoSection
            data={resumeData.personalInfo}
            onChange={handlePersonalInfo}
          />
          <SummarySection
            summary={resumeData.summary}
            onChange={handleSummary}
          />
          <DynamicSection
            title="Education"
            description="Add your educational background"
            items={resumeData.education}
            onAdd={education.add}
            onRemove={education.remove}
            renderItem={(edu: any) => (
              <EducationItem
                item={edu}
                onChange={education.change}
                onRemove={education.remove}
              />
            )}
          />
          <DynamicSection
            title="Work Experience"
            description="Add your work experience and internships"
            items={resumeData.experience}
            onAdd={experience.add}
            onRemove={experience.remove}
            renderItem={(exp: any) => (
              <ExperienceItem
                item={exp}
                onChange={experience.change}
                onRemove={experience.remove}
              />
            )}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <SkillsSection
              skills={resumeData.skills}
              onAdd={skills.add}
              onChange={skills.change}
              onRemove={skills.remove}
            />
            <ProjectsSection
              projects={resumeData.projects}
              onAdd={projects.add}
              onChange={projects.change}
              onRemove={projects.remove}
            />
          </div>
          <DynamicSection
            title="Certifications"
            description="Add your certifications and licenses"
            items={resumeData.certifications}
            onAdd={certifications.add}
            onRemove={certifications.remove}
            renderItem={(cert: any) => (
              <CertificationItem
                item={cert}
                onChange={certifications.change}
                onRemove={certifications.remove}
              />
            )}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleSaveResume}>
              <Save className="mr-2 h-4 w-4" />
              Save Resume
            </Button>
            <Button onClick={() => setActiveTab("template")}>
              Continue to Templates
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="template" className="space-y-6">
          <ResumeTemplateSelector
            templates={resumeTemplates}
            selectedTemplate={selectedTemplate}
            onSelect={setSelectedTemplate}
            onBack={() => setActiveTab("content")}
            onContinue={() => setActiveTab("preview")}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <ResumePreview
            data={resumeData}
            onBack={() => setActiveTab("template")}
            onSave={handleSaveResume}
            onDownload={handleDownloadResume}
            targetRef={targetRef}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
