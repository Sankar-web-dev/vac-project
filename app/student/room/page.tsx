"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Users, Calendar, DollarSign } from "lucide-react";
import API from "@/lib/api";
import { LoadingIcon } from "@/components/ui/loading-icon";

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

export default function RoomInfo() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [roommates, setRoommates] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      try {
        const studentRes = await API.get("/students/me");
        setStudent(studentRes.data);

        // Fetch roommates
        const roommatesRes = await API.get('/students/roommates');
        setRoommates(roommatesRes.data);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError("Failed to load room information");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const roomDetails = student.room ? {
    block: student.room.block,
    roomNo: student.room.roomNumber,
    floor: 1, // Assuming floor is not in API, default to 1
    capacity: student.room.capacity,
    occupied: student.room.occupants?.length || 0,
    amenities: ['WiFi', 'Study Table', 'Wardrobe', 'Attached Bathroom'], // Default amenities
  } : null;



  if (!roomDetails) {
    return (
      <div className="text-center py-12">
        <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Room Assigned</h2>
        <p className="text-gray-400">You haven't been assigned a room yet. Please contact the warden.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Room Information</h1>
        <p className="text-gray-400">View your room details and roommate information</p>
      </div>

      <div className="">
        {/* Room Details */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Room Details</CardTitle>
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-bold text-blue-400">
                  {roomDetails.block}-{roomDetails.roomNo}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Block</p>
                <p className="text-xl font-bold text-white">{roomDetails.block}</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Room No</p>
                <p className="text-xl font-bold text-white">{roomDetails.roomNo}</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Floor</p>
                <p className="text-xl font-bold text-white">{roomDetails.floor}</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Occupancy</p>
                <p className="text-xl font-bold text-white">
                  {roomDetails.occupied}/{roomDetails.capacity}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {roomDetails.amenities.map((amenity, index) => (
                  <Badge key={index} className="bg-blue-600 text-white">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Roommates</h4>
              <div className="space-y-3">
                {roommates.length > 0 ? (
                  roommates.map((roommate) => (
                    <div
                      key={roommate._id}
                      className="flex items-center gap-4 p-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {roommate.user.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{roommate.user.name}</p>
                        <p className="text-sm text-gray-400">
                          {roommate.department} • Year {roommate.year}
                        </p>
                      </div>
                      <p className="text-sm text-gray-400">{roommate.phone}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No other roommates currently.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

       
      </div>
    </div>
  );
}
