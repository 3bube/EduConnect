"use client";

import { useState } from "react";
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

// Resume template options
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

export function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState("content");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState({
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
  });

  const handlePersonalInfoChange = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    });
  };

  const handleSummaryChange = (value: string) => {
    setResumeData({
      ...resumeData,
      summary: value,
    });
  };

  const handleAddEducation = () => {
    const newEducation = {
      id: `edu${resumeData.education.length + 1}`,
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
    };

    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEducation],
    });
  };

  const handleEducationChange = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const handleRemoveEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    });
  };

  const handleAddExperience = () => {
    const newExperience = {
      id: `exp${resumeData.experience.length + 1}`,
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
      current: false,
    };

    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExperience],
    });
  };

  const handleExperienceChange = (id: string, field: string, value: any) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const handleRemoveExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    });
  };

  const handleAddSkill = () => {
    const newSkill = {
      id: `skill${resumeData.skills.length + 1}`,
      name: "",
      level: "beginner",
    };

    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, newSkill],
    });
  };

  const handleSkillChange = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const handleRemoveSkill = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((skill) => skill.id !== id),
    });
  };

  const handleAddProject = () => {
    const newProject = {
      id: `proj${resumeData.projects.length + 1}`,
      title: "",
      description: "",
      link: "",
      technologies: [],
    };

    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, newProject],
    });
  };

  const handleProjectChange = (id: string, field: string, value: any) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const handleRemoveProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter((proj) => proj.id !== id),
    });
  };

  const handleAddCertification = () => {
    const newCertification = {
      id: `cert${resumeData.certifications.length + 1}`,
      name: "",
      issuer: "",
      date: "",
      link: "",
    };

    setResumeData({
      ...resumeData,
      certifications: [...resumeData.certifications, newCertification],
    });
  };

  const handleCertificationChange = (
    id: string,
    field: string,
    value: string
  ) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const handleRemoveCertification = (id: string) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.filter(
        (cert) => cert.id !== id
      ),
    });
  };

  const handleSaveResume = () => {
    // In a real app, this would save to a database or local storage
    toast.message("Resume Saved", {
      description: "Your resume has been saved successfully.",
    });
  };

  const handleDownloadResume = () => {
    // In a real app, this would generate a PDF and download it
    toast.message("Resume Downloaded", {
      description: "Your resume has been downloaded as a PDF.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="content"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Resume Content</TabsTrigger>
          <TabsTrigger value="template">Choose Template</TabsTrigger>
          <TabsTrigger value="preview">Preview & Download</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Add your contact and personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) =>
                      handlePersonalInfoChange("fullName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) =>
                      handlePersonalInfoChange("email", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) =>
                      handlePersonalInfoChange("phone", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) =>
                      handlePersonalInfoChange("location", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    value={resumeData.personalInfo.website}
                    onChange={(e) =>
                      handlePersonalInfoChange("website", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
                  <Input
                    id="linkedin"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) =>
                      handlePersonalInfoChange("linkedin", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub (Optional)</Label>
                  <Input
                    id="github"
                    value={resumeData.personalInfo.github}
                    onChange={(e) =>
                      handlePersonalInfoChange("github", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
                value={resumeData.summary}
                onChange={(e) => handleSummaryChange(e.target.value)}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Keep your summary concise (2-4 sentences) and focused on your
                key strengths and career objectives.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Add your educational background
                  </CardDescription>
                </div>
                <Button onClick={handleAddEducation} size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <AccordionItem
                    key={edu.id}
                    value={edu.id}
                    className="border rounded-lg"
                  >
                    <AccordionTrigger className="px-4">
                      {edu.institution
                        ? edu.institution
                        : `Education ${index + 1}`}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`institution-${edu.id}`}>
                            Institution
                          </Label>
                          <Input
                            id={`institution-${edu.id}`}
                            value={edu.institution}
                            onChange={(e) =>
                              handleEducationChange(
                                edu.id,
                                "institution",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                          <Input
                            id={`degree-${edu.id}`}
                            value={edu.degree}
                            onChange={(e) =>
                              handleEducationChange(
                                edu.id,
                                "degree",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`startDate-${edu.id}`}>
                            Start Date
                          </Label>
                          <Input
                            id={`startDate-${edu.id}`}
                            type="month"
                            value={edu.startDate}
                            onChange={(e) =>
                              handleEducationChange(
                                edu.id,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`endDate-${edu.id}`}>
                            End Date (or Expected)
                          </Label>
                          <Input
                            id={`endDate-${edu.id}`}
                            type="month"
                            value={edu.endDate}
                            onChange={(e) =>
                              handleEducationChange(
                                edu.id,
                                "endDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`location-${edu.id}`}>Location</Label>
                          <Input
                            id={`location-${edu.id}`}
                            value={edu.location}
                            onChange={(e) =>
                              handleEducationChange(
                                edu.id,
                                "location",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                          <Label htmlFor={`description-${edu.id}`}>
                            Description (GPA, Achievements, Coursework)
                          </Label>
                          <Textarea
                            id={`description-${edu.id}`}
                            value={edu.description}
                            onChange={(e) =>
                              handleEducationChange(
                                edu.id,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveEducation(edu.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {resumeData.education.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 font-medium">No Education Added</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Click the "Add Education" button to add your educational
                    background
                  </p>
                  <Button
                    onClick={handleAddEducation}
                    className="mt-4"
                    size="sm"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Education
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>
                    Add your work experience and internships
                  </CardDescription>
                </div>
                <Button onClick={handleAddExperience} size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <AccordionItem
                    key={exp.id}
                    value={exp.id}
                    className="border rounded-lg"
                  >
                    <AccordionTrigger className="px-4">
                      {exp.title && exp.company
                        ? `${exp.title} at ${exp.company}`
                        : `Experience ${index + 1}`}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`title-${exp.id}`}>Job Title</Label>
                          <Input
                            id={`title-${exp.id}`}
                            value={exp.title}
                            onChange={(e) =>
                              handleExperienceChange(
                                exp.id,
                                "title",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`company-${exp.id}`}>Company</Label>
                          <Input
                            id={`company-${exp.id}`}
                            value={exp.company}
                            onChange={(e) =>
                              handleExperienceChange(
                                exp.id,
                                "company",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`startDate-${exp.id}`}>
                            Start Date
                          </Label>
                          <Input
                            id={`startDate-${exp.id}`}
                            type="month"
                            value={exp.startDate}
                            onChange={(e) =>
                              handleExperienceChange(
                                exp.id,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`endDate-${exp.id}`}>
                              End Date
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`current-${exp.id}`}
                                checked={exp.current}
                                onCheckedChange={(checked) =>
                                  handleExperienceChange(
                                    exp.id,
                                    "current",
                                    checked
                                  )
                                }
                              />
                              <Label
                                htmlFor={`current-${exp.id}`}
                                className="text-sm"
                              >
                                Current Position
                              </Label>
                            </div>
                          </div>
                          <Input
                            id={`endDate-${exp.id}`}
                            type="month"
                            value={exp.endDate}
                            onChange={(e) =>
                              handleExperienceChange(
                                exp.id,
                                "endDate",
                                e.target.value
                              )
                            }
                            disabled={exp.current}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`location-${exp.id}`}>Location</Label>
                          <Input
                            id={`location-${exp.id}`}
                            value={exp.location}
                            onChange={(e) =>
                              handleExperienceChange(
                                exp.id,
                                "location",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                          <Label htmlFor={`description-${exp.id}`}>
                            Description
                          </Label>
                          <Textarea
                            id={`description-${exp.id}`}
                            value={exp.description}
                            onChange={(e) =>
                              handleExperienceChange(
                                exp.id,
                                "description",
                                e.target.value
                              )
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Describe your responsibilities and achievements. Use
                            bullet points for better readability.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveExperience(exp.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {resumeData.experience.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 font-medium">No Experience Added</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Click the "Add Experience" button to add your work
                    experience
                  </p>
                  <Button
                    onClick={handleAddExperience}
                    className="mt-4"
                    size="sm"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Experience
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>
                      Add your technical and soft skills
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddSkill} size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Skill
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resumeData.skills.map((skill, index) => (
                    <div key={skill.id} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          value={skill.name}
                          onChange={(e) =>
                            handleSkillChange(skill.id, "name", e.target.value)
                          }
                          placeholder="Skill name"
                        />
                      </div>
                      <Select
                        value={skill.level}
                        onValueChange={(value) =>
                          handleSkillChange(skill.id, "level", value)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSkill(skill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {resumeData.skills.length === 0 && (
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

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>
                      Add your personal or academic projects
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddProject} size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-4">
                  {resumeData.projects.map((project, index) => (
                    <AccordionItem
                      key={project.id}
                      value={project.id}
                      className="border rounded-lg"
                    >
                      <AccordionTrigger className="px-4">
                        {project.title ? project.title : `Project ${index + 1}`}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`title-${project.id}`}>
                              Project Title
                            </Label>
                            <Input
                              id={`title-${project.id}`}
                              value={project.title}
                              onChange={(e) =>
                                handleProjectChange(
                                  project.id,
                                  "title",
                                  e.target.value
                                )
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
                                handleProjectChange(
                                  project.id,
                                  "description",
                                  e.target.value
                                )
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
                                handleProjectChange(
                                  project.id,
                                  "link",
                                  e.target.value
                                )
                              }
                              placeholder="https://..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Technologies Used</Label>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, techIndex) => (
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
                                      handleProjectChange(
                                        project.id,
                                        "technologies",
                                        newTech
                                      );
                                    }}
                                    className="ml-1 rounded-full hover:bg-muted"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                              <div className="flex">
                                <Input
                                  placeholder="Add technology"
                                  className="h-8 w-32"
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      e.currentTarget.value
                                    ) {
                                      e.preventDefault();
                                      const newTech = [
                                        ...project.technologies,
                                        e.currentTarget.value,
                                      ];
                                      handleProjectChange(
                                        project.id,
                                        "technologies",
                                        newTech
                                      );
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
                            onClick={() => handleRemoveProject(project.id)}
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {resumeData.projects.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                    <h3 className="font-medium">No Projects Added</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Click the "Add Project" button to add your projects
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Certifications</CardTitle>
                  <CardDescription>
                    Add your certifications and licenses
                  </CardDescription>
                </div>
                <Button onClick={handleAddCertification} size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Certification
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resumeData.certifications.map((cert, index) => (
                  <div key={cert.id} className="rounded-lg border p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${cert.id}`}>
                          Certification Name
                        </Label>
                        <Input
                          id={`name-${cert.id}`}
                          value={cert.name}
                          onChange={(e) =>
                            handleCertificationChange(
                              cert.id,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`issuer-${cert.id}`}>
                          Issuing Organization
                        </Label>
                        <Input
                          id={`issuer-${cert.id}`}
                          value={cert.issuer}
                          onChange={(e) =>
                            handleCertificationChange(
                              cert.id,
                              "issuer",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`date-${cert.id}`}>Date Issued</Label>
                        <Input
                          id={`date-${cert.id}`}
                          type="month"
                          value={cert.date}
                          onChange={(e) =>
                            handleCertificationChange(
                              cert.id,
                              "date",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`link-${cert.id}`}>
                          Credential Link (Optional)
                        </Label>
                        <Input
                          id={`link-${cert.id}`}
                          value={cert.link}
                          onChange={(e) =>
                            handleCertificationChange(
                              cert.id,
                              "link",
                              e.target.value
                            )
                          }
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCertification(cert.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                {resumeData.certifications.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <h3 className="font-medium">No Certifications Added</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Click the "Add Certification" button to add your
                      certifications
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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
          <Card>
            <CardHeader>
              <CardTitle>Choose a Resume Template</CardTitle>
              <CardDescription>
                Select a template that best represents your professional style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {resumeTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                      selectedTemplate === template.id
                        ? "border-primary ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="relative mb-2 overflow-hidden rounded-md">
                      <img
                        src={template.preview || "/placeholder.svg"}
                        alt={template.name}
                        className="h-auto w-full object-cover"
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
              <Button variant="outline" onClick={() => setActiveTab("content")}>
                Back to Content
              </Button>
              <Button onClick={() => setActiveTab("preview")}>
                Preview Resume
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
              <CardDescription>
                Preview your resume before downloading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-6">
                <div className="mx-auto max-w-[800px] bg-white p-8 shadow-lg">
                  <div className="border-b pb-4">
                    <h1 className="text-3xl font-bold">
                      {resumeData.personalInfo.fullName}
                    </h1>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>{resumeData.personalInfo.email}</span>
                      <span>{resumeData.personalInfo.phone}</span>
                      <span>{resumeData.personalInfo.location}</span>
                      {resumeData.personalInfo.website && (
                        <span>{resumeData.personalInfo.website}</span>
                      )}
                      {resumeData.personalInfo.linkedin && (
                        <span>{resumeData.personalInfo.linkedin}</span>
                      )}
                      {resumeData.personalInfo.github && (
                        <span>{resumeData.personalInfo.github}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="text-xl font-semibold">
                      Professional Summary
                    </h2>
                    <p className="mt-2">{resumeData.summary}</p>
                  </div>

                  {resumeData.education.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-xl font-semibold">Education</h2>
                      <div className="mt-2 space-y-4">
                        {resumeData.education.map((edu) => (
                          <div key={edu.id}>
                            <div className="flex flex-col justify-between sm:flex-row">
                              <div>
                                <h3 className="font-medium">
                                  {edu.institution}
                                </h3>
                                <p>{edu.degree}</p>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <p>{edu.location}</p>
                                <p>
                                  {edu.startDate &&
                                    new Date(edu.startDate).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "short",
                                      }
                                    )}{" "}
                                  -
                                  {edu.endDate &&
                                    new Date(edu.endDate).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "short",
                                      }
                                    )}
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

                  {resumeData.experience.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-xl font-semibold">Experience</h2>
                      <div className="mt-2 space-y-4">
                        {resumeData.experience.map((exp) => (
                          <div key={exp.id}>
                            <div className="flex flex-col justify-between sm:flex-row">
                              <div>
                                <h3 className="font-medium">{exp.title}</h3>
                                <p>{exp.company}</p>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <p>{exp.location}</p>
                                <p>
                                  {exp.startDate &&
                                    new Date(exp.startDate).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "short",
                                      }
                                    )}{" "}
                                  -
                                  {exp.current
                                    ? "Present"
                                    : exp.endDate &&
                                      new Date(exp.endDate).toLocaleDateString(
                                        "en-US",
                                        {
                                          year: "numeric",
                                          month: "short",
                                        }
                                      )}
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

                  {resumeData.skills.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-xl font-semibold">Skills</h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {resumeData.skills.map((skill) => (
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

                  {resumeData.projects.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-xl font-semibold">Projects</h2>
                      <div className="mt-2 space-y-4">
                        {resumeData.projects.map((project) => (
                          <div key={project.id}>
                            <h3 className="font-medium">{project.title}</h3>
                            <p className="mt-1 text-sm">
                              {project.description}
                            </p>
                            {project.technologies.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {project.technologies.map((tech, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
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

                  {resumeData.certifications.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-xl font-semibold">Certifications</h2>
                      <div className="mt-2 space-y-2">
                        {resumeData.certifications.map((cert) => (
                          <div key={cert.id}>
                            <div className="flex flex-col justify-between sm:flex-row">
                              <div>
                                <h3 className="font-medium">{cert.name}</h3>
                                <p className="text-sm">{cert.issuer}</p>
                              </div>
                              {cert.date && (
                                <p className="text-sm text-muted-foreground">
                                  {new Date(cert.date).toLocaleDateString(
                                    "en-US",
                                    { year: "numeric", month: "short" }
                                  )}
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
              <Button
                variant="outline"
                onClick={() => setActiveTab("template")}
              >
                Back to Templates
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleSaveResume}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Resume
                </Button>
                <Button onClick={handleDownloadResume}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
