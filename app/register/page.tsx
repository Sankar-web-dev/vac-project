"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/lib/api";
import { Building, Mail, Lock, User, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role: "warden"
      });

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error: any) {
      setLoading(false);
      setError("Registration failed: " + (error.response?.data?.message || error.message));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] flex items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/95 shadow-2xl">
          <CardContent className="text-center space-y-6 p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#0a0a0a]">Registration Successful!</h2>
              <p className="text-[#64748b]">
                Your account has been created. Redirecting to login...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4f46e5] via-[#6366f1] to-[#8b5cf6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <Building className="w-7 h-7 text-[#4f46e5]" />
          </div>
          <span className="text-2xl font-bold text-white">HMS</span>
        </Link>

        {/* Register Card */}
        <Card className="backdrop-blur-xl bg-white/95 shadow-2xl">
          <CardContent className="space-y-6 p-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-[#0a0a0a]">Create Account</h1>
              <p className="text-[#64748b]">Register as a Warden to get started</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="pl-12 border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="pl-12 border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="pl-12 border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="pl-12 border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                />
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <p className="text-sm text-indigo-700">
                  <strong>Default Role:</strong> Warden
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl"
              >
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-[#64748b]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#4f46e5] font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Register;