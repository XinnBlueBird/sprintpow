"use client";

import { useState } from "react";
import { FileText, Play, Loader2 } from "lucide-react";

interface BacklogInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

const SAMPLE_BACKLOG = `As a user, I want to register with email and password so that I can create an account
As a user, I want to log in with my credentials so that I can access the dashboard
As a user, I want to reset my password via email so that I can recover my account
As a user, I want to view my profile page so that I can see my account details
As a user, I want to edit my profile information so that I can update my name and avatar
As a user, I want to create a new project so that I can organize my work
As a user, I want to add tasks to a project so that I can track work items
As a user, I want to assign tasks to team members so that work is distributed
As a user, I want to set task priorities so that the team knows what to focus on
As a user, I want to view a kanban board so that I can see task status at a glance
As a user, I want to receive email notifications so that I stay informed of updates
As an admin, I want to manage user roles so that I can control access levels
As an admin, I want to view usage analytics so that I can track team productivity
As a user, I want to search tasks by keyword so that I can find items quickly
As a user, I want to export project data as CSV so that I can share with stakeholders`;

export default function BacklogInput({ onAnalyze, isAnalyzing }: BacklogInputProps) {
  const [text, setText] = useState("");

  const handleAnalyze = () => {
    if (text.trim()) {
      onAnalyze(text.trim());
    }
  };

  const loadSample = () => {
    setText(SAMPLE_BACKLOG);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-200">Backlog Input</h3>
        </div>
        <button
          onClick={loadSample}
          className="text-xs text-slate-500 hover:text-amber-500 transition-colors"
        >
          Load Sample
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your backlog items here, one per line...&#10;&#10;Example:&#10;As a user, I want to log in with email...&#10;As a user, I want to view the dashboard..."
        className="flex-1 w-full p-3 rounded-lg text-sm resize-none bg-[#0f0f17] border border-[#2a2a3a] text-slate-300 placeholder-slate-600 leading-relaxed"
        style={{ minHeight: "200px" }}
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-slate-600">
          {text.split("\n").filter((l) => l.trim()).length} items
        </span>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !text.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Analyze with MiMo
            </>
          )}
        </button>
      </div>
    </div>
  );
}
