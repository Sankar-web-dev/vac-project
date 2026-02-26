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
import { toast } from "sonner";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);    
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [editRoomNumber, setEditRoomNumber] = useState("");
  const [editBlock, setEditBlock] = useState("");
  const [editFloor, setEditFloor] = useState("");
  const [editCapacity, setEditCapacity] = useState("");
  const router = useRouter();

  // Fetch rooms
  const fetchRooms = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    try {
      const res = await API.get("/rooms");
      setRooms(res.data);
    } catch (error: any) {
      console.log(error);
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

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-purple-400 to-pink-500 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Room Management</CardTitle>
            <Button onClick={() => router.push("/rooms/new")}>
              Create Room
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Block</TableHead>
                <TableHead>Room Number</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Occupied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room: any) => (
                <TableRow key={room._id}>
                  <TableCell>{room.block}</TableCell>
                  <TableCell>{room.roomNumber}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell className="text-green-600 font-semibold">{room.occupants.length}</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(room)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(room._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Room</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editRoomNumber">Room Number</Label>
                  <Input
                    id="editRoomNumber"
                    type="text"
                    value={editRoomNumber}
                    onChange={(e) => setEditRoomNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editBlock">Block</Label>
                  <Input
                    id="editBlock"
                    type="text"
                    value={editBlock}
                    onChange={(e) => setEditBlock(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editFloor">Floor</Label>
                  <Input
                    id="editFloor"
                    type="number"
                    value={editFloor}
                    onChange={(e) => setEditFloor(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCapacity">Capacity</Label>
                  <Input
                    id="editCapacity"
                    type="number"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Room
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}

export default Rooms;