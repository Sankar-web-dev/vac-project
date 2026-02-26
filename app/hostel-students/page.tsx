"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRegNo, setEditRegNo] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editParentPhone, setEditParentPhone] = useState("");
  const router = useRouter();

  // Fetch students
  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    try {
      const res = await API.get("/students");
      setStudents(res.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setError("You do not have permission to view students. Please login as warden.");
      } else {
        setError("An error occurred while fetching students.");
      }
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
    setEditYear(student.year || "");
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

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-purple-400 to-pink-500 p-4">
      {error ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">{error}</div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-6xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Student Management</CardTitle>
              <Button onClick={() => router.push("/hostel-students/new")}>
                Create Student
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Reg No</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Fee Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student: any) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.user.name}</TableCell>
                    <TableCell>{student.user.email}</TableCell>
                    <TableCell>{student.regNo}</TableCell>
                    <TableCell>{student.department || "-"}</TableCell>
                    <TableCell>{student.year || "-"}</TableCell>
                    <TableCell>{student.phone || "-"}</TableCell>
                    <TableCell>{student.room ? `${student.room.block} - ${student.room.roomNumber}` : "-"}</TableCell>
                    <TableCell>
                      <Select
                        value={student.feeStatus || "unpaid"}
                        onValueChange={(value) => updateFeeStatus(student._id, value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(student)} className="mr-2">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(student._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Name</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editRegNo">Registration Number</Label>
                <Input
                  id="editRegNo"
                  value={editRegNo}
                  onChange={(e) => setEditRegNo(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editDepartment">Department</Label>
                <Input
                  id="editDepartment"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editYear">Year</Label>
                <Input
                  id="editYear"
                  type="number"
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editPhone">Phone</Label>
                <Input
                  id="editPhone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editParentPhone">Parent Phone</Label>
                <Input
                  id="editParentPhone"
                  value={editParentPhone}
                  onChange={(e) => setEditParentPhone(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Students;