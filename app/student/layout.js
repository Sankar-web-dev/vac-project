"use client";

import { Sidebar } from "@/components/Sidebar";

export default function StudentLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar role="student" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 pt-20 lg:pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
