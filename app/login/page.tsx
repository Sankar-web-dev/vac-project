"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/lib/api";
import { Building, Mail, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "warden") {
        router.push("/warden");
      } else {
        router.push("/student");
      }

    } catch (error: any) {
      toast("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

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

        {/* Login Card */}
        <Card className="backdrop-blur-xl bg-white/95 shadow-2xl">
          <CardContent className="space-y-6 p-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-[#0a0a0a]">Welcome Back</h1>
              <p className="text-[#64748b]">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
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
                  autoComplete="current-password"
                  required
                  className="pl-12 border-[#e2e8f0] focus:ring-2 focus:ring-[#4f46e5]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl"
              >
                Sign In
              </Button>
            </form>

           
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;
