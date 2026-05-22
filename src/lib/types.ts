export interface TaskItem {
  id: string;
  name: string;
  storyPoints: number;
  priority: "low" | "medium" | "high" | "critical";
  status: "backlog" | "sprint" | "in-progress" | "done";
  dependencies: string[];
  blockers: string[];
  assignee?: string;
  description?: string;
}

export interface SprintAnalysis {
  tasks: TaskItem[];
  totalStoryPoints: number;
  sprintCapacity: number;
  overCapacity: boolean;
  warnings: string[];
  recommendations: string[];
  dependencyGraph: DependencyEdge[];
}

export interface DependencyEdge {
  from: string;
  to: string;
  type: "blocks" | "related" | "requires";
}

export interface TeamCapacity {
  developers: number;
  sprintDays: number;
  hoursPerDay: number;
  velocityFactor: number;
}

export interface MimoRequest {
  messages: Array<{ role: string; content: string }>;
  stream?: boolean;
}

export interface StreamChunk {
  type: "thinking" | "content" | "done" | "error";
  text: string;
}

export function calculateCapacity(cap: TeamCapacity): number {
  const totalHours = cap.developers * cap.sprintDays * cap.hoursPerDay;
  const effectiveHours = totalHours * cap.velocityFactor;
  return Math.round(effectiveHours / 4);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function parsePriority(text: string): TaskItem["priority"] {
  const lower = text.toLowerCase();
  if (lower.includes("critical") || lower.includes("p0") || lower.includes("urgent")) return "critical";
  if (lower.includes("high") || lower.includes("p1")) return "high";
  if (lower.includes("medium") || lower.includes("p2")) return "medium";
  return "low";
}

export function storyPointColor(points: number): string {
  if (points <= 2) return "text-green-400";
  if (points <= 5) return "text-yellow-400";
  if (points <= 8) return "text-orange-400";
  return "text-red-400";
}

export function priorityColor(priority: TaskItem["priority"]): string {
  switch (priority) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
  }
}
