"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, Loader2, Clock, ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getAssessmentById, getAssessmentQuestions, submitAssessment } from "@/api/assessment";
import { useToast } from "@/components/ui/use-toast";

// Define a local interface that matches the structure received from the API
interface AssessmentQuestion {
  _id: string;
  type: "multiple-choice" | "multiple-select" | "true-false";
  text: string;
  options: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
}

interface Assessment {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  course?: {
    _id: string;
    title: string;
  };
  type: "quiz" | "exam";
  timeLimit: number;
  dueDate: string;
  passingScore: number;
  status: "draft" | "published" | "not_started" | "in_progress" | "completed";
  questions: AssessmentQuestion[];
}

interface UserResponse {
  questionId: string;
  selectedOption: string;
  selectedAnswers?: string[];
}

// Create a server component that gets the params and passes the ID to the client component
export default function AssessmentPage({ params }: { params: { id: string } }) {
  return <AssessmentPageClient assessmentId={params.id} />;
}

// Client component that doesn't directly use params
function AssessmentPageClient({ assessmentId }: { assessmentId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // State for assessment data
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for timer
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  
  // State for user responses
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit assessment
  const handleSubmit = useCallback(async () => {
    if (!assessment) return;
    
    try {
      setIsSubmitting(true);
      
      // Check if all questions are answered
      const unansweredCount = userResponses.filter(r => {
        // For multiple-select, check selectedAnswers array
        if (r.selectedAnswers && r.selectedAnswers.length > 0) return false;
        // For single-select, check selectedOption string
        return r.selectedOption === "";
      }).length;
      
      if (unansweredCount > 0) {
        // Ask for confirmation before submitting with unanswered questions
        if (!window.confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`)) {
          setIsSubmitting(false);
          return;
        }
      }
      
      // Format answers properly for submission
      const formattedAnswers = userResponses.reduce((acc, curr) => {
        // Check if it's a multiple-select question
        if (curr.selectedAnswers && curr.selectedAnswers.length > 0) {
          acc[curr.questionId] = curr.selectedAnswers;
        } else {
          acc[curr.questionId] = curr.selectedOption;
        }
        return acc;
      }, {} as Record<string, string | string[]>);
      
      // Debug log entire submission
      console.log("Submitting assessment with data:", {
        assessmentId: assessment._id,
        timeElapsed: Math.floor(timeElapsed),
        answers: formattedAnswers,
        userResponses
      });
      
      // Log each answer for detailed debugging
      userResponses.forEach((response, index) => {
        // Find corresponding question to get type
        const question = questions.find(q => q._id === response.questionId);
        console.log(`Answer ${index + 1} for question type ${question?.type}:`, {
          questionId: response.questionId,
          selectedOption: response.selectedOption,
          selectedAnswers: response.selectedAnswers,
          isEmpty: response.selectedOption === "" && (!response.selectedAnswers || response.selectedAnswers.length === 0),
          questionType: question?.type
        });
      });
      
      // Submit to API
      const result = await submitAssessment(
        assessment._id,
        formattedAnswers,
        Math.floor(timeElapsed) // Send in seconds not minutes
      );
      
      console.log("Assessment submission result:", result);
      
      toast({
        title: "Assessment Submitted",
        description: "Your assessment has been submitted successfully!"
      });
      
      // Redirect to results page
      router.push(`/assessments/${assessment._id}/results`);
      
    } catch (err) {
      console.error("Failed to submit assessment:", err);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [assessment, router, timeElapsed, toast, userResponses, questions]);
  
  // Fetch assessment data
  useEffect(() => {
    async function fetchAssessmentAndQuestions() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the assessment data
        const assessmentResponse = await getAssessmentById(assessmentId);
        console.log('Assessment API response:', assessmentResponse);
        
        if (assessmentResponse?.assessment) {
          const apiAssessment = assessmentResponse.assessment;
          
          // Create a local assessment object with the correct structure
          const assessmentData: Assessment = {
            _id: apiAssessment._id,
            title: apiAssessment.title,
            description: apiAssessment.description,
            courseId: apiAssessment.courseId,
            course: apiAssessment.course,
            type: apiAssessment.type,
            timeLimit: apiAssessment.timeLimit,
            dueDate: apiAssessment.dueDate,
            passingScore: apiAssessment.passingScore,
            status: apiAssessment.status,
            questions: []  // Will be populated separately
          };
          
          setAssessment(assessmentData);
          
          // Initialize time remaining if available
          if (assessmentData.timeLimit) {
            setTimeRemaining(Number(assessmentData.timeLimit) * 60); // Convert minutes to seconds
          }
          
          // Fetch questions separately
          const questionsResponse = await getAssessmentQuestions(assessmentId);
          console.log('Questions API response:', questionsResponse);
          
          if (questionsResponse?.questions && Array.isArray(questionsResponse.questions)) {
            // Log the first question to inspect its structure
            if (questionsResponse.questions.length > 0) {
              console.log('First question structure:', JSON.stringify(questionsResponse.questions[0]));
              console.log('Options type:', typeof questionsResponse.questions[0].options);
              console.log('Is options array:', Array.isArray(questionsResponse.questions[0].options));
              if (Array.isArray(questionsResponse.questions[0].options) && questionsResponse.questions[0].options.length > 0) {
                console.log('First option structure:', JSON.stringify(questionsResponse.questions[0].options[0]));
              }
            }
            
            // Transform API questions to local format - handle both string arrays and object arrays for options
            const transformedQuestions: AssessmentQuestion[] = questionsResponse.questions.map(q => {
              // Check if options is an array of objects with id and text properties or just strings
              let formattedOptions: string[] = [];
              
              if (Array.isArray(q.options)) {
                // Check the type of the first option to determine how to process all options
                const firstOption = q.options[0];
                
                if (firstOption && typeof firstOption === 'object' && 'text' in firstOption) {
                  // Options are objects with a text property
                  formattedOptions = q.options.map(opt => opt.text);
                } else {
                  // Options are already strings
                  formattedOptions = q.options.map(String);
                }
              } else {
                console.error('Question options is not an array:', q.options);
              }
              
              return {
                _id: q._id,
                type: q.type,
                text: q.text,
                options: formattedOptions,
                correctAnswer: q.correctAnswer,
                correctAnswers: q.correctAnswers
              };
            });
            
            console.log('Transformed questions:', transformedQuestions);
            setQuestions(transformedQuestions);
            
            // Initialize empty responses for each question
            const initialResponses = transformedQuestions.map(q => ({
              questionId: q._id,
              selectedOption: "",
              selectedAnswers: [] // Initialize selectedAnswers for multiple-select questions
            }));
            setUserResponses(initialResponses);
          }
        }
      } catch (err) {
        console.error("Failed to fetch assessment:", err);
        setError("Failed to load assessment. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAssessmentAndQuestions();
    
    // Clean up timer on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [assessmentId]);

  console.log("assessment", assessment);
  
  // Timer functionality
  useEffect(() => {
    if (assessment && timeRemaining > 0 && !isLoading) {
      // Start the timer
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - auto submit
            clearInterval(intervalRef.current!);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
        
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [assessment, isLoading, handleSubmit, timeRemaining]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!questions || questions.length === 0) return 0;
    
    // Check for any response - either selected option or selected answers array
    const answered = userResponses.filter(r => 
      r.selectedOption !== "" || (r.selectedAnswers && r.selectedAnswers.length > 0)
    ).length;
    
    return Math.floor((answered / questions.length) * 100);
  };
  
  // Update user response for the current question
  const handleOptionSelect = (optionId: string) => {
    const updatedResponses = [...userResponses];
    if (questions && 
        Array.isArray(questions) && 
        questions[currentQuestionIndex] &&
        questions[currentQuestionIndex]._id) {
      
      const questionType = questions[currentQuestionIndex].type;
      
      // Handle different question types differently
      if (questionType === "multiple-select") {
        // For multiple-select questions, store as an array
        const currentResponse = updatedResponses[currentQuestionIndex];
        let selectedAnswers = currentResponse?.selectedAnswers || [];
        
        // Toggle selected option
        if (selectedAnswers.includes(optionId)) {
          selectedAnswers = selectedAnswers.filter(id => id !== optionId);
        } else {
          selectedAnswers.push(optionId);
        }
        
        updatedResponses[currentQuestionIndex] = {
          questionId: questions[currentQuestionIndex]._id,
          selectedOption: optionId, // Keep for backwards compatibility
          selectedAnswers: selectedAnswers // Array of selected options
        };
      } else {
        // For single-select questions (multiple-choice, true-false)
        updatedResponses[currentQuestionIndex] = {
          questionId: questions[currentQuestionIndex]._id,
          selectedOption: optionId
        };
      }
      
      setUserResponses(updatedResponses);
    }
  };
  
  // Navigation between questions
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (questions && Array.isArray(questions) && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  // Calculate completion status
  const getCompletionStatus = () => {
    if (!questions || !Array.isArray(questions)) {
      return { answered: 0, total: 0 };
    }
    
    // Check for any response - either selected option or selected answers array
    const answered = userResponses.filter(r => 
      r.selectedOption !== "" || (r.selectedAnswers && r.selectedAnswers.length > 0)
    ).length;
    
    return {
      answered,
      total: questions.length
    };
  };
  

  
  // Get current question safely from questions state
  const currentQuestion = questions && Array.isArray(questions) ? 
    questions[currentQuestionIndex] : undefined;
  const completion = getCompletionStatus();
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span>EduConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">
                Time Remaining: <span className={`${timeRemaining < 60 ? "text-red-500 animate-pulse" : "text-primary"}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-6">
        {isLoading ? (
          <div className="flex h-80 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading assessment...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : assessment ? (
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Header and Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{assessment.title}</h1>
                <div className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {assessment.questions.length}
                </div>
              </div>
              <p className="text-muted-foreground">
                Course: {assessment.course?.title || "No course specified"}
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{completion.answered}/{completion.total} questions answered</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>
            </div>
            
            {/* Current Question */}
            {currentQuestion && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Question {currentQuestionIndex + 1}: {currentQuestion?.text || ""}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentQuestion.type === "multiple-select" ? (
                    // For multiple-select questions, use checkboxes instead of radio
                    <div className="space-y-2">
                      {currentQuestion?.options && Array.isArray(currentQuestion.options) ? 
                        currentQuestion.options.map((option, idx) => (
                          <div key={idx} className="flex items-center space-x-2 py-2">
                            <input 
                              type="checkbox"
                              id={`option-${idx}`}
                              checked={userResponses[currentQuestionIndex]?.selectedAnswers?.includes(option) || false}
                              onChange={() => handleOptionSelect(option)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        )) : <p>No options available for this question</p>
                      }
                    </div>
                  ) : (
                    // For single-select questions, keep using radio group
                    <RadioGroup 
                      value={userResponses[currentQuestionIndex]?.selectedOption || ""}
                      onValueChange={handleOptionSelect}
                    >
                      {currentQuestion?.options && Array.isArray(currentQuestion.options) ? 
                        currentQuestion.options.map((option, idx) => (
                          <div key={idx} className="flex items-center space-x-2 py-2">
                            <RadioGroupItem value={option} id={`option-${idx}`} />
                            <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        )) : <p>No options available for this question</p>
                      }
                    </RadioGroup>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Navigation */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentQuestionIndex < assessment.questions.length - 1 ? (
                <Button onClick={handleNextQuestion}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Assessment
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {/* Question Navigator */}
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium">Question Navigator</h3>
              <div className="flex flex-wrap gap-2">
                {questions && Array.isArray(questions) ? questions.map((_, index) => (
                  <Button
                    key={index}
                    variant={index === currentQuestionIndex ? "default" : userResponses[index]?.selectedOption ? "secondary" : "outline"}
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </Button>
                )) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-80 items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Assessment not found</h3>
              <p className="text-muted-foreground">The requested assessment could not be found.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/assessments">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to assessments
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
