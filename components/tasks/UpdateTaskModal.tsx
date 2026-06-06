"use client";
import { useState } from "react";
import { useUpdateProgressMutation } from "@/services/taskApi";
import { useGetCommentsQuery, useAddCommentMutation, useUploadAttachmentMutation } from "@/services/advancedApi";
import {
  X,
  Flame,
  Clock,
  CheckCircle,
  Circle,
  Save,
  Loader2,
  MessageSquare,
  Send,
  Paperclip
} from "lucide-react";

type Task = {
  id: string | number;
  title: string;
  progress?: number;
};

type UpdateTaskModalProps = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
};

export default function UpdateTaskModal({ task, isOpen, onClose, onUpdate }: UpdateTaskModalProps) {
  const [progress, setProgress] = useState(task.progress || 0);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [updateProgress, { isLoading }] = useUpdateProgressMutation();
  const { data: comments } = useGetCommentsQuery(task.id.toString(), { skip: !isOpen });
  const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();
  const [uploadAttachment, { isLoading: isUploading }] = useUploadAttachmentMutation();

  const CIRCUMFERENCE = 2 * Math.PI * 54;

  const handleSave = async () => {
    await updateProgress({ id: task.id, progress }).unwrap();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onUpdate();
      onClose();
    }, 1200);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await addComment({ taskId: task.id.toString(), content: commentText }).unwrap();
    setCommentText("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAttachment({ taskId: task.id.toString(), file }).unwrap();
      e.target.value = ''; // reset
    }
  };

  const getStatus = (v: number) => {
    if (v === 0)
      return {
        label: "Not started",
        icon: <Circle size={13} />,
        color: "text-slate-400",
        bg: "bg-slate-100",
        border: "border-slate-200",
      };
    if (v < 50)
      return {
        label: "In progress",
        icon: <Clock size={13} />,
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    if (v < 100)
      return {
        label: "Almost there",
        icon: <Flame size={13} />,
        color: "text-indigo-700",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
      };
    return {
      label: "Complete!",
      icon: <CheckCircle size={13} />,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    };
  };

  const status = getStatus(progress);
  const offset = CIRCUMFERENCE * (1 - progress / 100);
  const quickValues = [25, 50, 75, 100];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm border border-slate-100 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <span className="text-[15px] font-medium text-slate-800">
            Update progress
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100 transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Task name */}
        <p className="text-[12px] text-slate-400 text-center px-6 truncate mb-4">
          {task.title}
        </p>

        {/* Circular ring */}
        <div className="flex items-center justify-center mb-3">
          <div className="relative">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#6366f1"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.3s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-medium text-slate-800 tabular-nums leading-none">
                {progress}
                <span className="text-lg text-slate-300">%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex justify-center mb-5">
          <span
            className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-md border ${status.bg} ${status.border} ${status.color}`}
          >
            {status.icon}
            {status.label}
          </span>
        </div>

        {/* Slider */}
        <div className="px-6 mb-4">
          <div className="relative h-6 flex items-center mb-2">
            {/* Track bg */}
            <div className="absolute inset-0 my-auto h-[5px] rounded-full bg-slate-100" />
            {/* Track fill */}
            <div
              className="absolute left-0 my-auto h-[5px] rounded-full bg-indigo-500 pointer-events-none"
              style={{ width: `${progress}%`, transition: "width 0.1s" }}
            />
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="relative z-10 w-full appearance-none bg-transparent cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-[22px]
                [&::-webkit-slider-thumb]:h-[22px]
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-indigo-500
                [&::-webkit-slider-thumb]:border-[3px]
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_#6366f1]
                [&::-webkit-slider-thumb]:transition-transform
                [&:active::-webkit-slider-thumb]:scale-110
                [&::-moz-range-thumb]:w-[22px]
                [&::-moz-range-thumb]:h-[22px]
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-indigo-500
                [&::-moz-range-thumb]:border-[3px]
                [&::-moz-range-thumb]:border-white"
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Quick-set buttons */}
        <div className="grid grid-cols-4 gap-2 px-6 mb-6">
          {quickValues.map((val) => (
            <button
              key={val}
              onClick={() => setProgress(val)}
              className={`text-[12px] font-medium py-1.5 rounded-lg border transition
                ${
                  progress === val
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
            >
              {val === 100 ? "Done" : `${val}%`}
            </button>
          ))}
        </div>

        {/* Save button */}
        <div className="px-6 pb-6 border-b border-slate-100">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-medium text-white transition-all active:scale-[0.98]
              ${saved ? "bg-emerald-500" : "bg-indigo-500 hover:bg-indigo-600"}
              disabled:opacity-60 disabled:pointer-events-none`}
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Saving…
              </>
            ) : saved ? (
              <>
                <CheckCircle size={15} /> Saved!
              </>
            ) : (
              <>
                <Save size={15} /> Save progress
              </>
            )}
          </button>
        </div>

        {/* Comments Section */}
        <div className="px-6 py-4 bg-slate-50/50">
          <h4 className="text-[12px] font-semibold text-slate-600 mb-3 flex items-center gap-1.5">
            <MessageSquare size={14} /> Comments
          </h4>
          <div className="space-y-3 mb-4 max-h-32 overflow-y-auto pr-2">
            {comments?.length === 0 && (
              <p className="text-[11px] text-slate-400 text-center py-2">No comments yet</p>
            )}
            {comments?.map((c: any) => (
              <div key={c.id} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[11px] font-bold text-slate-700">{c.user?.name}</span>
                  <span className="text-[9px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-[12px] text-slate-600">{c.content}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 relative">
            <label className="p-2.5 bg-slate-100 text-slate-500 rounded-xl cursor-pointer hover:bg-slate-200 transition">
              <input type="file" className="hidden" onChange={handleFileUpload} />
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Paperclip size={14} />}
            </label>
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full text-[12px] pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button 
              onClick={handleAddComment}
              disabled={isCommenting || !commentText.trim()}
              className="absolute right-1.5 top-1.5 p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition"
            >
              {isCommenting ? <Loader2 size={14} className="animate-spin"/> : <Send size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
