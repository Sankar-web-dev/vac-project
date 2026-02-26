"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import API from "@/lib/api";
import { toast } from "sonner";

interface Complaint {
  _id: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      try {
        const res = await API.get("/complaints/me");
        setComplaints(res.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      const token = localStorage.getItem("token");
      if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      try {
        await API.delete(`/complaints/${id}`);
        setComplaints(complaints.filter(c => c._id !== id));
      } catch (error) {
        toast("Error deleting complaint");
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-purple-400 to-pink-500 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-purple-400 to-pink-500 p-4">
      <Card className="w-full max-w-2xl max-h-full overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-center">My Complaints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {complaints.length === 0 ? (
            <p className="text-center">No complaints found.</p>
          ) : (
            complaints.map((complaint: Complaint) => {
              const statusColor = complaint.status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                                  complaint.status === 'in-progress' ? 'text-blue-600 bg-blue-100' :
                                  'text-green-600 bg-green-100';
              return (
              <Card key={complaint._id} className="p-4 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold capitalize">{complaint.category}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                      {complaint.status}
                    </span>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(complaint._id)}>Delete</Button>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{complaint.description}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString()}
                </p>
              </Card>
              )
            })
          )}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push('/complaints/new')}>Create Complaint</Button>
            <Button onClick={() => window.history.back()}>Back</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
