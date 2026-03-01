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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold text-white leading-tight">Add New Room</h1>
          <p className="text-xl text-gray-400 max-w-md mx-auto">Create a new room in the HMS </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-8">Room Information</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="block" className="text-gray-200 text-sm font-medium">Block</Label>
                <Select value={block} onValueChange={setBlock}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 h-12 w-full">
                    <SelectValue placeholder="Select block" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="A" className="text-white hover:bg-gray-600">Block A</SelectItem>
                    <SelectItem value="B" className="text-white hover:bg-gray-600">Block B</SelectItem>
                    <SelectItem value="C" className="text-white hover:bg-gray-600">Block C</SelectItem>
                    <SelectItem value="D" className="text-white hover:bg-gray-600">Block D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="roomNumber" className="text-gray-200 text-sm font-medium">Room Number</Label>
                <Input
                  id="roomNumber"
                  type="text"
                  placeholder="e.g., 101"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="floor" className="text-gray-200 text-sm font-medium">Floor</Label>
                <Input
                  id="floor"
                  type="number"
                  placeholder="e.g., 1"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  min="1"
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="capacity" className="text-gray-200 text-sm font-medium">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="e.g., 3"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min="1"
                  max="6"
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 h-12"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <Link href="/warden/rooms" className="flex-1">
                <Button
                  type="button"
                  className="w-full bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600 h-12"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 font-medium"
              >
                {loading ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </form>
        </div>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={() => setShowSuccess(false)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-sm">
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">Room Created!</h3>
                <p className="text-gray-300">
                  The room has been successfully added to the system.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CreateRoom;