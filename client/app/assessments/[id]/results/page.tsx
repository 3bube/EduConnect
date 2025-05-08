"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  GraduationCap, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  Award,
  File,
  Share2,
  Loader2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getAssessmentResults } from "@/api/assessment";
import { generateCertificateFromAssessment } from "@/api/certificate";
import { useToast } from "@/components/ui/use-toast";

interface Option {
  id: string;
  text: string;
}

interface AssessmentQuestion {
  _id: string;
  question: string;
  options: Option[];
  correctOption: string;
  // Add these fields to be compatible with both formats
  text?: string;
  type?: string;
  correctAnswer?: string;
}

interface AssessmentAnswer {
  questionId: string;
  selectedOption?: string;
  selectedOptions?: string[]; // Add this for multiple-select questions
  isCorrect: boolean;
}

interface AssessmentResult {
  _id: string;
  assessmentId: string;
  userId: string;
  assessment: {
    _id: string;
    title: string;
    courseId: string;
    passingScore: number;
    timeLimit: number;
    course?: {
      _id: string;
      title: string;
    };
    questions: AssessmentQuestion[];
  };
  answers: AssessmentAnswer[];
  score: number;
  passed: boolean;
  startTime: string;
  endTime: string;
  totalTime: number; // in seconds
  certificate?: {
    _id: string;
    credentialId: string;
  };
}

interface NormalizedOption {
  id: string;
  text: string;
}

