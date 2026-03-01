"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building, Mail, User, Edit, Phone, DollarSign } from "lucide-react";
import API from "@/lib/api";
import { LoadingIcon } from "@/components/ui/loading-icon";

interface StudentProfile {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  regNo: string;
  department?: string;
  year?: number;
  phone?: string;
  parentPhone?: string;
  room: {
    roomNumber: string;
    block: string;
  };
  feeStatus: string;
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      try {
        const res = await API.get("/students/me");
        setProfile(res.data);
        setEditData({ name: res.data.user.name, email: res.data.user.email });
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    // TODO: Implement profile update API
    setIsEditing(false);
  };

  const getFeeBadge = (status: string) => {
    const variants: any = {
      paid: 'success',
      pending: 'warning',
      overdue: 'danger',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-gray-400">
          No profile data available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {profile.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-gray-400">View and manage your profile information</p>
          </div>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
          
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Card */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-700 p-6 rounded-xl border border-gray-600">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-400" />
                Personal Details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-sm font-medium text-gray-400">Name</span>
                  <span className="text-white font-medium">{profile.user.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-sm font-medium text-gray-400">Email</span>
                  <span className="text-white flex items-center gap-1">
                    <Mail className="w-4 h-4 text-blue-400" />
                    {profile.user.email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-sm font-medium text-gray-400">Registration Number</span>
                  <span className="text-white font-medium">{profile.regNo}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-sm font-medium text-gray-400">Department</span>
                  <span className="text-white font-medium">{profile.department || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-sm font-medium text-gray-400">Year</span>
                  <span className="text-white font-medium">{profile.year || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-sm font-medium text-gray-400">Phone</span>
                  <span className="text-white flex items-center gap-1 font-medium">
                    <Phone className="w-4 h-4 text-blue-400" />
                    {profile.phone || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-400">Parent Phone</span>
                  <span className="text-white flex items-center gap-1 font-medium">
                    <Phone className="w-4 h-4 text-blue-400" />
                    {profile.parentPhone || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div className="bg-gray-700 p-6 rounded-xl border border-gray-600">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-green-400" />
                Room Details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-sm font-medium text-gray-400">Room Number</span>
                  <span className="text-white font-medium">{profile.room.roomNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-sm font-medium text-gray-400">Block</span>
                  <span className="text-white font-medium">{profile.room.block}</span>
                </div>
              </div>
            </div>

            {/* Fee Status */}
            <div className="bg-gray-700 p-6 rounded-xl border border-gray-600">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                Fee Status
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-400">Current Status</span>
                {getFeeBadge(profile.feeStatus)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
