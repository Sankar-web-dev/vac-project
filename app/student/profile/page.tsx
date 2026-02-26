"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building, Mail, User, Edit, Phone } from "lucide-react";
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
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingIcon />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-gray-600">
        No profile data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {profile.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0a0a0a] mb-2">My Profile</h1>
            <p className="text-[#64748b]">View and manage your profile information</p>
          </div>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
          
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setIsEditing(false)} variant="ghost" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-[#0a0a0a] flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                Personal Details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-sm font-medium text-[#64748b]">Name</span>
                  <span className="text-[#0a0a0a] font-medium">{profile.user.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-sm font-medium text-[#64748b]">Email</span>
                  <span className="text-[#0a0a0a] flex items-center gap-1">
                    <Mail className="w-4 h-4 text-blue-500" />
                    {profile.user.email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-sm font-medium text-[#64748b]">Registration Number</span>
                  <span className="text-[#0a0a0a] font-medium">{profile.regNo}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-sm font-medium text-[#64748b]">Department</span>
                  <span className="text-[#0a0a0a] font-medium">{profile.department || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-sm font-medium text-[#64748b]">Year</span>
                  <span className="text-[#0a0a0a] font-medium">{profile.year || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-sm font-medium text-[#64748b]">Phone</span>
                  <span className="text-[#0a0a0a] flex items-center gap-1 font-medium">
                    <Phone className="w-4 h-4 text-blue-500" />
                    {profile.phone || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-[#64748b]">Parent Phone</span>
                  <span className="text-[#0a0a0a] flex items-center gap-1 font-medium">
                    <Phone className="w-4 h-4 text-blue-500" />
                    {profile.parentPhone || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <h3 className="text-lg font-semibold text-[#0a0a0a] flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-green-600" />
                Room Details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex justify-between items-center py-2 border-b border-green-100">
                  <span className="text-sm font-medium text-[#64748b]">Room Number</span>
                  <span className="text-[#0a0a0a] font-medium">{profile.room.roomNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-100">
                  <span className="text-sm font-medium text-[#64748b]">Block</span>
                  <span className="text-[#0a0a0a] font-medium">{profile.room.block}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-[#64748b]">Fee Status</span>
                  {getFeeBadge(profile.feeStatus)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
