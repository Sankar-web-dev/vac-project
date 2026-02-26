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
import { toast } from "sonner";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [blockFilter, setBlockFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [editRoomNumber, setEditRoomNumber] = useState("");
  const [editBlock, setEditBlock] = useState("");
  const [editFloor, setEditFloor] = useState("");
  const [editCapacity, setEditCapacity] = useState("");

  // Fetch rooms
  const fetchRooms = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    try {
      const res = await API.get("/rooms");
      setRooms(res.data);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  // Delete room
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      const token = localStorage.getItem("token");
      if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      try {
        await API.delete(`/rooms/${id}`);
        fetchRooms();
      } catch (error: any) {
        toast("Error deleting room");
      }
    }
  };

  // Edit room
  const handleEdit = (room: any) => {
    setSelectedRoom(room);
    setEditRoomNumber(room.roomNumber);
    setEditBlock(room.block);
    setEditFloor(room.floor);
    setEditCapacity(room.capacity);
    setShowEditModal(true);
  };

  // Submit edit
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    try {
      await API.put(`/rooms/${selectedRoom._id}`, {
        roomNumber: editRoomNumber,
        block: editBlock,
        floor: editFloor,
        capacity: editCapacity
      });
      setShowEditModal(false);
      fetchRooms();
      toast.success("Room updated successfully!");
    } catch (error: any) {
      toast("Error updating room");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter rooms based on search and block filter
  const filteredRooms = rooms.filter((room: any) => {
    const matchesSearch = room.roomNumber.toString().includes(searchTerm) ||
                         room.block.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = blockFilter === "all" || room.block === blockFilter;
    return matchesSearch && matchesBlock;
  });

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a0a] mb-2">Room Management</h1>
          <p className="text-[#64748b]">Manage hostel rooms and allocations</p>
        </div>
        <Link href="/warden/rooms/new">
          <Button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            Add Room
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-[#e2e8f0] bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
              />
            </div>
            <Select value={blockFilter} onValueChange={setBlockFilter}>
              <SelectTrigger className="sm:w-48 border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]">
                <SelectValue placeholder="All Blocks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                <SelectItem value="A">Block A</SelectItem>
                <SelectItem value="B">Block B</SelectItem>
                <SelectItem value="C">Block C</SelectItem>
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
              <TableHead className="text-[#0a0a0a] font-semibold">Block</TableHead>
              <TableHead className="text-[#0a0a0a] font-semibold">Room No</TableHead>
              <TableHead className="text-[#0a0a0a] font-semibold">Floor</TableHead>
              <TableHead className="text-[#0a0a0a] font-semibold">Capacity</TableHead>
              <TableHead className="text-[#0a0a0a] font-semibold">Occupied</TableHead>
              <TableHead className="text-[#0a0a0a] font-semibold">Status</TableHead>
              <TableHead className="text-[#0a0a0a] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room: any) => (
              <TableRow key={room._id} className="hover:bg-[#f8fafc] transition-colors">
                <TableCell>
                  <span className="font-semibold text-[#4f46e5]">Block {room.block}</span>
                </TableCell>
                <TableCell className="text-[#0a0a0a]">{room.roomNumber}</TableCell>
                <TableCell className="text-[#64748b]">Floor {room.floor}</TableCell>
                <TableCell className="text-[#64748b]">{room.capacity}</TableCell>
                <TableCell>
                  <span className="font-medium text-[#0a0a0a]">{room.occupants.length}/{room.capacity}</span>
                </TableCell>
                <TableCell>
                  {room.occupants.length === room.capacity ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                      Full
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      Available
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="p-2 text-[#64748b] hover:text-[#4f46e5] hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingRoom(room)}
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
            <DialogTitle className="text-[#0a0a0a]">Edit Room</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editBlock" className="text-[#64748b]">Block</Label>
              <Select value={editBlock} onValueChange={setEditBlock}>
                <SelectTrigger className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]">
                  <SelectValue placeholder="Select block" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Block A</SelectItem>
                  <SelectItem value="B">Block B</SelectItem>
                  <SelectItem value="C">Block C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editRoomNumber" className="text-[#64748b]">Room Number</Label>
              <Input
                id="editRoomNumber"
                type="text"
                value={editRoomNumber}
                onChange={(e) => setEditRoomNumber(e.target.value)}
                required
                className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editFloor" className="text-[#64748b]">Floor</Label>
              <Input
                id="editFloor"
                type="number"
                value={editFloor}
                onChange={(e) => setEditFloor(e.target.value)}
                required
                className="border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCapacity" className="text-[#64748b]">Capacity</Label>
              <Input
                id="editCapacity"
                type="number"
                value={editCapacity}
                onChange={(e) => setEditCapacity(e.target.value)}
                required
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
      {deletingRoom && (
        <Dialog open={!!deletingRoom} onOpenChange={() => setDeletingRoom(null)}>
          <DialogContent className="bg-white border border-[#e2e8f0] rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#0a0a0a]">Delete Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-[#64748b]">
                Are you sure you want to delete Room {deletingRoom.block}-{deletingRoom.roomNumber}?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeletingRoom(null)}
                  className="border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleDelete(deletingRoom._id);
                    setDeletingRoom(null);
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

export default Rooms;
