"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import API from "@/lib/api";

export default function NewComplaint() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    category: 'maintenance',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    try {
      await API.post("/complaints", {
        category: formData.category,
        description: formData.description,
      });
      setLoading(false);
      setShowSuccess(true);
      toast.success("Complaint submitted successfully!");
      
      setTimeout(() => {
        router.push('/student/complaints');
      }, 2000);
    } catch (error) {
      console.error("Error creating complaint:", error);
      toast("Failed to submit complaint");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Submit Complaint</h1>
          <p className="text-gray-400">Fill out the form below to submit a new complaint</p>
        </div>

        {/* Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Complaint Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Category</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="maintenance" className="text-white hover:bg-gray-600">Maintenance</SelectItem>
                    <SelectItem value="cleaning" className="text-white hover:bg-gray-600">Cleanliness</SelectItem>
                    <SelectItem value="electricity" className="text-white hover:bg-gray-600">Electrical</SelectItem>
                    <SelectItem value="plumbing" className="text-white hover:bg-gray-600">Plumbing</SelectItem>
                    <SelectItem value="other" className="text-white hover:bg-gray-600">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  placeholder="Describe your complaint in detail..."
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  className="flex-1 bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600"
                  onClick={() => router.push('/student/complaints')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={() => setShowSuccess(false)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
            <div className="text-center space-y-4 py-4">
              <div className="w-20 h-20 bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Complaint Submitted!</h3>
                <p className="text-gray-400">
                  Your complaint has been submitted successfully. You will be notified of updates.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
