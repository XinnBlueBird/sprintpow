import Link from "next/link";
import {
  Zap,
  Target,
  Brain,
  BarChart3,
  ArrowRight,
  Layers,
  Users,
  GitBranch,
} from "lucide-react";

const features = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: "AI-Powered Estimation",
    description:
      "MiMo v2.5 Pro analyzes your backlog items and provides accurate story point estimates using Fibonacci scale methodology.",
  },
  {
    icon: <GitBranch className="w-5 h-5" />,
    title: "Dependency Detection",
    description:
      "Automatically identifies task dependencies and potential blockers before your sprint begins, reducing mid-sprint surprises.",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Capacity Optimization",
    description:
      "Calculates realistic sprint capacity based on team size, sprint duration, and historical velocity to prevent overcommitment.",
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Kanban Board",
    description:
      "Visual task management with drag-and-drop Kanban board. Track items from backlog through sprint, in-progress, to done.",
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Smart Allocation",
    description:
      "AI suggests which items should be included in the current sprint based on priority, dependencies, and available capacity.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Team Planning",
    description:
      "Configure team parameters and get tailored sprint plans. Adjust developers, sprint length, and velocity factor for precision.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f0f17" }}>
      {/* Navigation */}
      <nav className="border-b border-[#2a2a3a] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold text-white">SprintPow</span>
          </div>
          <Link
            href="/workspace"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 transition-colors"
          >
            Open Workspace
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a3a] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-xs text-slate-400">
            Powered by MiMo v2.5 Pro
          </span>
        </div>

        <h1 className="text-5xl font-bold text-white leading-tight mb-6">
          Sprint Planning,
          <br />
          <span className="text-amber-500">Intelligently Optimized</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          SprintPow uses advanced AI to analyze your backlog, estimate story
          points, detect dependencies, and optimize sprint allocation. Stop
          guessing, start planning with confidence.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/workspace"
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-base font-semibold text-black bg-amber-500 hover:bg-amber-400 transition-colors"
          >
            <Zap className="w-5 h-5" />
            Start Planning
          </Link>
          <a
            href="#features"
            className="px-6 py-3 rounded-lg text-base font-medium text-slate-300 border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div
          className="rounded-xl p-8"
          style={{
            backgroundColor: "#1a1a2e",
            border: "1px solid #2a2a3a",
          }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {[
              {
                step: "1",
                label: "Paste Backlog",
                desc: "Add your user stories and backlog items",
              },
              {
                step: "2",
                label: "Set Capacity",
                desc: "Configure team size, sprint days, velocity",
              },
              {
                step: "3",
                label: "AI Analysis",
                desc: "MiMo estimates points, finds dependencies",
              },
              {
                step: "4",
                label: "Plan Sprint",
                desc: "Review allocation on the Kanban board",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {s.label}
                </h3>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">
          Everything You Need for Better Sprints
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-lg p-5 hover:-translate-y-0.5 transition-transform"
              style={{
                backgroundColor: "#1e1e2e",
                border: "1px solid #2a2a3a",
              }}
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a3a] px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-500">SprintPow</span>
          </div>
          <span className="text-xs text-slate-600">
            MIT License
          </span>
        </div>
      </footer>
    </div>
  );
}
