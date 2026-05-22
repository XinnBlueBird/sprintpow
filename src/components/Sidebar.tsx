"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  Settings,
  Users,
  Calendar,
  Clock,
  Gauge,
} from "lucide-react";
import type { TeamCapacity } from "@/lib/types";
import { calculateCapacity } from "@/lib/types";

interface SidebarProps {
  capacity: TeamCapacity;
  onCapacityChange: (cap: TeamCapacity) => void;
}

export default function Sidebar({ capacity, onCapacityChange }: SidebarProps) {
  const pathname = usePathname();
  const [isEditing, setIsEditing] = useState(false);
  const totalPoints = calculateCapacity(capacity);

  return (
    <aside className="w-[280px] min-h-screen flex flex-col" style={{ backgroundColor: "#1a1a2e" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#2a2a3a]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold text-white">SprintPow</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 border-b border-[#2a2a3a]">
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-amber-500 bg-amber-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/workspace"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/workspace"
                  ? "text-amber-500 bg-amber-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Gauge className="w-4 h-4" />
              Workspace
            </Link>
          </li>
        </ul>
      </nav>

      {/* Capacity Settings */}
      <div className="px-4 py-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Sprint Capacity
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Capacity Display */}
        <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: "#0f0f17" }}>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-500">{totalPoints}</div>
            <div className="text-xs text-slate-500 mt-0.5">Story Points Available</div>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                <Users className="w-3 h-3" />
                Developers
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={capacity.developers}
                onChange={(e) =>
                  onCapacityChange({ ...capacity, developers: Number(e.target.value) })
                }
                className="w-full px-3 py-1.5 rounded-md text-sm bg-[#0f0f17] border border-[#2a2a3a] text-white"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                <Calendar className="w-3 h-3" />
                Sprint Days
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={capacity.sprintDays}
                onChange={(e) =>
                  onCapacityChange({ ...capacity, sprintDays: Number(e.target.value) })
                }
                className="w-full px-3 py-1.5 rounded-md text-sm bg-[#0f0f17] border border-[#2a2a3a] text-white"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                <Clock className="w-3 h-3" />
                Hours / Day
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={capacity.hoursPerDay}
                onChange={(e) =>
                  onCapacityChange({ ...capacity, hoursPerDay: Number(e.target.value) })
                }
                className="w-full px-3 py-1.5 rounded-md text-sm bg-[#0f0f17] border border-[#2a2a3a] text-white"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                <Gauge className="w-3 h-3" />
                Velocity Factor
              </label>
              <input
                type="number"
                min={0.1}
                max={1.0}
                step={0.05}
                value={capacity.velocityFactor}
                onChange={(e) =>
                  onCapacityChange({ ...capacity, velocityFactor: Number(e.target.value) })
                }
                className="w-full px-3 py-1.5 rounded-md text-sm bg-[#0f0f17] border border-[#2a2a3a] text-white"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Developers</span>
              <span className="text-slate-300">{capacity.developers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Sprint Days</span>
              <span className="text-slate-300">{capacity.sprintDays}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Hours / Day</span>
              <span className="text-slate-300">{capacity.hoursPerDay}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Velocity</span>
              <span className="text-slate-300">{capacity.velocityFactor}</span>
            </div>
          </div>
        )}
      </div>

      {/* Formula */}
      <div className="px-4 py-3 border-t border-[#2a2a3a]">
        <p className="text-[10px] text-slate-600 leading-relaxed">
          {capacity.developers} devs x {capacity.sprintDays} days x {capacity.hoursPerDay}h/day x{" "}
          {capacity.velocityFactor} velocity = {capacity.developers * capacity.sprintDays * capacity.hoursPerDay * capacity.velocityFactor}h
          {" / 4h per point = "}
          <span className="text-amber-500 font-medium">{totalPoints} points</span>
        </p>
      </div>
    </aside>
  );
}
