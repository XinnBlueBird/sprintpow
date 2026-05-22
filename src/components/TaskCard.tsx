"use client";

import { GripVertical, Link2, AlertTriangle } from "lucide-react";
import type { TaskItem } from "@/lib/types";
import { storyPointColor, priorityColor } from "@/lib/types";

interface TaskCardProps {
  task: TaskItem;
  onStatusChange?: (taskId: string, newStatus: TaskItem["status"]) => void;
}

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  return (
    <div
      className="rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing transition-all hover:-translate-y-0.5"
      style={{
        backgroundColor: "#1e1e2e",
        border: "1px solid #2a2a3a",
      }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("taskId", task.id);
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <GripVertical className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 leading-snug truncate">
              {task.name}
            </p>
            {task.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
        </div>
        <span
          className={`text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${storyPointColor(task.storyPoints)}`}
        >
          {task.storyPoints}sp
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2 ml-5">
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${priorityColor(task.priority)}`}
        >
          {task.priority}
        </span>

        {task.dependencies.length > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <Link2 className="w-3 h-3" />
            {task.dependencies.length}
          </span>
        )}

        {task.blockers.length > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-red-400">
            <AlertTriangle className="w-3 h-3" />
            {task.blockers.length}
          </span>
        )}
      </div>

      {/* Status change buttons (simplified drag alternative) */}
      {onStatusChange && (
        <div className="flex gap-1 mt-2 ml-5">
          {(["backlog", "sprint", "in-progress", "done"] as const).map(
            (s) =>
              s !== task.status && (
                <button
                  key={s}
                  onClick={() => onStatusChange(task.id, s)}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-[#0f0f17] text-slate-500 hover:text-slate-300 border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors"
                >
                  {s === "in-progress" ? "WIP" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              )
          )}
        </div>
      )}
    </div>
  );
}
