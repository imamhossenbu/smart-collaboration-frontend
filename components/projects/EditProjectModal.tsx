/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2, Plus, Trash2 } from "lucide-react";

const editProjectSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  budget: z.coerce.number().min(0),
  deadline: z.string(),
  status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD"]),
  milestones: z.array(z.object({ title: z.string().min(1) })).optional(),
});

export default function EditProjectModal({
  isOpen,
  onClose,
  project,
  onUpdate,
  isSubmitting,
}: any) {
  const { register, handleSubmit, control } = useForm<any>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: project?.name,
      description: project?.description,
      budget: project?.budget,
      status: project?.status,
      deadline: project?.deadline
        ? new Date(project.deadline).toISOString().split("T")[0]
        : "",
      milestones: project?.milestones || [{ title: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "milestones",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header - No Border */}
        <div className="px-8 py-6 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-slate-900">Edit Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onUpdate)}
          className="px-8 pb-8 space-y-5 max-h-[70vh] overflow-y-auto"
        >
          {/* Input Fields with subtle backgrounds instead of borders */}
          <input
            {...register("name")}
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            placeholder="Project Name"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              {...register("budget")}
              className="px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Budget"
            />
            <select
              {...register("status")}
              className="px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-slate-200 text-slate-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>

          <input
            type="date"
            {...register("deadline")}
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-slate-200 text-slate-500"
          />

          {/* Milestones - Clean list style */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
              Milestones
            </p>
            {fields.map((f: any, i) => (
              <div key={f.id} className="flex gap-2">
                <input
                  {...register(`milestones.${i}.title`)}
                  className="flex-1 px-5 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-slate-200"
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-4 hover:bg-rose-50 rounded-2xl text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ title: "" })}
              className="w-full py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
            >
              + Add Milestone
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5 mx-auto" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
