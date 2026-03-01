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
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    try {
      await API.delete(`/rooms/${id}`);
      fetchRooms();
      toast.success("Room deleted successfully!");
    } catch (error: any) {
      toast("Error deleting room");
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
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Room Management</h1>
            <p className="text-gray-400 text-lg">Manage hostel rooms and allocations</p>
          </div>
          <Link href="/warden/rooms/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Plus className="w-5 h-5 mr-2" />
              Add Room
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
              />
            </div>
            <Select value={blockFilter} onValueChange={setBlockFilter}>
              <SelectTrigger className="sm:w-48 bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 rounded-lg">
                <SelectValue placeholder="All Blocks" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-600">All Blocks</SelectItem>
                <SelectItem value="A" className="text-white hover:bg-gray-600">Block A</SelectItem>
                <SelectItem value="B" className="text-white hover:bg-gray-600">Block B</SelectItem>
                <SelectItem value="C" className="text-white hover:bg-gray-600">Block C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-700 hover:bg-gray-700 border-gray-600">
                <TableHead className="text-gray-200 font-semibold">Block</TableHead>
                <TableHead className="text-gray-200 font-semibold">Room No</TableHead>
                <TableHead className="text-gray-200 font-semibold">Floor</TableHead>
                <TableHead className="text-gray-200 font-semibold">Capacity</TableHead>
                <TableHead className="text-gray-200 font-semibold">Occupied</TableHead>
                <TableHead className="text-gray-200 font-semibold">Status</TableHead>
                <TableHead className="text-gray-200 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room: any) => (
                <TableRow key={room._id} className="hover:bg-gray-700 border-gray-600 transition-colors">
                  <TableCell>
                    <span className="font-semibold text-blue-400">Block {room.block}</span>
                  </TableCell>
                  <TableCell className="text-white">{room.roomNumber}</TableCell>
                  <TableCell className="text-gray-300">Floor {room.floor}</TableCell>
                  <TableCell className="text-gray-300">{room.capacity}</TableCell>
                  <TableCell>
                    <span className="font-medium text-white">{room.occupants.length}/{room.capacity}</span>
                  </TableCell>
                  <TableCell>
                    {room.occupants.length === room.capacity ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-900 text-red-200 border border-red-700">
                        Full
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200 border border-green-700">
                        Available
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingRoom(room)}
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
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">Edit Room</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roomNumber" className="text-gray-200">Room Number</Label>
                  <Input
                    id="roomNumber"
                    value={editRoomNumber}
                    onChange={(e) => setEditRoomNumber(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="block" className="text-gray-200">Block</Label>
                  <Select value={editBlock} onValueChange={setEditBlock}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="A" className="text-white hover:bg-gray-600">Block A</SelectItem>
                      <SelectItem value="B" className="text-white hover:bg-gray-600">Block B</SelectItem>
                      <SelectItem value="C" className="text-white hover:bg-gray-600">Block C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="floor" className="text-gray-200">Floor</Label>
                  <Input
                    id="floor"
                    type="number"
                    value={editFloor}
                    onChange={(e) => setEditFloor(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity" className="text-gray-200">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Update Room
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      {/* Delete Confirmation */}
      {deletingRoom && (
        <Dialog open={!!deletingRoom} onOpenChange={() => setDeletingRoom(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">Delete Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-gray-300">
                Are you sure you want to delete Room {deletingRoom.block}-{deletingRoom.roomNumber}?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  className="bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600 flex-1"
                  onClick={() => setDeletingRoom(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleDelete(deletingRoom._id);
                    setDeletingRoom(null);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white flex-1"
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

export default Rooms;
