"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

function CreateStudent() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    name: "",
    email: "",
    phone: "",
    address: "",
    // Step 2: Academic Details
    department: "Computer Science",
    year: "1",
    regNo: "",
    // Step 3: Room Assignment
    password: "123456", // Default password
    parentPhone: "",
    roomId: ""
  });
  const router = useRouter();

  // Fetch rooms
  const fetchRooms = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    try {
      const res = await API.get("/rooms");
      setRooms(res.data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  // Handle submit
  const handleSubmit = async () => {
    setSubmitting(true);

    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    try {
      await API.post("/students", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        regNo: formData.regNo,
        department: formData.department,
        year: parseInt(formData.year),
        phone: formData.phone,
        parentPhone: formData.parentPhone,
        roomId: formData.roomId
      });

      setSubmitting(false);
      setShowSuccess(true);
      toast.success("Student created successfully!");
      
      setTimeout(() => {
        router.push("/warden/students");
      }, 2000);

    } catch (error: any) {
      setSubmitting(false);
      toast("Error creating student: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Academic Details' },
    { number: 3, title: 'Room Assignment' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0a0a0a] mb-2">Add New Student</h1>
        <p className="text-[#64748b]">Complete the form to register a new student</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((s, index) => (
          <div key={s.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                ${step >= s.number
                  ? 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-[#f1f5f9] text-[#64748b]'
                }
              `}>
                {s.number}
              </div>
              <span className={`mt-2 text-sm font-medium ${step >= s.number ? 'text-[#4f46e5]' : 'text-[#64748b]'}`}>
                {s.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-4 ${step > s.number ? 'bg-[#4f46e5]' : 'bg-[#e2e8f0]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-[#e2e8f0] bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#0a0a0a]">{steps[step - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#64748b]">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#64748b]">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#64748b]">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[#64748b]">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St, City, Country"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                    />
                  </div>
                </>
              )}

              {/* Step 2: Academic Details */}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-[#64748b]">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                      <SelectTrigger id="department" className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-[#64748b]">Year</Label>
                      <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                        <SelectTrigger id="year" className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Year 1</SelectItem>
                          <SelectItem value="2">Year 2</SelectItem>
                          <SelectItem value="3">Year 3</SelectItem>
                          <SelectItem value="4">Year 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regNo" className="text-[#64748b]">Registration Number</Label>
                      <Input
                        id="regNo"
                        placeholder="CS2026001"
                        value={formData.regNo}
                        onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                        required
                        className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Room Assignment */}
              {step === 3 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[#64748b]">Block</Label>
                      <Select value={formData.roomId ? rooms.find((r: any) => r._id === formData.roomId)?.block || "A" : "A"} onValueChange={(value) => {
                        // Find first available room in selected block
                        const availableRoom = rooms.find((r: any) => r.block === value && r.occupants.length < r.capacity);
                        setFormData({ ...formData, roomId: availableRoom?._id || "" });
                      }}>
                        <SelectTrigger className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]">
                          <SelectValue placeholder="Select block" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Block A</SelectItem>
                          <SelectItem value="B">Block B</SelectItem>
                          <SelectItem value="C">Block C</SelectItem>
                          <SelectItem value="D">Block D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#64748b]">Room Number</Label>
                      <Select value={formData.roomId} onValueChange={(value) => setFormData({ ...formData, roomId: value })}>
                        <SelectTrigger className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]">
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.filter((room: any) => room.occupants.length < room.capacity).map((room: any) => (
                            <SelectItem key={room._id} value={room._id}>
                              {room.block} - {room.roomNumber} ({room.occupants.length}/{room.capacity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <p className="text-sm text-indigo-700">
                      <strong>Note:</strong> Make sure the selected room has available capacity before assigning.
                    </p>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    className="flex-1 border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-[#4f46e5] hover:bg-[#4338ca] text-white"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-[#4f46e5] hover:bg-[#4338ca] text-white"
                  >
                    {submitting ? "Creating..." : "Create Student"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={() => setShowSuccess(false)}>
        <DialogContent className="bg-white border border-[#e2e8f0] rounded-2xl max-w-sm">
          <div className="text-center space-y-4 py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#0a0a0a]">Student Registered!</h3>
              <p className="text-[#64748b]">
                The student has been successfully added to the system.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateStudent;