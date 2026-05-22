"use client";

import { useState, useCallback, useRef } from "react";
import type { StreamChunk, TaskItem, SprintAnalysis, TeamCapacity } from "@/lib/types";
import { calculateCapacity, generateId, parsePriority } from "@/lib/types";

export function useMimoAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [thinking, setThinking] = useState("");
  const [analysis, setAnalysis] = useState<SprintAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const analyze = useCallback(async (backlog: string, capacity: TeamCapacity) => {
    setIsAnalyzing(true);
    setThinking("");
    setAnalysis(null);
    setError(null);

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/mimo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backlog,
          capacity,
          capacityPoints: calculateCapacity(capacity),
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullThinking = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const chunk: StreamChunk = JSON.parse(data);
            if (chunk.type === "thinking") {
              fullThinking += chunk.text;
              setThinking(fullThinking);
            } else if (chunk.type === "content") {
              const parsed = parseAnalysisJSON(chunk.text, capacity);
              if (parsed) {
                setAnalysis(parsed);
              }
            } else if (chunk.type === "error") {
              setError(chunk.text);
            }
          } catch {
            // skip unparseable chunks
          }
        }
      }

      // Final pass: if we have thinking but no structured analysis, try to parse thinking
      if (!analysis && fullThinking) {
        const parsed = parseAnalysisJSON(fullThinking, capacity);
        if (parsed) {
          setAnalysis(parsed);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setIsAnalyzing(false);
  }, []);

  return { isAnalyzing, thinking, analysis, error, analyze, cancel };
}

function parseAnalysisJSON(text: string, capacity: TeamCapacity): SprintAnalysis | null {
  // Try to find JSON in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    const raw = JSON.parse(jsonMatch[0]);
    const capacityPoints = calculateCapacity(capacity);

    const tasks: TaskItem[] = (raw.tasks || raw.items || []).map((t: Record<string, unknown>, i: number) => ({
      id: (t.id as string) || generateId(),
      name: (t.name as string) || (t.title as string) || (t.task as string) || `Task ${i + 1}`,
      storyPoints: (t.storyPoints as number) || (t.story_points as number) || (t.points as number) || 3,
      priority: parsePriority((t.priority as string) || "medium"),
      status: (t.status as TaskItem["status"]) || (t.sprint_recommended ? "sprint" : "backlog"),
      dependencies: (t.dependencies as string[]) || [],
      blockers: (t.blockers as string[]) || (t.warnings as string[]) || [],
      description: (t.description as string) || undefined,
    }));

    return {
      tasks,
      totalStoryPoints: tasks.reduce((sum: number, t: TaskItem) => sum + t.storyPoints, 0),
      sprintCapacity: capacityPoints,
      overCapacity: tasks.reduce((sum: number, t: TaskItem) => sum + t.storyPoints, 0) > capacityPoints,
      warnings: (raw.warnings as string[]) || (raw.blockers as string[]) || [],
      recommendations: (raw.recommendations as string[]) || (raw.suggestions as string[]) || [],
      dependencyGraph: (raw.dependencies || raw.dependencyGraph || []).map((d: Record<string, unknown>) => ({
        from: (d.from as string) || (d.source as string) || "",
        to: (d.to as string) || (d.target as string) || "",
        type: (d.type as "blocks" | "related" | "requires") || "blocks",
      })),
    };
  } catch {
    return null;
  }
}
