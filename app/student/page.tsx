"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Users, AlertCircle, Plus } from "lucide-react";
import API from "@/lib/api";
import { LoadingIcon } from "@/components/ui/loading-icon";

interface Complaint {
  _id: string;
  category: string;
  status: string;
  priority?: string;
  createdAt: string;
}

interface Student {
  user: { name: string; email: string };
  room?: { block: string; roomNumber: string; capacity: number; occupants?: any[] };
  regNo: string;
  department: string;
  year: string;
  phone: string;
  parentPhone: string;
  feeStatus?: string;
}

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      try {
        const studentRes = await API.get("/students/me");
        setStudent(studentRes.data);

        // Fetch student's complaints
        try {
          const complaintsRes = await API.get("/complaints/me");
          setComplaints(complaintsRes.data);
        } catch (complaintsError) {
          console.error("Error fetching complaints:", complaintsError);
          setComplaints([]); // Set empty if fails
        }
      } catch (error: any) {
        console.error("Error fetching student data:", error);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    const classes: any = {
      pending: 'bg-yellow-900 text-yellow-200 border border-yellow-700',
      'in-progress': 'bg-blue-900 text-blue-200 border border-blue-700',
      resolved: 'bg-green-900 text-green-200 border border-green-700',
    };
    return <Badge className={classes[status] || 'bg-gray-900 text-gray-200'}>{status.replace('-', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-red-400">
          {error || "Failed to load student data"}
        </div>
      </div>
    );
  }

  const roomInfo = student.room ? {
    block: student.room.block,
    roomNo: student.room.roomNumber,
    floor: '1', // Assuming floor is not in API, default to 1
    capacity: student.room.capacity,
    occupied: student.room.occupants?.length || 0,
  } : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {student.user.name}!</h1>
        <p className="text-gray-400">Here's what's happening with your hostel stay today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Room Number</p>
              <p className="text-2xl font-bold text-white">
                {roomInfo ? `${roomInfo.block}-${roomInfo.roomNo}` : 'Not Assigned'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Roommates</p>
              <p className="text-2xl font-bold text-white">
                {roomInfo ? `${roomInfo.occupied}/${roomInfo.capacity}` : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Complaints</p>
              <p className="text-2xl font-bold text-white">
                {complaints.filter(c => c.status !== 'resolved').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Details */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Room Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roomInfo ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Block</p>
                    <p className="text-lg font-semibold text-white">{roomInfo.block}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Room Number</p>
                    <p className="text-lg font-semibold text-white">{roomInfo.roomNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Floor</p>
                    <p className="text-lg font-semibold text-white">{roomInfo.floor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Capacity</p>
                    <p className="text-lg font-semibold text-white">{roomInfo.capacity} Students</p>
                  </div>
                </div>
                <Link href="/student/room">
                  <Button className="w-full bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600">
                    View Full Details
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-center text-gray-400">No room assigned yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Complaints</CardTitle>
            <Link href="/student/complaints/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                <Plus className="w-4 h-4" />
                New
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {complaints.length > 0 ? (
              <>
                {complaints.slice(0, 3).map((complaint) => (
                  <div
                    key={complaint._id}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-white">{complaint._id}</p>
                      <p className="text-sm text-gray-400">{complaint.category}</p>
                    </div>
                    {getStatusBadge(complaint.status)}
                  </div>
                ))}
                <Link href="/student/complaints">
                  <Button className="w-full bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600">
                    View All Complaints
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-center text-gray-400 py-8">
                No complaints yet. Create your first complaint to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
