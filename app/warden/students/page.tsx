"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import API from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Student {
  _id: string;
  user: { name: string; email: string };
  regNo: string;
  department?: string;
  year?: string;
  phone?: string;
  parentPhone?: string;
  room?: { block: string; roomNumber: string };
  feeStatus?: string;
}

function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRegNo, setEditRegNo] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editParentPhone, setEditParentPhone] = useState("");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [feeStatusFilter, setFeeStatusFilter] = useState("");

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    try {
      const res = await API.get("/students");
      setStudents(res.data);
      setLoading(false);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setError("You do not have permission to view students. Please login as warden.");
      } else {
        setError("An error occurred while fetching students.");
      }
      setLoading(false);
    }
  };

  // Delete student
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
      toast.success("Student deleted successfully!");
    } catch (error: any) {
      toast("Error deleting student");
    }
  };

  // Edit student
  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setEditName(student.user.name);
    setEditEmail(student.user.email);
    setEditRegNo(student.regNo);
    setEditDepartment(student.department || "");
    setEditYear(student.year?.toString() || "");
    setEditPhone(student.phone || "");
    setEditParentPhone(student.parentPhone || "");
    setShowEditModal(true);
  };

  // Submit edit
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    try {
      await API.put(`/students/${selectedStudent._id}`, {
        name: editName,
        email: editEmail,
        regNo: editRegNo,
        department: editDepartment,
        year: editYear,
        phone: editPhone,
      
      });
      setShowEditModal(false);
      fetchStudents();
      toast.success("Student updated successfully!");
    } catch (error: any) {
      toast("Error updating student");
    }
  };

  // Update fee status
  const updateFeeStatus = async (id: string, feeStatus: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    try {
      await API.put(`/students/${id}/fee`, { feeStatus });
      setStudents(students.map((s: any) => s._id === id ? { ...s, feeStatus } : s));
      toast.success("Fee status updated successfully!");
    } catch (error: any) {
      toast("Error updating fee status");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => students.filter((student) => {
    const matchesSearch =
      !search ||
      student.user.name.toLowerCase().includes(search.toLowerCase()) ||
      student.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = !departmentFilter || student.department === departmentFilter;
    const matchesYear = !yearFilter || student.year?.toString() === yearFilter;
    const matchesFeeStatus = !feeStatusFilter || (student.feeStatus || "unpaid") === feeStatusFilter;
    return matchesSearch && matchesDepartment && matchesYear && matchesFeeStatus;
  }), [students, search, departmentFilter, yearFilter, feeStatusFilter]);

  const getFeeStatusBadge = (status: string) => {
    const variants: any = {
      paid: { variant: "default", className: "bg-green-900 text-green-200 border border-green-700" },
      unpaid: { variant: "default", className: "bg-red-900 text-red-200 border border-red-700" },
    };
    const config = variants[status] || variants.unpaid;
    return (
      <Badge className={config.className}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-red-900 border border-red-700 text-red-200 p-6 rounded-xl max-w-md">
          <div className="text-center">
            <div className="text-red-200 font-medium mb-2">Access Denied</div>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Student Management</h1>
            <p className="text-gray-400 text-lg">Manage student records and assignments</p>
          </div>
          <Link href="/warden/students/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Plus className="w-5 h-5 mr-2" />
              Add Student
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select value={departmentFilter || "all"} onValueChange={(value) => setDepartmentFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-600">All Departments</SelectItem>
                <SelectItem value="Computer Science" className="text-white hover:bg-gray-600">CSE</SelectItem>
                <SelectItem value="Electrical Engineering" className="text-white hover:bg-gray-600">ECE</SelectItem>
                <SelectItem value="Electrical Engineering" className="text-white hover:bg-gray-600">EEE</SelectItem>
                <SelectItem value="Mechanical Engineering" className="text-white hover:bg-gray-600">ME</SelectItem>
                <SelectItem value="Civil Engineering" className="text-white hover:bg-gray-600">CE</SelectItem>
              </SelectContent>
            </Select>
            <Select value={yearFilter || "all"} onValueChange={(value) => setYearFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-600">All Years</SelectItem>
                <SelectItem value="1" className="text-white hover:bg-gray-600">1st Year</SelectItem>
                <SelectItem value="2" className="text-white hover:bg-gray-600">2nd Year</SelectItem>
                <SelectItem value="3" className="text-white hover:bg-gray-600">3rd Year</SelectItem>
                <SelectItem value="4" className="text-white hover:bg-gray-600">4th Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={feeStatusFilter || "all"} onValueChange={(value) => setFeeStatusFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="All Fee Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-600">All Status</SelectItem>
                <SelectItem value="paid" className="text-white hover:bg-gray-600">Paid</SelectItem>
                <SelectItem value="unpaid" className="text-white hover:bg-gray-600">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-700 hover:bg-gray-700 border-gray-600">
                <TableHead className="text-gray-200 font-semibold">Name</TableHead>
                <TableHead className="text-gray-200 font-semibold">Email</TableHead>
                <TableHead className="text-gray-200 font-semibold">Reg No</TableHead>
                <TableHead className="text-gray-200 font-semibold">Department</TableHead>
                <TableHead className="text-gray-200 font-semibold">Year</TableHead>
                <TableHead className="text-gray-200 font-semibold">Room</TableHead>
                <TableHead className="text-gray-200 font-semibold">Fee Status</TableHead>
                <TableHead className="text-gray-200 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id} className="hover:bg-gray-700 border-gray-600 transition-colors">
                  <TableCell className="text-white font-medium">{student.user.name}</TableCell>
                  <TableCell className="text-gray-300">{student.user.email}</TableCell>
                  <TableCell className="text-white">{student.regNo}</TableCell>
                  <TableCell className="text-gray-300">{student.department || "N/A"}</TableCell>
                  <TableCell className="text-gray-300">{student.year ? `${student.year}st Year` : "N/A"}</TableCell>
                  <TableCell className="text-gray-300">
                    {student.room ? `${student.room.block}-${student.room.roomNumber}` : "Not Assigned"}
                  </TableCell>
                  <TableCell>
                    <select
                      value={student.feeStatus || "unpaid"}
                      onChange={(e) => updateFeeStatus(student._id, e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingStudent(student)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">Edit Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editName" className="text-gray-200">Name</Label>
                  <Input
                    id="editName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editEmail" className="text-gray-200">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editRegNo" className="text-gray-200">Registration Number</Label>
                  <Input
                    id="editRegNo"
                    value={editRegNo}
                    onChange={(e) => setEditRegNo(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editDepartment" className="text-gray-200">Department</Label>
                  <Select value={editDepartment} onValueChange={setEditDepartment}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="Computer Science" className="text-white hover:bg-gray-600">CSE</SelectItem>
                      <SelectItem value="Electrical Engineering" className="text-white hover:bg-gray-600">ECE</SelectItem>
                      <SelectItem value="Electrical Engineering" className="text-white hover:bg-gray-600">EEE</SelectItem>
                      <SelectItem value="Mechanical Engineering" className="text-white hover:bg-gray-600">ME</SelectItem>
                      <SelectItem value="Civil Engineering" className="text-white hover:bg-gray-600">CE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editYear" className="text-gray-200">Year</Label>
                  <Select value={editYear} onValueChange={setEditYear}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="1" className="text-white hover:bg-gray-600">1st Year</SelectItem>
                      <SelectItem value="2" className="text-white hover:bg-gray-600">2nd Year</SelectItem>
                      <SelectItem value="3" className="text-white hover:bg-gray-600">3rd Year</SelectItem>
                      <SelectItem value="4" className="text-white hover:bg-gray-600">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editPhone" className="text-gray-200">Phone</Label>
                  <Input
                    id="editPhone"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 mt-1"
                  />
                </div>
              
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  className="bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Update Student
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      {/* Delete Confirmation */}
      {deletingStudent && (
        <Dialog open={!!deletingStudent} onOpenChange={() => setDeletingStudent(null)}>
          <DialogContent className="bg-white border border-[#e2e8f0] rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#0a0a0a]">Delete Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-[#64748b]">
                Are you sure you want to delete {deletingStudent.user.name}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeletingStudent(null)}
                  className="border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleDelete(deletingStudent._id);
                    setDeletingStudent(null);
                  }}
                  className="bg-[#ef4444] hover:bg-[#dc2626] text-white flex-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  </div>
  );
}

export default Students;
