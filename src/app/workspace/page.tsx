"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import BacklogInput from "@/components/BacklogInput";
import AnalysisPanel from "@/components/AnalysisPanel";
import KanbanBoard from "@/components/KanbanBoard";
import { useMimoAnalysis } from "@/hooks/useMimoAnalysis";
import type { TeamCapacity, TaskItem } from "@/lib/types";
import { generateId, parsePriority } from "@/lib/types";
import { Menu } from "lucide-react";

const defaultCapacity: TeamCapacity = {
  developers: 4,
  sprintDays: 10,
  hoursPerDay: 6,
  velocityFactor: 0.7,
};

const defaultTasks: TaskItem[] = [
  {
    id: generateId(),
    name: "Set up authentication system",
    storyPoints: 8,
    priority: "high",
    status: "sprint",
    dependencies: [],
    blockers: [],
  },
  {
    id: generateId(),
    name: "Create user dashboard",
    storyPoints: 5,
    priority: "medium",
    status: "sprint",
    dependencies: [],
    blockers: [],
  },
  {
    id: generateId(),
    name: "Implement API endpoints",
    storyPoints: 13,
    priority: "high",
    status: "in-progress",
    dependencies: [],
    blockers: [],
  },
  {
    id: generateId(),
    name: "Write unit tests",
    storyPoints: 5,
    priority: "medium",
    status: "backlog",
    dependencies: [],
    blockers: [],
  },
  {
    id: generateId(),
    name: "Database schema migration",
    storyPoints: 3,
    priority: "critical",
    status: "done",
    dependencies: [],
    blockers: [],
  },
  {
    id: generateId(),
    name: "UI component library",
    storyPoints: 8,
    priority: "low",
    status: "backlog",
    dependencies: [],
    blockers: [],
  },
];

export default function WorkspacePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [capacity, setCapacity] = useState<TeamCapacity>(defaultCapacity);
  const [tasks, setTasks] = useState<TaskItem[]>(defaultTasks);
  const { isAnalyzing, thinking, analysis, error, analyze } = useMimoAnalysis();
  const lastAnalysisRef = useRef<typeof analysis>(null);

  const handleAnalyze = useCallback(
    (backlogText: string) => {
      analyze(backlogText, capacity);
    },
    [analyze, capacity]
  );

  // When analysis completes with tasks, update the kanban
  useEffect(() => {
    if (analysis && analysis.tasks.length > 0 && analysis !== lastAnalysisRef.current) {
      lastAnalysisRef.current = analysis;
      setTasks(analysis.tasks);
    }
  }, [analysis]);

  const handleStatusChange = useCallback(
    (taskId: string, newStatus: TaskItem["status"]) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    },
    []
  );

  const handleAddManualTask = useCallback(() => {
    const name = prompt("Enter task name:");
    if (!name) return;
    const pointsStr = prompt("Story points (1,2,3,5,8,13,21):");
    const points = parseInt(pointsStr || "3", 10);
    const priorityStr = prompt("Priority (low/medium/high/critical):");
    setTasks((prev) => [
      ...prev,
      {
        id: generateId(),
        name,
        storyPoints: [1, 2, 3, 5, 8, 13, 21].includes(points) ? points : 3,
        priority: parsePriority(priorityStr || "medium"),
        status: "backlog",
        dependencies: [],
        blockers: [],
      },
    ]);
  }, []);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#0f0f17" }}>
      <Sidebar capacity={capacity} onCapacityChange={setCapacity} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-[#2a2a3a] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-400 hover:text-white md:hidden flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-bold text-white truncate">Sprint Workspace</h1>
              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 hidden sm:block">
                Analyze backlog, estimate effort, and plan your sprint
              </p>
            </div>
          </div>
          <button
            onClick={handleAddManualTask}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors flex-shrink-0"
          >
            + Add Task
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-3 md:p-4 overflow-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 h-full">
            {/* Left Column: Backlog Input + Analysis */}
            <div className="flex flex-col gap-4 lg:col-span-4">
              <div
                className="rounded-lg p-3 md:p-4"
                style={{
                  backgroundColor: "#1e1e2e",
                  border: "1px solid #2a2a3a",
                }}
              >
                <BacklogInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
              </div>

              <div className="flex-1 overflow-auto">
                <AnalysisPanel
                  thinking={thinking}
                  analysis={analysis}
                  isAnalyzing={isAnalyzing}
                  error={error}
                />
              </div>
            </div>

            {/* Right Column: Kanban Board */}
            <div className="lg:col-span-8">
              <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
