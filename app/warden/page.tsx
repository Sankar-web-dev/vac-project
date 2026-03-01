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
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-gray-400">
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Welcome Section */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-white">Warden Dashboard</h1>
        <p className="text-gray-400">Monitor and manage your hostel operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-gray-700 bg-gray-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                    <p className="text-sm text-gray-300">{stat.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/warden/rooms" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12">
                <Building className="w-4 h-4 mr-2" />
                Manage Rooms
              </Button>
            </Link>
            <Link href="/warden/students" className="block">
              <Button className="w-full border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white rounded-xl h-12">
                <Users className="w-4 h-4 mr-2" />
                Manage Students
              </Button>
            </Link>
            <Link href="/warden/complaints" className="block">
              <Button className="w-full border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white rounded-xl h-12">
                <AlertCircle className="w-4 h-4 mr-2" />
                Manage Complaints
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Paid Students</p>
                <p className="text-2xl font-bold text-green-400">{stats.paidStudents}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Unpaid Students</p>
                <p className="text-2xl font-bold text-red-400">{stats.unpaidStudents}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Payment Rate</span>
                <span className="text-lg font-semibold text-white">
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