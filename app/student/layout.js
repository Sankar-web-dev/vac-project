"use client";

import { Sidebar } from "@/components/Sidebar";

export default function StudentLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar role="student" />
      <div className="flex-1 lg:ml-0 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
