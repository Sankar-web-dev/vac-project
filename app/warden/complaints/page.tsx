"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, Eye } from "lucide-react";
import { toast } from "sonner";
import API from "@/lib/api";
import { LoadingIcon } from "@/components/ui/loading-icon";

interface Complaint {
  _id: string;
  student: { user: { name: string; email: string } };
  room?: string; // Optional, set to N/A if not available
  category: string;
  priority?: string; // Optional, default to Medium
  status: string;
  description: string;
  createdAt: string;
}

export default function WardenComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      try {
        const res = await API.get("/complaints");
        // Map API data to include optional fields with defaults
        const mappedComplaints = res.data.map((c: any) => ({
          ...c,
          id: c._id, // Add id for consistenc
          priority: c.priority || 'Medium',
          date: c.createdAt, // Alias for date
        }));
        setComplaints(mappedComplaints);
      } catch (error: any) {
        console.error("Error fetching complaints:", error);
        setError("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.student.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const classes: any = {
      pending: 'bg-yellow-900 text-yellow-200 border border-yellow-700',
      'in-progress': 'bg-blue-900 text-blue-200 border border-blue-700',
      resolved: 'bg-green-900 text-green-200 border border-green-700',
    };
    return <Badge className={classes[status] || 'bg-gray-900 text-gray-200'}>{status.replace('-', ' ')}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const classes: any = {
      High: 'bg-red-900 text-red-200 border border-red-700',
      Medium: 'bg-yellow-900 text-yellow-200 border border-yellow-700',
      Low: 'bg-gray-900 text-gray-200 border border-gray-700',
    };
    return <Badge className={classes[priority] || 'bg-gray-900 text-gray-200'}>{priority}</Badge>;
  };

  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    try {
      await API.put(`/complaints/${complaintId}`, { status: newStatus });
      setComplaints(complaints.map(c => c._id === complaintId ? { ...c, status: newStatus } : c));
      toast.success("Complaint status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 bg-gray-900 min-h-[400px] flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Complaint Management</h1>
        <p className="text-gray-400">Track and resolve student complaints</p>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-gray-800 border-gray-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by ID or student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-600">All Status</SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-gray-600">Pending</SelectItem>
                <SelectItem value="in-progress" className="text-white hover:bg-gray-600">In Progress</SelectItem>
                <SelectItem value="resolved" className="text-white hover:bg-gray-600">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gray-800 border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{complaints.length}</p>
            <p className="text-sm text-gray-400">Total</p>
          </div>
        </Card>
        <Card className="p-4 bg-gray-800 border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {complaints.filter(c => c.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-400">Pending</p>
          </div>
        </Card>
        <Card className="p-4 bg-gray-800 border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {complaints.filter(c => c.status === 'in-progress').length}
            </p>
            <p className="text-sm text-gray-400">In Progress</p>
          </div>
        </Card>
        <Card className="p-4 bg-gray-800 border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {complaints.filter(c => c.status === 'resolved').length}
            </p>
            <p className="text-sm text-gray-400">Resolved</p>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-gray-800 border-gray-700 p-4 mb-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-700 border-gray-600">
              <TableHead className="text-gray-300">ID</TableHead>
              <TableHead className="text-gray-300">Student</TableHead>
              
              <TableHead className="text-gray-300">Category</TableHead>
              <TableHead className="text-gray-300">Priority</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComplaints.map((complaint) => (
              <TableRow key={complaint._id} className="border-gray-700">
                <TableCell className="text-white">
                  <span className="font-medium text-blue-400">{complaint._id}</span>
                </TableCell>
                <TableCell className="text-white">{complaint.student.user.name}</TableCell>
                
                <TableCell className="text-white">{complaint.category}</TableCell>
                <TableCell className="text-white">{getPriorityBadge(complaint.priority || 'Medium')}</TableCell>
                <TableCell className="text-white">
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                    className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm font-medium cursor-pointer text-white hover:bg-gray-600 transition-colors"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </TableCell>
                <TableCell className="text-white">{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-white">
                
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* View Details Modal */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-white">Complaint Details</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Complaint ID</p>
                  <p className="font-semibold text-blue-400">{selectedComplaint._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Student</p>
                  <p className="font-semibold text-white">{selectedComplaint.student.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Room</p>
                  <p className="font-semibold text-white">{selectedComplaint.room}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Category</p>
                  <p className="font-semibold text-white">{selectedComplaint.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Priority</p>
                  {getPriorityBadge(selectedComplaint.priority || 'Medium')}
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  {getStatusBadge(selectedComplaint.status)}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Description</p>
                <p className="text-white p-4 bg-gray-700 rounded-xl">{selectedComplaint.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  Submitted on {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
