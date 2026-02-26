"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import API from "@/lib/api";
import { Home, Users, AlertCircle, Building, TrendingUp, DollarSign } from "lucide-react";

interface Stats {
  totalStudents: number;
  totalRooms: number;
  availableRooms: number;
  paidStudents: number;
  unpaidStudents: number;
  pendingComplaints: number;
}

function WardenDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      try {
        const res = await API.get("/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748b]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-[#64748b]">
          <p>Unable to load dashboard data</p>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    {
      icon: Building,
      label: 'Total Rooms',
      value: stats.totalRooms,
      subtitle: `${stats.availableRooms} available`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Home,
      label: 'Occupied Rooms',
      value: stats.totalRooms - stats.availableRooms,
      subtitle: `${Math.round(((stats.totalRooms - stats.availableRooms) / stats.totalRooms) * 100)}% occupancy`,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Users,
      label: 'Total Students',
      value: stats.totalStudents,
      subtitle: 'Enrolled students',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: AlertCircle,
      label: 'Pending Complaints',
      value: stats.pendingComplaints,
      subtitle: 'Awaiting resolution',
      color: 'from-orange-500 to-orange-600'
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#0a0a0a]">Warden Dashboard</h1>
        <p className="text-[#64748b]">Monitor and manage your hostel operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-[#e2e8f0] bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#64748b]">{stat.label}</p>
                    <p className="text-sm text-[#94a3b8]">{stat.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#0a0a0a]">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-[#e2e8f0] bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#0a0a0a] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#4f46e5]" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/warden/rooms" className="block">
              <Button className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl h-12">
                <Building className="w-4 h-4 mr-2" />
                Manage Rooms
              </Button>
            </Link>
            <Link href="/warden/students" className="block">
              <Button variant="outline" className="w-full border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white rounded-xl h-12">
                <Users className="w-4 h-4 mr-2" />
                Manage Students
              </Button>
            </Link>
            <Link href="/warden/complaints" className="block">
              <Button variant="outline" className="w-full border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white rounded-xl h-12">
                <AlertCircle className="w-4 h-4 mr-2" />
                Manage Complaints
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card className="border-[#e2e8f0] bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#0a0a0a] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#10b981]" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-[#64748b]">Paid Students</p>
                <p className="text-2xl font-bold text-[#10b981]">{stats.paidStudents}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[#64748b]">Unpaid Students</p>
                <p className="text-2xl font-bold text-[#ef4444]">{stats.unpaidStudents}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-[#e2e8f0]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#64748b]">Payment Rate</span>
                <span className="text-lg font-semibold text-[#0a0a0a]">
                  {stats.totalStudents > 0 ? Math.round((stats.paidStudents / stats.totalStudents) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default WardenDashboard;