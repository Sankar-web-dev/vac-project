"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import API from "@/lib/api";
import { LoadingIcon } from "@/components/ui/loading-icon";

interface Complaint {
  _id: string;
  category: string;
  status: string;
  description: string;
  createdAt: string;
}

export default function StudentComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      try {
        const res = await API.get("/complaints/me");
        setComplaints(res.data);
      } catch (error: any) {
        console.error("Error fetching complaints:", error);
        setError("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filteredComplaints = statusFilter === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === statusFilter);

  const getStatusBadge = (status: string) => {
    const classes: any = {
      pending: 'bg-yellow-900 text-yellow-200 border border-yellow-700',
      'in-progress': 'bg-blue-900 text-blue-200 border border-blue-700',
      resolved: 'bg-green-900 text-green-200 border border-green-700',
    };
    return <Badge className={classes[status] || 'bg-gray-900 text-gray-200'}>{status.replace('-', ' ')}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: any = {
      High: 'danger',
      Medium: 'warning',
      Low: 'default',
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Complaints</h1>
          <p className="text-gray-400">Track and manage your complaints</p>
        </div>
        <Link href="/student/complaints/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-5 h-5" />
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-gray-800 border-gray-700 mb-8">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="max-w-xs bg-gray-700 border-gray-600 text-white">
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
      </Card>

      {/* Table */}
      <Card className="bg-gray-800 border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-700 border-gray-600">
              <TableHead className="text-gray-300">ID</TableHead>
              <TableHead className="text-gray-300">Category</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComplaints.map((complaint) => (
              <TableRow key={complaint._id} className="border-gray-700">
                <TableCell className="text-white">
                  <span className="font-medium text-blue-400">{complaint._id}</span>
                </TableCell>
                <TableCell className="text-white">{getStatusBadge(complaint.category)}</TableCell>
                <TableCell className="text-white">{getStatusBadge(complaint.status)}</TableCell>
                <TableCell className="text-white">{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-white max-w-xs truncate">{complaint.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
