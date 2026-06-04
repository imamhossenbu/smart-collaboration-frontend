"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  Loader2,
  Edit3,
  Plus,
  Trash2,
  CalendarDays,
  DollarSign,
  Tag,
} from "lucide-react";

const editProjectSchema = z.object({
  name: z.string().min(3, "Name is too short"),
  description: z.string().min(10, "Description is too short"),
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
      ...project,
      deadline: project?.deadline?.split("T")[0],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "milestones",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Project</h2>
            <p className="text-xs text-slate-500 font-medium">
              Update core project parameters
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit(onUpdate)}
          className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Project Name
              </label>
              <input
                {...register("name")}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-royal-blue ring-offset-2 focus:ring-2 focus:ring-brand-royal-blue/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3" /> Budget
                </label>
                <input
                  type="number"
                  {...register("budget")}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-brand-royal-blue"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Status
                </label>
                <select
                  {...register("status")}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-brand-royal-blue"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>
            </div>
          </div>

          {/* Milestones Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Milestones
            </label>
            <div className="space-y-2">
              {fields.map((field: any, index) => (
                <div key={field.id} className="flex gap-2 group">
                  <input
                    {...register(`milestones.${index}.title`)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-brand-royal-blue outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => append({ title: "" })}
              className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 hover:border-brand-royal-blue hover:text-brand-royal-blue transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Milestone
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
