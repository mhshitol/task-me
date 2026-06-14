"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { CheckSquare, Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">TASK ME</span>
        </div>

        {/* Card */}
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
            <p className="text-sm text-neutral-400 mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all placeholder:text-neutral-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors shadow-sm shadow-brand-500/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}