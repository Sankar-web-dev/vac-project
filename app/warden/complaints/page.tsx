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
          id: c._id, // Add id for consistency
          room: c.room || 'N/A',
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
    const variants: any = {
      pending: 'warning',
      'in-progress': 'info',
      resolved: 'success',
    };
    return <Badge variant={variants[status]}>{status.replace('-', ' ')}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: any = {
      High: 'danger',
      Medium: 'warning',
      Low: 'default',
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0a0a0a] mb-2">Complaint Management</h1>
        <p className="text-[#64748b]">Track and resolve student complaints</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
            <Input
              placeholder="Search by ID or student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-[#64748b]" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#0a0a0a]">{complaints.length}</p>
            <p className="text-sm text-[#64748b]">Total</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {complaints.filter(c => c.status === 'pending').length}
            </p>
            <p className="text-sm text-[#64748b]">Pending</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {complaints.filter(c => c.status === 'in-progress').length}
            </p>
            <p className="text-sm text-[#64748b]">In Progress</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {complaints.filter(c => c.status === 'resolved').length}
            </p>
            <p className="text-sm text-[#64748b]">Resolved</p>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComplaints.map((complaint) => (
              <TableRow key={complaint._id}>
                <TableCell>
                  <span className="font-medium text-[#4f46e5]">{complaint._id}</span>
                </TableCell>
                <TableCell>{complaint.student.user.name}</TableCell>
                <TableCell>
                  <span className="font-medium">{complaint.room}</span>
                </TableCell>
                <TableCell>{complaint.category}</TableCell>
                <TableCell>{getPriorityBadge(complaint.priority || 'Medium')}</TableCell>
                <TableCell>
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                    className="px-3 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm font-medium cursor-pointer hover:bg-[#f1f5f9] transition-colors"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </TableCell>
                <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="p-2 text-[#64748b] hover:text-[#4f46e5] hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* View Details Modal */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#64748b] mb-1">Complaint ID</p>
                  <p className="font-semibold text-[#4f46e5]">{selectedComplaint._id}</p>
                </div>
                <div>
                  <p className="text-sm text-[#64748b] mb-1">Student</p>
                  <p className="font-semibold text-[#0a0a0a]">{selectedComplaint.student.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#64748b] mb-1">Room</p>
                  <p className="font-semibold text-[#0a0a0a]">{selectedComplaint.room}</p>
                </div>
                <div>
                  <p className="text-sm text-[#64748b] mb-1">Category</p>
                  <p className="font-semibold text-[#0a0a0a]">{selectedComplaint.category}</p>
                </div>
                <div>
                  <p className="text-sm text-[#64748b] mb-1">Priority</p>
                  {getPriorityBadge(selectedComplaint.priority || 'Medium')}
                </div>
                <div>
                  <p className="text-sm text-[#64748b] mb-1">Status</p>
                  {getStatusBadge(selectedComplaint.status)}
                </div>
              </div>
              <div>
                <p className="text-sm text-[#64748b] mb-2">Description</p>
                <p className="text-[#0a0a0a] p-4 bg-[#f8fafc] rounded-xl">{selectedComplaint.description}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748b]">
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
