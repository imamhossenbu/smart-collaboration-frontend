"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2, FolderKanban, Plus, Trash2 } from "lucide-react";

// 🎯 Zod স্কিমাতে মাইলস্টোনের অ্যারে ভ্যালিডেশন যুক্ত করা হলো
const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters long"),
  description: z.string().min(10, "Please provide a more descriptive summary"),
  budget: z.coerce.number().min(1, "Budget must be a positive number"),
  deadline: z.string().min(1, "Please select a valid completion date"),
  // 🆕 মাইলস্টোন স্কিমা
  milestones: z
    .array(
      z.object({
        title: z.string().min(2, "Milestone title required"),
      }),
    )
    .optional()
    .default([]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateProjectModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control, // useFieldArray-এর জন্য লাগবে
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      budget: 0,
      deadline: "",
      milestones: [{ title: "" }], // ডিফাল্ট একটা ফাকা মাইলস্টোন ফিল্ড থাকবে
    },
  });

  // 🛠️ ডাইনামিক মাইলস্টোন ইনপুট ফিল্ড ম্যানেজ করার জন্য useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: "milestones",
  });

  if (!isOpen) return null;

  const handleFormSubmit = async (data: ProjectFormValues) => {
    await onSubmit(data);
    reset(); // সাবমিট সফল হলে ফর্ম সম্পূর্ণ রিসেট হবে
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      {/* max-h-screen এর জন্য মডাল বেশি বড় হয়ে গেলে স্ক্রল হবে */}
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-slate-100 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <FolderKanban className="w-5 h-5 text-brand-royal-blue" />
            <h2 className="text-xl font-bold text-brand-dark-navy">
              Initialize Workspace Scope
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
        >
          {/* Project Name */}
          <div>
            <label className="block text-xs font-bold text-brand-dark-navy uppercase mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-royal-blue transition-all"
            />
            {errors.name && (
              <p className="text-xs text-rose-600 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-brand-dark-navy uppercase mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-royal-blue resize-none transition-all"
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Budget & Deadline Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-dark-navy uppercase mb-1.5">
                Budget (USD)
              </label>
              <input
                type="number"
                {...register("budget")}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-royal-blue transition-all"
              />
              {errors.budget && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.budget.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-dark-navy uppercase mb-1.5">
                Deadline
              </label>
              <input
                type="date"
                {...register("deadline")}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-royal-blue transition-all"
              />
              {errors.deadline && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.deadline.message}
                </p>
              )}
            </div>
          </div>

          {/* 🛠️ 🆕 Milestone Management Section */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-brand-dark-navy uppercase">
                Project Milestones
              </label>
              <button
                type="button"
                onClick={() => append({ title: "" })}
                className="flex items-center gap-1 text-xs text-brand-royal-blue font-bold hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Milestone
              </button>
            </div>

            {/* Loop through generated dynamic fields */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={`e.g., Sprint ${index + 1}: Core API Setup`}
                      {...register(`milestones.${index}.title` as const)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-royal-blue transition-all"
                    />
                    {errors.milestones?.[index]?.title && (
                      <p className="text-[10px] text-rose-600 mt-0.5">
                        {errors.milestones[index].title?.message}
                      </p>
                    )}
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-brand-dark-navy rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-brand-royal-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-dark-navy transition-all shadow-sm cursor-pointer disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Deploy Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
