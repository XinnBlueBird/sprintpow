"use client";

import { Brain, AlertTriangle, Lightbulb, GitBranch, Activity } from "lucide-react";
import type { SprintAnalysis } from "@/lib/types";
import { storyPointColor } from "@/lib/types";

interface AnalysisPanelProps {
  thinking: string;
  analysis: SprintAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
}

export default function AnalysisPanel({ thinking, analysis, isAnalyzing, error }: AnalysisPanelProps) {
  if (error) {
    return (
      <div className="rounded-lg p-4" style={{ backgroundColor: "#1e1e2e", border: "1px solid #2a2a3a" }}>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-red-400">Analysis Error</span>
        </div>
        <p className="text-sm text-slate-400">{error}</p>
      </div>
    );
  }

  if (!isAnalyzing && !analysis && !thinking) {
    return (
      <div className="rounded-lg p-8 text-center" style={{ backgroundColor: "#1e1e2e", border: "1px solid #2a2a3a" }}>
        <Brain className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <p className="text-sm text-slate-500">
          Paste your backlog items and click "Analyze with MiMo" to get AI-powered sprint planning insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Thinking/Reasoning Stream */}
      {thinking && !analysis && (
        <div className="rounded-lg p-4" style={{ backgroundColor: "#1e1e2e", border: "1px solid #2a2a3a" }}>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-semibold text-amber-500">
              {isAnalyzing ? "MiMo is reasoning..." : "MiMo Analysis"}
            </span>
          </div>
          <div className="text-xs text-slate-400 font-mono leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap">
            {thinking.slice(-2000)}
          </div>
        </div>
      )}

      {/* Structured Analysis Results */}
      {analysis && (
        <>
          {/* Summary */}
          <div className="rounded-lg p-4" style={{ backgroundColor: "#1e1e2e", border: "1px solid #2a2a3a" }}>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-slate-200">Sprint Summary</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-lg" style={{ backgroundColor: "#0f0f17" }}>
                <div className="text-lg font-bold text-amber-500">{analysis.totalStoryPoints}</div>
                <div className="text-[10px] text-slate-500">Total Points</div>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ backgroundColor: "#0f0f17" }}>
                <div className="text-lg font-bold text-blue-400">{analysis.sprintCapacity}</div>
                <div className="text-[10px] text-slate-500">Capacity</div>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ backgroundColor: "#0f0f17" }}>
                <div className={`text-lg font-bold ${analysis.overCapacity ? "text-red-400" : "text-green-400"}`}>
                  {analysis.overCapacity ? "Over" : "OK"}
                </div>
                <div className="text-[10px] text-slate-500">Status</div>
              </div>
            </div>
            {/* Capacity bar */}
            <div className="mt-3">
              <div className="h-2 rounded-full bg-[#0f0f17] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (analysis.totalStoryPoints / analysis.sprintCapacity) * 100)}%`,
                    backgroundColor: analysis.overCapacity ? "#ef4444" : "#F59E0B",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-600">0</span>
                <span className="text-[10px] text-slate-600">{analysis.sprintCapacity}sp</span>
              </div>
            </div>
          </div>

          {/* Task Estimates */}
          <div className="rounded-lg p-4" style={{ backgroundColor: "#1e1e2e", border: "1px solid #2a2a3a" }}>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Task Estimates</h4>
            <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
              {analysis.tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between py-1.5 px-2 rounded" style={{ backgroundColor: "#0f0f17" }}>
                  <span className="text-xs text-slate-300 truncate flex-1 mr-2">{task.name}</span>
                  <span className={`text-xs font-bold ${storyPointColor(task.storyPoints)}`}>
                    {task.storyPoints}sp
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dependencies */}
          {analysis.dependencyGraph.length > 0 && (
            <div className="rounded-lg p-4" style={{ backgroundColor: "#1e1e2e", border: "1px solid #2a2a3a" }}>
              <div className="flex items-center gap-2 mb-3">
                <GitBranch className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-slate-200">Dependencies</span>
              </div>
              <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
                {analysis.dependencyGraph.map((edge, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">{edge.from}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      edge.type === "blocks" ? "bg-red-500/20 text-red-400" :
                      edge.type === "requires" ? "bg-blue-500/20 text-blue-400" :
                      "bg-slate-500/20 text-slate-400"
                    }`}>
                      {edge.type}
                    </span>
                    <span className="text-slate-400">{edge.to}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {analysis.warnings.length > 0 && (
            <div className="rounded-lg p-4" style={{ backgroundColor: "#1e1e2e", border: "1px solid #2a2a3a" }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-slate-200">Warnings</span>
              </div>
              <ul className="space-y-1.5">
                {analysis.warnings.map((w, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">-</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div className="rounded-lg p-4" style={{ backgroundColor: "#1e1e2e", border: "1px solid #2a2a3a" }}>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-slate-200">Recommendations</span>
              </div>
              <ul className="space-y-1.5">
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">-</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
