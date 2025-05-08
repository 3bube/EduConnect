"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Download, FileText, GraduationCap, Loader2, Search, Share2, User } from "lucide-react";
import { getUserCertificates, Certificate as CertificateType } from "@/api/certificate";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

export default function StudentCertificatesPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<CertificateType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    async function fetchCertificates() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching certificates for user:', user?._id);
        const response = await getUserCertificates();
        console.log('Certificate response:', response);
        
        if (response && response.certificates) {
          console.log('Certificates found:', response.certificates.length);
          setCertificates(response.certificates);
        } else {
          console.log('No certificates found in response');
          // For development, set mock certificates if none are found
          if (process.env.NODE_ENV !== 'production') {
            const mockCertificates = [
              {
                _id: 'mock-cert-1',
                title: 'JavaScript Fundamentals',
                course: { title: 'Web Development Basics', _id: 'course-1' },
                assessmentTitle: 'JavaScript Assessment',
                instructor: { name: 'John Doe' },
                issuedDate: new Date().toISOString(),
                credentialId: 'CERT-JS-2025-001',
                score: 95,
                skills: ['JavaScript', 'ES6', 'DOM Manipulation'],
                status: 'issued'
              }
            ];
            setCertificates(mockCertificates as CertificateType[]);
            console.log('Set mock certificates for development');
          }
        }
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
        setError("Failed to load certificates. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCertificates();
  }, [user]);
  
  // Filter certificates based on search query
  const filteredCertificates = certificates.filter((certificate) => {
    if (!searchQuery) return true;
    
    return (
      certificate.course?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      certificate.assessmentTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span>EduConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
      <aside className="hidden w-[250px] flex-col border-r md:flex">
          <div className="flex h-14 items-center border-b px-4 font-medium">Student Dashboard</div>
          <nav className="grid gap-1 p-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium"
            >
              <BookOpen className="h-4 w-4" />
              My Courses
            </Link>
            <Link
              href="/dashboard/browse"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              Browse Courses
            </Link>
            <Link
              href="/dashboard/assessments"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              Assessments
            </Link>
            {/* <Link
              href="/dashboard/results"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              Results
            </Link> */}
            <Link
              href="/dashboard/certificates"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <path d="M13 2v7h7" />
              </svg>
              Certificates
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">My Certificates</h1>
                <p className="text-muted-foreground">View and download your course completion certificates</p>
              </div>
              <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search certificates..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex h-60 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading certificates...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : filteredCertificates.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center mt-8">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    {searchQuery ? "No certificates match your search" : "No certificates earned yet"}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchQuery 
                      ? "Try a different search term or clear the search field"
                      : "Complete course assessments to earn certificates"}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>Clear Search</Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCertificates.map((certificate) => (
                  <Card key={certificate._id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="bg-primary p-4 text-primary-foreground">
                        <CardTitle className="text-center">Certificate of Completion</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold">{certificate.course?.title || certificate.assessmentTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            Instructor: {certificate.instructor?.name || "Unknown"}
                          </p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Issue Date:</span>
                            <span>{format(new Date(certificate.issuedDate || certificate.issueDate || new Date()), 'PP')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Credential ID:</span>
                            <span className="font-mono text-xs">{certificate.credentialId.substring(0, 10)}...</span>
                          </div>
                          {certificate.score && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Score:</span>
                              <span>{certificate.score}%</span>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between gap-2 pt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/verify-certificate/${certificate.credentialId}`}>
                              <Share2 className="mr-1 h-4 w-4" />
                              Share
                            </Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/dashboard/certificates/${certificate.credentialId}`}>
                              <Download className="mr-1 h-4 w-4" />
                              View Certificate
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
