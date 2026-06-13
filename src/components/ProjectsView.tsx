import React, { useState } from "react";
import { Briefcase, Plus, TrendingUp, AlertTriangle, CheckCircle, Sliders, Settings } from "lucide-react";
import { Project } from "../types";

interface ProjectsProps {
  projects: (Project & { actualSpend: number; hoursSpent: number; meetingCount: number })[];
  userRole: "admin" | "member";
  onAddProject: (p: { name: string; description: string; budget: number }) => Promise<void>;
  auditLogs: any[];
}

export default function ProjectsView({ projects, userRole, onAddProject, auditLogs }: ProjectsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter audit logs for projects
  const projectAuditLogs = auditLogs
    .filter(log => log.action === "PROJECT_CREATED" || log.action === "AI_PROJECT_ATTRIBUTION")
    .slice(0, 4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !budget) return;
    setIsSubmitting(true);
    await onAddProject({ name, description, budget: Number(budget) });
    setIsSubmitting(false);
    setShowAddModal(false);
    setName("");
    setDescription("");
    setBudget("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "completed":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Initiatives Tracker
          </h2>
          <p className="text-sm text-slate-400">
            Define corporate project boundaries and manage financial budget overhead limits
          </p>
        </div>
        {userRole === "admin" ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all flex items-center gap-2 self-start cursor-pointer shadow-lg shadow-indigo-600/15 border border-indigo-400/20"
          >
            <Plus className="w-4 h-4" /> Build Initiative
          </button>
        ) : (
          <div className="text-xs bg-slate-800 border border-slate-700/60 p-2.5 rounded-xl text-slate-400 self-start">
            🔒 Creation limited to administrators
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects Cards List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => {
              const burnPercentage = Math.min(100, Math.round((proj.actualSpend / (proj.budget || 1)) * 100));
              const isOverran = proj.actualSpend > proj.budget;

              return (
                <div key={proj.id} className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-between relative overflow-hidden">
                  {/* Danger Glow for Overbudget */}
                  {isOverran && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500" />
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-4 gap-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor(proj.status)}`}>
                        {proj.status}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 font-mono">
                        {proj.meetingCount} mapped meetings
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 truncate">
                      {proj.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-2">
                      {proj.description || "No strategic summary provided."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Progress Bar budgeted vs spent */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Burn Rate</span>
                        <span className={`font-bold font-mono ${isOverran ? 'text-rose-400' : 'text-indigo-400'}`}>
                          {burnPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950/50 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOverran ? "bg-gradient-to-r from-red-500 to-rose-600" : "bg-gradient-to-r from-indigo-500 to-indigo-600"
                          }`}
                          style={{ width: `${burnPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Financial details */}
                    <div className="pt-4 border-t border-slate-700/40 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-400 mb-0.5">Project Budget</p>
                        <p className="font-bold text-white font-mono">
                          ₹{proj.budget.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 mb-0.5">Meeting Cost</p>
                        <p className={`font-bold font-mono ${isOverran ? 'text-rose-400' : 'text-slate-200'}`}>
                          ₹{proj.actualSpend.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit / Alignment History Side Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/40 space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" /> Compliance Mapping
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Recent project creation and classification events in local ledger
              </p>
            </div>

            <div className="space-y-4">
              {projectAuditLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No project modification history logged yet
                </div>
              ) : (
                projectAuditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/30 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="font-bold uppercase text-indigo-400 font-mono">
                        {log.action}
                      </span>
                      <span className="text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-normal">
                      {log.details}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Project Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" /> Initiate Initiative Schema
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-bold px-2 py-1 text-sm shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NextGen Microservices Refactor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Strategic Scope / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Define the tech boundaries of this specific project mapping tag..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Assigned Budget (INR ₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer"
                >
                  {isSubmitting ? "Syncing Schema..." : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
