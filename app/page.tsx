"use client";

import Link from "next/link";
import { Building, Users, AlertCircle, Home, TrendingUp, Shield, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const stats = [
    { icon: Home, label: 'Total Rooms', value: '250+', color: 'from-blue-500 to-blue-600' },
    { icon: Users, label: 'Active Students', value: '800+', color: 'from-indigo-500 to-indigo-600' },
    { icon: AlertCircle, label: 'Resolved Issues', value: '1.2K+', color: 'from-purple-500 to-purple-600' },
  ];

  const features = [
    {
      icon: Home,
      title: 'Room Management',
      description: 'Efficiently manage room allocations, capacity, and availability with real-time updates.',
    },
    {
      icon: Users,
      title: 'Student Management',
      description: 'Maintain comprehensive student records, academic details, and room assignments.',
    },
    {
      icon: AlertCircle,
      title: 'Complaint Tracking',
      description: 'Track and resolve student complaints with priority-based workflow management.',
    },
    {
      icon: Shield,
      title: 'Role-based Access',
      description: 'Secure authentication with separate dashboards for students and wardens.',
    },
    {
      icon: TrendingUp,
      title: 'Fee Tracking',
      description: 'Monitor hostel fees, payment status, and generate financial reports effortlessly.',
    },
    {
      icon: BarChart,
      title: 'Analytics',
      description: 'Get insights with detailed analytics and reports for better decision making.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-indigo-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4f46e5] to-[#6366f1] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Building className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0a0a0a]">Hostel Management</span>
          </Link>
          <Link href="/login">
            <Button className="bg-indigo-600 hover:bg-indigo-700">Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-indigo-700">Modern Hostel Management Platform</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] leading-tight">
            Smart Hostel Management
            <br />
            <span className="bg-gradient-to-r from-[#4f46e5] to-[#6366f1] bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-[#64748b] max-w-2xl mx-auto">
            Streamline your hostel operations with our comprehensive platform for room allocation,
            student management, and complaint resolution—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-8">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-indigo-100 bg-white/70 backdrop-blur-sm">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#64748b]">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#0a0a0a]">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-[#0a0a0a]">Everything You Need</h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            Powerful features designed to make hostel management effortless and efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-indigo-100 bg-white/70 backdrop-blur-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0a0a0a]">{feature.title}</h3>
                  <p className="text-[#64748b] leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2e8f0] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4f46e5] to-[#6366f1] rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-[#0a0a0a]">Hostel Management System</span>
            </div>
            <p className="text-sm text-[#64748b]">
              2026 HMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}