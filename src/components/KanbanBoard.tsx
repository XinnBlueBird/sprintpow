"use client";

import { Inbox, Target, Loader2, CheckCircle2 } from "lucide-react";
import type { TaskItem } from "@/lib/types";
import TaskCard from "./TaskCard";

interface KanbanBoardProps {
  tasks: TaskItem[];
  onStatusChange: (taskId: string, newStatus: TaskItem["status"]) => void;
}

const columns: { key: TaskItem["status"]; label: string; color: string; icon: React.ReactNode }[] = [
  { key: "backlog", label: "Backlog", color: "#6b7280", icon: <Inbox className="w-3.5 h-3.5" /> },
  { key: "sprint", label: "Sprint", color: "#F59E0B", icon: <Target className="w-3.5 h-3.5" /> },
  { key: "in-progress", label: "In Progress", color: "#3b82f6", icon: <Loader2 className="w-3.5 h-3.5" /> },
  { key: "done", label: "Done", color: "#22c55e", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
];

export default function KanbanBoard({ tasks, onStatusChange }: KanbanBoardProps) {
  const handleDrop = (e: React.DragEvent, status: TaskItem["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3 h-full">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.key);
        const totalPoints = columnTasks.reduce((sum, t) => sum + t.storyPoints, 0);

        return (
          <div
            key={col.key}
            className="flex flex-col rounded-lg overflow-hidden"
            style={{ backgroundColor: "#1a1a2e" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, col.key)}
          >
            {/* Column Header */}
            <div className="px-3 py-2.5 flex items-center justify-between border-b border-[#2a2a3a]">
              <div className="flex items-center gap-2">
                <span style={{ color: col.color }}>{col.icon}</span>
                <span className="text-sm font-semibold text-slate-200">{col.label}</span>
                <span className="text-xs text-slate-500 bg-[#0f0f17] px-1.5 py-0.5 rounded">
                  {columnTasks.length}
                </span>
              </div>
              <span className="text-xs font-medium" style={{ color: col.color }}>
                {totalPoints}sp
              </span>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-2 overflow-y-auto min-h-[200px]">
              {columnTasks.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-slate-600">No tasks</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
