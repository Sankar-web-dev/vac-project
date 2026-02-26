"use client";

import { useEffect, useState } from "react";
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
    if (window.confirm("Are you sure you want to delete this student?")) {
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
        parentPhone: editParentPhone
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

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      !search ||
      student.user.name.toLowerCase().includes(search.toLowerCase()) ||
      student.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = !departmentFilter || student.department === departmentFilter;
    const matchesYear = !yearFilter || student.year?.toString() === yearFilter;
    const matchesFeeStatus = !feeStatusFilter || student.feeStatus === feeStatusFilter;
    return matchesSearch && matchesDepartment && matchesYear && matchesFeeStatus;
  });

  const getFeeStatusBadge = (status: string) => {
    const variants: any = {
      paid: { variant: "default", className: "bg-green-50 text-green-700 border border-green-200" },
      pending: { variant: "default", className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
      overdue: { variant: "default", className: "bg-red-50 text-red-700 border border-red-200" },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge className={config.className}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md border border-red-200 bg-red-50">
          <CardContent className="text-center p-6">
            <div className="text-red-600 font-medium mb-2">Access Denied</div>
            <p className="text-red-700 text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a0a] mb-2">Student Management</h1>
          <p className="text-[#64748b]">Manage student records and assignments</p>
        </div>
        <Link href="/warden/students/new">
          <Button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            Add Student
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-[#e2e8f0] bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
              />
            </div>
            <Select value={departmentFilter || "all"} onValueChange={(value) => setDepartmentFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="ME">ME</SelectItem>
                <SelectItem value="CE">CE</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
              </SelectContent>
            </Select>
            <Select value={yearFilter || "all"} onValueChange={(value) => setYearFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
            <Select value={feeStatusFilter || "all"} onValueChange={(value) => setFeeStatusFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]">
                <SelectValue placeholder="All Fee Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fee Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-[#e2e8f0] bg-white/70 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
              <TableHead className="text-[#0a0a0a] font-semibold">Name</TableHead>
              <TableHead className="text-[#0a0a0a] font-semibold">Email</TableHead>
              <TableHead className="text-[#0a0a0a] font-semibold">Department</TableHead>
              <TableHead className="text-[#0a0a0a] font-semibold">Year</TableHead>
              <TableHead className="text-[#0a0a0a] font-semibold">Room</TableHead>
              <TableHead className="text-[#0a0a0a] font-semibold">Fee Status</TableHead>
              <TableHead className="text-[#0a0a0a] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student: any) => (
              <TableRow key={student._id} className="hover:bg-[#f8fafc] transition-colors">
                <TableCell>
                  <span className="font-medium text-[#0a0a0a]">{student.user.name}</span>
                </TableCell>
                <TableCell className="text-[#64748b]">{student.user.email}</TableCell>
                <TableCell className="text-[#64748b]">{student.department || "-"}</TableCell>
                <TableCell className="text-[#64748b]">Year {student.year || "-"}</TableCell>
                <TableCell>
                  {student.room ? (
                    <span className="font-medium text-[#4f46e5]">
                      {student.room.block}-{student.room.roomNumber}
                    </span>
                  ) : (
                    <span className="text-[#64748b]">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={student.feeStatus || "unpaid"}
                    onValueChange={(value) => updateFeeStatus(student._id, value)}
                  >
                    <SelectTrigger className="w-28 border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="p-2 text-[#64748b] hover:text-[#4f46e5] hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingStudent(student)}
                      className="p-2 text-[#64748b] hover:text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-white border border-[#e2e8f0] rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0a0a0a]">Edit Student</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName" className="text-[#64748b]">Name</Label>
              <Input
                id="editName"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editEmail" className="text-[#64748b]">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
                className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editRegNo" className="text-[#64748b]">Registration Number</Label>
              <Input
                id="editRegNo"
                type="text"
                value={editRegNo}
                onChange={(e) => setEditRegNo(e.target.value)}
                required
                className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editDepartment" className="text-[#64748b]">Department</Label>
              <Select value={editDepartment} onValueChange={setEditDepartment}>
                <SelectTrigger className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="ME">ME</SelectItem>
                  <SelectItem value="CE">CE</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editYear" className="text-[#64748b]">Year</Label>
              <Select value={editYear} onValueChange={setEditYear}>
                <SelectTrigger className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editPhone" className="text-[#64748b]">Phone</Label>
              <Input
                id="editPhone"
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editParentPhone" className="text-[#64748b]">Parent Phone</Label>
              <Input
                id="editParentPhone"
                type="text"
                value={editParentPhone}
                onChange={(e) => setEditParentPhone(e.target.value)}
                className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
              />
            </div>

            <DialogFooter className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#4f46e5] hover:bg-[#4338ca] text-white flex-1"
              >
                Save Changes
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
  );
}

export default Students;
