/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLoginMutation } from "@/services/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Lock, Mail, RefreshCw } from "lucide-react";

// 1. Zod schema for clean client-side input validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  // 2. Setup react-hook-form with the Zod validator
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Core submit logic for login request
  const onSubmit = async (data: LoginFormValues) => {
    // Trigger global pending loader immediately
    const toastId = toast.loading("Authenticating credentials...");

    try {
      const res = await login(data).unwrap();

      // Log payload signature to track issues with response formatting
      console.log("Login API Response Payload:", res);

      if (res?.token) {
        // 3. Synchronously set local storage variables with fallback guards
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res?.user?.role || "TEAM_MEMBER");
        localStorage.setItem("userName", res?.user?.name || "User");

        // 4. BAKE THE COOKIE INSTANTLY! Crucial step for middleware validation
        document.cookie = `token=${res.token}; path=/; max-age=86400; SameSite=Strict;`;

        // Success state response triggers toast completion
        toast.success(`Welcome back, ${res?.user?.name || "User"}!`, {
          id: toastId,
        });

        // Grant buffer window for browser to write storage blocks before redirecting
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        toast.error("Invalid server payload mapping. Token was not received.", {
          id: toastId,
        });
      }
    } catch (err: any) {
      console.error("Login Endpoint Crash Log:", err);

      const errorMessage =
        err?.data?.message || err?.message || "Invalid email or password";

      // Update loading toast container into a failure block
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        {/* Header Block */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-dark-navy">
            Welcome Back
          </h1>
          <p className="text-sm text-brand-steel-blue mt-1">
            Sign in to manage your team collaboration
          </p>
        </div>

        {/* Login Credentials Form Block */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Address Input Block */}
          <div>
            <label className="block text-sm font-medium text-brand-dark-navy mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-brand-steel-blue absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register("email")}
                placeholder="name@company.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                  errors.email
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-slate-200 focus:border-brand-teal-aqua"
                } rounded-xl text-sm focus:outline-none transition-colors`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input Block */}
          <div>
            <label className="block text-sm font-medium text-brand-dark-navy mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-brand-steel-blue absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                  errors.password
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-slate-200 focus:border-brand-teal-aqua"
                } rounded-xl text-sm focus:outline-none transition-colors`}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Core Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-royal-blue text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-dark-navy transition-all shadow-sm flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>

        {/* Bottom Redirection Links */}
        <p className="text-center text-sm text-brand-steel-blue mt-6">
          Donot have an account?{" "}
          <Link
            href="/signup"
            className="text-brand-royal-blue font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
