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
    const variants: any = {
      pending: 'warning',
      'in-progress': 'info',
      resolved: 'success',
    };
    return <Badge variant={variants[status]}>{status.replace('-', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingIcon />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="text-center text-red-600">
        {error || "Failed to load student data"}
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0a0a0a] mb-2">Welcome back, {student.user.name}!</h1>
        <p className="text-[#64748b]">Here's what's happening with your hostel stay today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#64748b]">Room Number</p>
              <p className="text-2xl font-bold text-[#0a0a0a]">
                {roomInfo ? `${roomInfo.block}-${roomInfo.roomNo}` : 'Not Assigned'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#64748b]">Roommates</p>
              <p className="text-2xl font-bold text-[#0a0a0a]">
                {roomInfo ? `${roomInfo.occupied}/${roomInfo.capacity}` : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#64748b]">Active Complaints</p>
              <p className="text-2xl font-bold text-[#0a0a0a]">
                {complaints.filter(c => c.status !== 'resolved').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Details */}
        <Card>
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roomInfo ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#64748b] mb-1">Block</p>
                    <p className="text-lg font-semibold text-[#0a0a0a]">{roomInfo.block}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748b] mb-1">Room Number</p>
                    <p className="text-lg font-semibold text-[#0a0a0a]">{roomInfo.roomNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748b] mb-1">Floor</p>
                    <p className="text-lg font-semibold text-[#0a0a0a]">{roomInfo.floor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748b] mb-1">Capacity</p>
                    <p className="text-lg font-semibold text-[#0a0a0a]">{roomInfo.capacity} Students</p>
                  </div>
                </div>
                <Link href="/student/room">
                  <Button variant="ghost" className="w-full">
                    View Full Details
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-center text-[#64748b]">No room assigned yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Complaints</CardTitle>
            <Link href="/student/complaints/new">
              <Button variant="default" size="sm">
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
                    className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl hover:bg-[#f1f5f9] transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-[#0a0a0a]">{complaint._id}</p>
                      <p className="text-sm text-[#64748b]">{complaint.category}</p>
                    </div>
                    {getStatusBadge(complaint.status)}
                  </div>
                ))}
                <Link href="/student/complaints">
                  <Button variant="ghost" className="w-full">
                    View All Complaints
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-center text-[#64748b]">No complaints yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
