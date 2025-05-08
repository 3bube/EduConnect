"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Download, ArrowLeft, Share2, Loader2, QrCode, Shield } from "lucide-react";
import { getCertificateById, verifyCertificate } from "@/api/certificate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// Extend the API Certificate type with UI-specific fields
interface CertificateDisplay {
  _id: string;
  userId: string;
  title: string;
  credentialId: string;
  score: number;
  grade: string;
  issueDate: string; // We'll map from issueDate to match the API
  status: string;
  courseId: {
    _id: string;
    title: string;
    image?: string;
  };
  assessmentId: {
    _id: string;
    title: string;
    type: string;
  };
  // Display-specific fields we'll compute from API data
  recipientName?: string;
  issuer?: {
    name: string;
    organization: string;
  };
  courseName?: string;
  instructor?: {
    name: string;
    avatar?: string;
  };
  completedDate?: string;
  verificationLink?: string;
  hours?: number;
}

export default function CertificateDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<CertificateDisplay | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"valid" | "invalid" | null>(null);
  
  useEffect(() => {
    async function fetchCertificate() {
      if (!params.id) return;
      if (!user || !user._id) {
        console.log('User not authenticated, waiting for auth');
        return; // Wait for user to be authenticated
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching certificate with ID:', params.id);
        const response = await getCertificateById(params.id);
        console.log('Certificate API response:', response);
        
        if (response && response.certificate) {
          console.log('Certificate found:', response.certificate);
          // Transform API response to our display model
          const certificateData = {
            ...response.certificate,
            issuedDate: response.certificate.issueDate || response.certificate.issuedDate,
            recipientName: user?.name || 'Student',
            courseName: response.certificate.courseId?.title || 
                       response.certificate.course?.title || 
                       response.certificate.title,
            issuer: {
              name: 'EduConnect',
              organization: 'EduConnect Learning Platform'
            }
          };
          setCertificate(certificateData as unknown as CertificateDisplay);
        } else {
          console.log('No certificate data in response');
          setError("Certificate not found. Please check the certificate ID and try again.");
        }
      } catch (err: unknown) {
        console.error("Failed to fetch certificate:", err);
        
        // Type guard for axios error response structure
        interface ApiError {
          response?: {
            status: number;
            data?: { message: string };
          };
        }
        
        // Provide more specific error messages based on the error
        const apiError = err as ApiError;
        if (apiError.response) {
          if (apiError.response.status === 401) {
            setError("You must be logged in to view this certificate.");
          } else if (apiError.response.status === 403) {
            setError("You are not authorized to view this certificate.");
          } else if (apiError.response.status === 404) {
            setError("Certificate not found. It may have been removed or the ID is incorrect.");
          } else {
            setError(`Error: ${apiError.response.data?.message || 'Failed to load certificate. Please try again later.'}`);
          }
        } else {
          setError("Failed to connect to the server. Please check your internet connection and try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCertificate();
  }, [params.id, user]);
  
  // Function to download certificate as PDF
  const downloadAsPDF = () => {
    // This would be implemented with a PDF library like jsPDF or html2pdf
    toast({
      title: "Download started",
      description: "Your certificate is being downloaded as a PDF."
    });
    
    // For now, we'll just simulate the download with a timeout
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Certificate has been downloaded successfully."
      });
    }, 1500);
  };
  
  // Function to verify certificate
  const handleVerify = async () => {
    if (!certificate) return;
    
    try {
      setIsVerifying(true);
      const response = await verifyCertificate(certificate.credentialId);
      
      if (response && response.valid) {
        setVerificationStatus("valid");
        toast({
          title: "Certificate verified",
          description: "This certificate is valid and authentic."
        });
      } else {
        setVerificationStatus("invalid");
        toast({
          title: "Verification failed",
          description: "This certificate could not be verified.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Failed to verify certificate:", err);
      toast({
        title: "Verification error",
        description: "An error occurred while verifying the certificate.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Function to copy verification link to clipboard
  const copyVerificationLink = () => {
    if (!certificate) return;
    
    const verificationLink = certificate.verificationLink || 
      `${window.location.origin}/verify-certificate/${certificate.credentialId}`;
    
    navigator.clipboard.writeText(verificationLink)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Certificate verification link copied to clipboard"
        });
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
        toast({
          title: "Copy failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive"
        });
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
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/certificates">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyVerificationLink} 
              disabled={isLoading || !certificate}
            >
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleVerify} 
              disabled={isLoading || !certificate || isVerifying}
            >
              {isVerifying ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Shield className="mr-1 h-4 w-4" />
              )}
              Verify
            </Button>
            {/* <Button 
              size="sm" 
              onClick={downloadAsPDF} 
              disabled={isLoading || !certificate}
            >
              <Download className="mr-1 h-4 w-4" />
              Download
            </Button> */}
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          {isLoading ? (
            <div className="flex h-80 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading certificate...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : certificate ? (
            /* Certificate Design */
            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg print:shadow-none">
              {verificationStatus === "valid" && (
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-green-600">
                    <Shield className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50"></div>

              {/* Certificate Border */}
              <div className="relative border-8 border-double border-primary/20 p-8 md:p-12">
                {/* Certificate Content */}
                <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <GraduationCap className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold uppercase tracking-wider text-primary md:text-3xl">EduConnect</h1>
                    <div className="h-1 w-40 bg-primary/20 mx-auto"></div>
                    <h2 className="text-xl font-semibold md:text-2xl">Certificate of Completion</h2>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-4 py-6">
                    <p className="text-lg text-muted-foreground">This certifies that</p>
                    <p className="text-2xl font-bold md:text-3xl">{certificate.recipientName}</p>
                    <p className="text-lg text-muted-foreground">has successfully completed</p>
                    <p className="text-xl font-semibold md:text-2xl">{certificate.title || certificate.courseName}</p>
                    <p className="text-lg text-muted-foreground">with a score of</p>
                    <p className="text-xl font-bold md:text-2xl">{certificate.score}%</p>
                    <p className="text-base text-muted-foreground">
                      {certificate.hours ? `A ${certificate.hours}-hour course` : "Course"} taught by {certificate.instructor?.name || "Expert Instructor"}
                    </p>
                  </div>

                  {/* Date and Signatures */}
                  <div className="w-full space-y-6 pt-6">
                    <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:justify-between md:space-y-0">
                      <div className="text-center">
                        <div className="h-px w-40 bg-gray-300"></div>
                        <p className="mt-1 text-sm">Date: {format(new Date(certificate.issueDate), 'PP')}</p>
                      </div>
                      <div className="text-center">
                        <div className="h-px w-40 bg-gray-300"></div>
                        <p className="mt-1 text-sm">{certificate.issuer?.name || "Instructor"} Signature</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="w-full pt-6 text-center">
                    <p className="text-xs text-muted-foreground">Certificate ID: {certificate.credentialId}</p>
                    <p className="text-xs text-muted-foreground">
                      Verify this certificate at {window.location.origin}/verify-certificate/{certificate.credentialId}
                    </p>
                    <div className="mt-2 flex justify-center">
                      <QrCode className="h-16 w-16 text-gray-300" />
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-8 border-primary/10 -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full border-8 border-primary/10 translate-x-1/2 translate-y-1/2"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center text-center">
              <div>
                <h3 className="text-lg font-semibold">Certificate not found</h3>
                <p className="text-muted-foreground">The requested certificate could not be found.</p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/dashboard/certificates">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to certificates
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
