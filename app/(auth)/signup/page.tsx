/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSignupMutation } from "@/services/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { User, Mail, Lock, Shield, RefreshCw } from "lucide-react";

// 1. Define separate Zod validation rules for each field
const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  role: z.enum(["TEAM_MEMBER", "PROJECT_MANAGER"], {
    errorMap: () => ({ message: "Please select a valid workspace role." }),
  }),
});

// Infer TypeScript types from the Zod Schema
type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  // RTK Query mutation hook for signing up
  const [signup, { isLoading }] = useSignupMutation();
  const router = useRouter();

  // 2. Initialize react-hook-form with Zod resolver and explicit default values
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", role: "TEAM_MEMBER" },
  });

  // Form submission handler
  const onSubmit = async (data: SignupFormValues) => {
    // Fire a global loading toast instantly when the user clicks register
    const toastId = toast.loading("Creating your account...");

    try {
      // Execute the asynchronous API call and unwrap the response payload
      const res = await signup(data).unwrap();

      // Log the actual backend payload in the browser console for debugging
      console.log("Backend Response Verification:", res);

      // 3. Robust token management with safe-navigation fallback guards
      if (res?.token) {
        // Save the authentication token to local storage
        localStorage.setItem("token", res.token);

        // Fallback to client-side form input values if backend omits user meta fields
        const userRole = res?.user?.role || data.role;
        const userName = res?.user?.name || data.name;

        localStorage.setItem("role", userRole);
        localStorage.setItem("userName", userName);

        // Synchronously bake the cookie token for instant middleware verification on route change
        document.cookie = `token=${res.token}; path=/; max-age=86400; SameSite=Strict;`;

        // Dismiss loading state and push successful toast alert
        toast.success(`Welcome, ${userName}! Account created successfully.`, {
          id: toastId,
        });

        // Add a micro-delay so the user can easily see the success notification before redirecting
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        // Handle scenario where backend registers successfully but expects manual login (no token returned)
        toast.success("Account created successfully! Redirecting to login...", {
          id: toastId,
        });
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      }
    } catch (err: any) {
      console.error("Signup Endpoint Crash Log:", err);

      // Parse custom error messages returned from NestJS validation filters, otherwise fall back to default
      const errorMessage =
        err?.data?.message || err?.message || "Registration failed. Try again.";

      // Display the failure state toast message using the same toast container ID
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        {/* Header Block */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-brand-dark-navy">
            Create Account
          </h1>
          <p className="text-sm text-brand-steel-blue mt-1">
            Get started with SmartCollab workspace
          </p>
        </div>

        {/* Signup Form Core Input Blocks */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name Input Field */}
          <div>
            <label className="block text-sm font-medium text-brand-dark-navy mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-brand-steel-blue absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register("name")}
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                  errors.name
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-slate-200 focus:border-brand-teal-aqua"
                } rounded-xl text-sm focus:outline-none transition-colors`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Address Input Field */}
          <div>
            <label className="block text-sm font-medium text-brand-dark-navy mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-brand-steel-blue absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register("email")}
                placeholder="john@example.com"
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

          {/* Password Input Field */}
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

          {/* Workspace Role Selector (Filters admin role out from public context) */}
          <div>
            <label className="block text-sm font-medium text-brand-dark-navy mb-1.5">
              Workspace Role
            </label>
            <div className="relative">
              <Shield className="w-5 h-5 text-brand-steel-blue absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                {...register("role")}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal-aqua transition-colors appearance-none cursor-pointer text-slate-700"
              >
                <option value="TEAM_MEMBER">Team Member</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
              </select>
            </div>
          </div>

          {/* Action Submission Button Container */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-royal-blue text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-dark-navy transition-all shadow-sm flex justify-center items-center gap-2 cursor-pointer mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
            Register
          </button>
        </form>

        {/* Navigation Routing Footer */}
        <p className="text-center text-sm text-brand-steel-blue mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-royal-blue font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
