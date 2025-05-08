import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Student Tutor App",
  description: "Student dashboard for the Student Tutor App",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
