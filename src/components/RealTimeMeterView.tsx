import React, { useState, useEffect } from "react";
import { Activity, Clock, Users, Play, Square, Sparkles, RefreshCw, Lock } from "lucide-react";

interface Contributor {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
}

interface RealTimeMeterViewProps {
  userRole: "admin" | "member";
  liveState: {
    active: boolean;
    title: string;
    startTime: string;
    elapsedSeconds: number;
    hourlyBurnRate: number;
    runningCost: number;
    estimatedEndCost: number;
    attendees: Contributor[];
  };
  onToggleActive: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

export default function RealTimeMeterView({
  userRole,
  liveState,
  onToggleActive,
  onRefresh
}: RealTimeMeterViewProps) {
  const [cost, setCost] = useState(liveState.runningCost);
  const [elapsed, setElapsed] = useState(liveState.elapsedSeconds);

  // Per second rate calculation
  const burnRatePerSecond = liveState.hourlyBurnRate / 3600;

  // Sync internal state with props updates
  useEffect(() => {
    setCost(liveState.runningCost);
    setElapsed(liveState.elapsedSeconds);
  }, [liveState]);

  // Counting loop rolls up smoothly in the browser every second!
  useEffect(() => {
    let interval: any = null;
    if (liveState.active) {
      interval = setInterval(() => {
        setCost((prev) => prev + burnRatePerSecond);
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [liveState.active, burnRatePerSecond]);

  const formatElapsedTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const formatRupee = (val: number) => {
    return "₹" + val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Time-is-Money Ticker <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
          </h2>
          <p className="text-sm text-slate-400">
            Immersive presentation view showing the exact monetary burn loss of corporate alignment meetings
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="p-2.5 bg-slate-900 border border-slate-700/60 hover:bg-slate-800 text-slate-300 rounded-xl transition-all cursor-pointer shadow shrink-0"
            title="Refresh Ledger Cache"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleActive}
            className={`flex items-center gap-2 font-semibold py-2.5 px-5 rounded-xl text-sm transition-all shadow-lg border cursor-pointer ${
              liveState.active
                ? "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/10 border-rose-400/20"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:text-black shadow-emerald-500/10 border-emerald-400/20"
            }`}
          >
            {liveState.active ? (
              <>
                <Square className="w-4 h-4 text-white fill-white shrink-0" /> Halt Burn Engine
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-slate-950 fill-slate-950 shrink-0" /> Boot Burn Engine
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Glowing Burn Ticker Card */}
        <div className="lg:col-span-2 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-8 border border-slate-700/60 relative overflow-hidden flex flex-col justify-between min-h-[400px] shadow-2xl shadow-indigo-500/5">
          {/* Cyberpunk grid decorations */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-rose-500/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between text-xs tracking-widest uppercase font-bold text-slate-500">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${liveState.active ? "bg-rose-500 animate-ping" : "bg-slate-600"}`} />
              {liveState.active ? "Burning Corporate Assets Live" : "Burn Ticker Paused"}
            </span>
            <span className="font-mono">{formatElapsedTime(elapsed)} Elapsed</span>
          </div>

          <div className="relative z-10 my-10 text-center space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 max-w-lg mx-auto leading-relaxed">
              "{liveState.title}"
            </h3>
            {userRole === "admin" ? (
              <div className="text-5xl sm:text-7xl font-mono font-black text-rose-500 tracking-tight transition-all tabular-nums leading-none">
                {formatRupee(cost)}
              </div>
            ) : (
              <div className="text-5xl sm:text-7xl font-mono font-black text-indigo-400 tracking-tight transition-all tabular-nums leading-none">
                {formatElapsedTime(elapsed)}
              </div>
            )}
            <p className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider">
              {userRole === "admin" ? "Incurred Session Financial Burn Loss" : "Active Elapsed Clock Time"}
            </p>
            <p className="text-[11px] text-slate-450 font-medium">
              {userRole === "admin" ? (
                <>Accumulates at a constant coefficient of <span className="font-mono text-slate-200">₹{liveState.hourlyBurnRate}/hr</span></>
              ) : (
                <>Monitoring team collaborative alignment metrics live</>
              )}
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-500 mb-1 font-semibold uppercase tracking-wider text-[10px]">Active Workplace Members</p>
              <p className="font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400 shrink-0" /> {liveState.attendees?.length || 0} attendees
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                {userRole === "admin" ? "Simulated 1h Loss Projection" : "Target Session Duration"}
              </p>
              <p className="font-bold text-white flex items-center gap-1.5 justify-end">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                {userRole === "admin" ? formatRupee(liveState.estimatedEndCost) : "60m Projection"}
              </p>
            </div>
          </div>
        </div>

        {/* Live attendees contribution rates list */}
        <div className="lg:col-span-1 bg-slate-800/40 rounded-2xl p-6 border border-slate-700/40 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" /> {userRole === "admin" ? "Active Burn Roles" : "Active Session Partners"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Contributors currently logged in active workspace meeting sessions
              </p>
            </div>

            <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
              {liveState.attendees.map((att) => {
                // Individual run costs = (att.hourlyRate / 3600) * elapsed
                const personalCost = (att.hourlyRate / 3600) * elapsed;

                return (
                  <div key={att.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/30 flex justify-between items-center text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-white truncate">{att.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{att.role}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-slate-300">
                        {userRole === "admin" ? `₹${att.hourlyRate}/hr` : "Live Partner"}
                      </p>
                      {liveState.active && userRole === "admin" && (
                        <p className="text-[9px] text-emerald-400 font-mono mt-0.5">
                          Incurred: ₹{personalCost.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0 animate-pulse" />
            <div className="text-xs text-slate-400 leading-normal">
              <strong>Interactive Ticker:</strong> Start or stop the clock during team presentations or mock pitches. Numbers will recalculate to fit actual employee rate weights.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