export default function AssessmentResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchResult() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getAssessmentResults(params.id);
        if (response && response.result) {
          console.log("Received result data:", response.result);
          setResult(response.result as unknown as AssessmentResult);
        }
      } catch (err) {
        console.error("Failed to fetch assessment result:", err);
        setError("Failed to load assessment result. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchResult();
  }, [params.id]);


  console.log("result",result);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Get performance data for charts
  const getPerformanceData = () => {
    if (!result) return { correct: 0, incorrect: 0, skipped: 0 };
    
    console.log("Calculating performance from answers:", result.answers);
    
    const correct = result.answers.filter(a => a.isCorrect).length;
    
    // Consider an answer incorrect if it has a selection (single or multiple) but is not correct
    const incorrect = result.answers.filter(a => 
      !a.isCorrect && (
        (a.selectedOption && a.selectedOption !== "") || 
        (a.selectedOptions && a.selectedOptions.length > 0)
      )
    ).length;
    
    // Consider a question skipped if it has no selection (neither single nor multiple)
    const skipped = result.answers.filter(a => 
      (!a.selectedOption || a.selectedOption === "") && 
      (!a.selectedOptions || a.selectedOptions.length === 0)
    ).length;
    
    console.log("Performance calculation:", { correct, incorrect, skipped, totalQuestions: result.assessment.questions.length });
    
    return { correct, incorrect, skipped };
  };
  
  // Download results as PDF
  const downloadResults = () => {
    toast({
      title: "Download Started",
      description: "Your results are being downloaded as a PDF."
    });
    
    // For demo, just show a success message after a delay
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your results have been downloaded successfully."
      });
    }, 1500);
  };
  
  // View certificate
  const viewCertificate = () => {
    if (result?.certificate?._id) {
      router.push(`/dashboard/certificates/${result.certificate._id}`);
    }
  };
  
  // Generate certificate manually if it's missing
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  
  const generateCertificate = async () => {
    if (!result || !result.passed) return;
    
    try {
      setIsGeneratingCert(true);
      const response = await generateCertificateFromAssessment(result.assessmentId);
      
      if (response && response.certificate) {
        toast({
          title: "Certificate Generated",
          description: "Your certificate has been successfully created."
        });
        
        // Update the local result with the new certificate
        setResult({
          ...result,
          certificate: {
            _id: response.certificate._id,
            credentialId: response.certificate.credentialId
          }
        });
      }
    } catch (err) {
      console.error("Failed to generate certificate:", err);
      toast({
        title: "Certificate Generation Failed",
        description: "There was an error creating your certificate. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingCert(false);
    }
  };
  
  const performance = getPerformanceData();
  
  const normalizeOptions = (options: unknown[]): NormalizedOption[] => {
    if (!Array.isArray(options)) {
      console.error("Options is not an array:", options);
      return [];
    }

    return options.map((option, index) => {
      if (typeof option === 'string') {
        return { id: option, text: option };
      } else if (option && typeof option === 'object') {
        const opt = option as Record<string, unknown>;
        if (opt.id && typeof opt.id === 'string' && opt.text && typeof opt.text === 'string') {
          return { id: opt.id, text: opt.text };
        } else if (opt.text && typeof opt.text === 'string') {
          return { id: `option-${index}`, text: opt.text };
        } else if (opt.id && typeof opt.id === 'string') {
          return { id: opt.id, text: opt.id };
        }
      }
      return { id: `option-${index}`, text: `Option ${index + 1}` };
    });
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span>EduConnect</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={downloadResults}>
              <Download className="mr-1 h-4 w-4" />
              Download Results
            </Button>
            {result?.passed && result?.certificate && (
              <Button size="sm" onClick={viewCertificate}>
                <Award className="mr-1 h-4 w-4" />
                View Certificate
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-6">
        {isLoading ? (
          <div className="flex h-80 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading results...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : result ? (
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Result Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{result.assessment.title} - Results</h1>
                  <p className="text-muted-foreground">
                    Course: {result.assessment.course?.title || "No course specified"}
                  </p>
                </div>
                <div>
                  <Badge className={result.passed ? "bg-green-500" : "bg-red-500"}>
                    {result.passed ? "Passed" : "Failed"}
                  </Badge>
                </div>
              </div>
              
              {/* Congratulations Banner */}
              {result.passed && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                      <div className="mb-4 md:mb-0 md:mr-6">
                        <Award className="h-16 w-16 text-green-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-green-700">Congratulations!</h2>
                        <p className="text-green-600">
                          You have successfully passed this assessment with a score of {result.score}%. 
                          {result.certificate && "A certificate has been issued to you."}
                        </p>
                        {result.certificate && (
                          <Button 
                            className="mt-3" 
                            size="sm" 
                            onClick={viewCertificate}
                          >
                            <Award className="mr-1 h-4 w-4" />
                            View Certificate
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Failed Banner */}
              {!result.passed && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                      <div className="mb-4 md:mb-0 md:mr-6">
                        <AlertCircle className="h-16 w-16 text-red-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-red-700">Assessment Not Passed</h2>
                        <p className="text-red-600">
                          You did not meet the passing score of {result.assessment.passingScore}% for this assessment. 
                          Your score was {result.score}%. You can review your answers below and try again later.
                        </p>
                        <Button 
                          className="mt-3" 
                          size="sm" 
                          variant="outline"
                          asChild
                        >
                          <Link href={`/assessments/${result.assessmentId}`}>
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Take Assessment Again
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Results Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Results Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Score</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">{result.score}%</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        (Passing: {result.assessment.passingScore}%)
                      </span>
                    </div>
                    <Progress 
                      value={result.score} 
                      className={`h-2 ${
                        result.score >= result.assessment.passingScore 
                          ? "bg-green-500" 
                          : "bg-red-500"
                      }`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Time Taken</p>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-medium">{formatTime(result.totalTime)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Time Limit: {result.assessment.timeLimit} minutes
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Questions</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="ml-1 text-lg font-medium">{performance.correct}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Correct</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="ml-1 text-lg font-medium">{performance.incorrect}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Incorrect</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span className="ml-1 text-lg font-medium">{performance.skipped}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Skipped</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Date Completed</p>
                    <div className="text-lg font-medium">
                      {formatDate(result.endTime)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Detailed Results */}
            <Tabs defaultValue="answers">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="answers">Answers</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="certificate">Certificate</TabsTrigger>
              </TabsList>
              
              <TabsContent value="answers" className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold">Your Answers</h3>
                
                {result.assessment.questions.map((question, index) => {
                  const answer = result.answers.find(a => a.questionId === question._id);
                  
                  // Handle both single and multiple selections
                  const isMultipleSelect = Array.isArray(answer?.selectedOptions) && answer?.selectedOptions.length > 0;
                  const hasSelection = (answer?.selectedOption && answer.selectedOption !== "") || isMultipleSelect;
                  
                  // Debug log to help diagnose issues
                  console.log("Question:", {
                    id: question._id,
                    text: question.question || question.text,
                    answer
                  });
                  
                  return (
                    <Card key={question._id} className={answer?.isCorrect ? "border-green-200" : "border-red-200"}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">
                            Question {index + 1}: {question.question || question.text}
                          </CardTitle>
                          {answer?.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {Array.isArray(question.options) && normalizeOptions(question.options).map((option, optIdx) => {
                            console.log(`Normalized option ${optIdx}:`, option);
                            
                            // Check if this option was selected
                            const isSelected = 
                              option.id === answer?.selectedOption || 
                              (Array.isArray(answer?.selectedOptions) && 
                                answer?.selectedOptions.includes(option.id));
                            
                            // Determine correct option
                            const correctOption = question.correctOption || question.correctAnswer;
                            const isCorrect = option.id === correctOption;
                            
                            return (
                              <div 
                                key={option.id}
                                className={`rounded-md p-3 ${
                                  isCorrect
                                    ? "bg-green-50 border border-green-200"
                                    : isSelected && !answer?.isCorrect
                                    ? "bg-red-50 border border-red-200"
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                              >
                                <div className="flex items-start">
                                  <div className="mr-2 mt-0.5">
                                    {isCorrect ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : isSelected && !answer?.isCorrect ? (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    ) : null}
                                  </div>
                                  <div className="flex-1">
                                    <p className={
                                      isCorrect
                                        ? "text-green-800"
                                        : isSelected && !answer?.isCorrect
                                        ? "text-red-800"
                                        : ""
                                    }>
                                      {option.text}
                                    </p>
                                    {isSelected && (
                                      <p className="text-xs mt-1 text-muted-foreground">Your answer</p>
                                    )}
                                    {isCorrect && (
                                      <p className="text-xs mt-1 text-green-600">Correct answer</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          
                          {!hasSelection && (
                            <div className="rounded-md p-3 bg-yellow-50 border border-yellow-200">
                              <div className="flex items-center">
                                <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                                <p className="text-yellow-800">You skipped this question</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
              
              <TabsContent value="performance" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                    <CardDescription>
                      A breakdown of your performance in this assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Performance Chart */}
                      <div className="rounded-lg border bg-card p-6">
                        <h4 className="mb-4 text-base font-medium">Question Results</h4>
                        <div className="flex items-center justify-center h-40">
                          <div className="flex items-end space-x-6">
                            <div className="flex flex-col items-center">
                              <div className="h-32 w-12 bg-green-200 rounded-t-md relative overflow-hidden">
                                <div 
                                  className="absolute bottom-0 w-full bg-green-500" 
                                  style={{ 
                                    height: `${(performance.correct / result.assessment.questions.length) * 100}%` 
                                  }}
                                ></div>
                              </div>
                              <p className="mt-2 text-xs text-muted-foreground">Correct</p>
                              <p className="font-medium">{performance.correct}</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <div className="h-32 w-12 bg-red-200 rounded-t-md relative overflow-hidden">
                                <div 
                                  className="absolute bottom-0 w-full bg-red-500" 
                                  style={{ 
                                    height: `${(performance.incorrect / result.assessment.questions.length) * 100}%` 
                                  }}
                                ></div>
                              </div>
                              <p className="mt-2 text-xs text-muted-foreground">Incorrect</p>
                              <p className="font-medium">{performance.incorrect}</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <div className="h-32 w-12 bg-yellow-200 rounded-t-md relative overflow-hidden">
                                <div 
                                  className="absolute bottom-0 w-full bg-yellow-500" 
                                  style={{ 
                                    height: `${(performance.skipped / result.assessment.questions.length) * 100}%` 
                                  }}
                                ></div>
                              </div>
                              <p className="mt-2 text-xs text-muted-foreground">Skipped</p>
                              <p className="font-medium">{performance.skipped}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Score Analysis */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Score Comparison</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1 text-xs">
                                  <span>Your Score</span>
                                  <span>{result.score}%</span>
                                </div>
                                <Progress 
                                  value={result.score} 
                                  className={`h-2 ${
                                    result.score >= result.assessment.passingScore 
                                      ? "bg-green-500" 
                                      : "bg-red-500"
                                  }`}
                                />
                              </div>
                              
                              <div>
                                <div className="flex justify-between mb-1 text-xs">
                                  <span>Passing Score</span>
                                  <span>{result.assessment.passingScore}%</span>
                                </div>
                                <Progress 
                                  value={result.assessment.passingScore} 
                                  className="h-2 bg-blue-500"
                                />
                              </div>
                              
                              <div className="text-sm mt-4">
                                {result.score >= result.assessment.passingScore ? (
                                  <p className="text-green-600">
                                    Your score is {result.score - result.assessment.passingScore}% above the passing score.
                                  </p>
                                ) : (
                                  <p className="text-red-600">
                                    Your score is {result.assessment.passingScore - result.score}% below the passing score.
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Time Analysis</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1 text-xs">
                                  <span>Time Used</span>
                                  <span>{formatTime(result.totalTime)}</span>
                                </div>
                                <Progress 
                                  value={(result.totalTime / (result.assessment.timeLimit * 60)) * 100} 
                                  className="h-2 bg-blue-500"
                                />
                              </div>
                              
                              <div>
                                <div className="flex justify-between mb-1 text-xs">
                                  <span>Time Limit</span>
                                  <span>{formatTime(result.assessment.timeLimit * 60)}</span>
                                </div>
                                <Progress 
                                  value={100} 
                                  className="h-2"
                                />
                              </div>
                              
                              <div className="text-sm mt-4">
                                <p className="text-muted-foreground">
                                  You spent an average of {Math.round(result.totalTime / result.assessment.questions.length)} seconds per question.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="certificate" className="mt-4">
                {result.passed ? (
                  result.certificate ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Certificate of Completion</CardTitle>
                        <CardDescription>
                          Congratulations on earning your certificate!
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-lg border bg-card p-6">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <Award className="h-16 w-16 text-primary" />
                            <div>
                              <h3 className="text-xl font-bold">Certificate Earned</h3>
                              <p className="text-muted-foreground">
                                You have successfully completed {result.assessment.title} and earned a certificate.
                              </p>
                            </div>
                            
                            <div className="grid w-full gap-2 sm:grid-cols-2">
                              <div className="rounded-md bg-muted p-3">
                                <p className="text-xs text-muted-foreground">Certificate ID</p>
                                <p className="font-mono text-sm">{result.certificate.credentialId}</p>
                              </div>
                              <div className="rounded-md bg-muted p-3">
                                <p className="text-xs text-muted-foreground">Issue Date</p>
                                <p className="text-sm">{formatDate(result.endTime)}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button onClick={viewCertificate}>
                                <Award className="mr-2 h-4 w-4" />
                                View Certificate
                              </Button>
                              <Button variant="outline">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Certificate Not Available</CardTitle>
                        <CardDescription>You passed this assessment, but your certificate is not generated yet.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center text-center space-y-4 py-6">
                          <Award className="h-16 w-16 text-muted-foreground" />
                          <div>
                            <h3 className="text-lg font-semibold">Certificate Processing</h3>
                            <p className="text-muted-foreground mb-4">
                              Congratulations on passing! Your certificate can be generated now.
                            </p>
                            <Button 
                              onClick={generateCertificate}
                              disabled={isGeneratingCert}
                            >
                              {isGeneratingCert ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Award className="mr-2 h-4 w-4" />
                                  Generate Certificate
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Certificate Not Available</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center text-center space-y-4 py-6">
                        <File className="h-16 w-16 text-muted-foreground" />
                        <div>
                          <h3 className="text-lg font-semibold">No Certificate Earned</h3>
                          <p className="text-muted-foreground">
                            {result.passed
                              ? "Your certificate is being processed and will be available soon."
                              : "You need to pass the assessment to earn a certificate."}
                          </p>
                        </div>
                        
                        {!result.passed && (
                          <Button 
                            variant="outline"
                            asChild
                          >
                            <Link href={`/assessments/${result.assessmentId}`}>
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Take Assessment Again
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex h-80 items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Result not found</h3>
              <p className="text-muted-foreground">The requested assessment result could not be found.</p>
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
