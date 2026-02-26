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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a0a] mb-2">My Complaints</h1>
          <p className="text-[#64748b]">Track and manage your complaints</p>
        </div>
        <Link href="/student/complaints/new">
          <Button>
            <Plus className="w-5 h-5" />
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-[#64748b]" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="max-w-xs">
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
      </Card>

      {/* Table */}
      <Card>
        {filteredComplaints.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Category</TableHead>
           
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint._id}>
                  <TableCell>
                    <span className="font-medium text-[#4f46e5]">{complaint._id}</span>
                  </TableCell>
                
                  <TableCell>{getStatusBadge(complaint.category)}</TableCell> 
                  <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                  <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-xs truncate">{complaint.description}</TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-[#64748b]" />
            </div>
            <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">No complaints found</h3>
            <p className="text-[#64748b]">Try adjusting your filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}
