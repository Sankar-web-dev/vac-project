"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

function CreateRoom() {
  const [roomNumber, setRoomNumber] = useState("");
  const [block, setBlock] = useState("A");
  const [floor, setFloor] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    try {
      await API.post("/rooms", {
        roomNumber,
        block,
        floor: parseInt(floor),
        capacity: parseInt(capacity)
      });

      setLoading(false);
      setShowSuccess(true);

      setTimeout(() => {
        router.push("/warden/rooms");
      }, 2000);

    } catch (error: any) {
      setLoading(false);
      toast("Error creating room: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-[#0a0a0a] leading-tight">Add New Room</h1>
        <p className="text-lg text-[#64748b] max-w-md mx-auto">Create a new room in the hostel</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-[#e2e8f0] bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#0a0a0a]">Room Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="block" className="text-[#64748b]">Block</Label>
                  <Select value={block} onValueChange={setBlock}>
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
                  <Label htmlFor="roomNumber" className="text-[#64748b]">Room Number</Label>
                  <Input
                    id="roomNumber"
                    type="text"
                    placeholder="e.g., 101"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                    className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor" className="text-[#64748b]">Floor</Label>
                  <Input
                    id="floor"
                    type="number"
                    placeholder="e.g., 1"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    min="1"
                    required
                    className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-[#64748b]">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="e.g., 3"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    min="1"
                    max="6"
                    required
                    className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Link href="/warden/rooms" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#4f46e5] hover:bg-[#4338ca] text-white"
                >
                  {loading ? "Creating..." : "Create Room"}
                </Button>
              </div>
            </form>
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
              <h3 className="text-xl font-bold text-[#0a0a0a]">Room Created!</h3>
              <p className="text-[#64748b]">
                The room has been successfully added to the system.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateRoom;