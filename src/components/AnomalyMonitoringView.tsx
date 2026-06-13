import React, { useState } from "react";
import { AlertTriangle, Sparkles, CheckCircle, RefreshCw, XCircle, Clock } from "lucide-react";
import { Anomaly } from "../types";

interface AnomalyMonitoringProps {
  anomalies: Anomaly[];
  userRole: "admin" | "member";
  onResolveAnomaly: (id: string) => Promise<void>;
  onFetchAIAudit: (id: string) => Promise<string>;
}

export default function AnomalyMonitoringView({
  anomalies,
  userRole,
  onResolveAnomaly,
  onFetchAIAudit
}: AnomalyMonitoringProps) {
  const [loadingAuditId, setLoadingAuditId] = useState<string | null>(null);
  const [selectedAuditResult, setSelectedAuditResult] = useState<{
    anomalyId: string;
    text: string;
  } | null>(null);

  const activeAnomalies = anomalies.filter((a) => !a.isResolved);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "high":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
  };

  const handleAuditRequest = async (anomId: string) => {
    setLoadingAuditId(anomId);
    try {
      const summary = await onFetchAIAudit(anomId);
      setSelectedAuditResult({ anomalyId: anomId, text: summary });
    } catch (err) {
      console.error(err);
    }
    setLoadingAuditId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          FinOps Anomaly Watchdog
        </h2>
        <p className="text-sm text-slate-400">
          Unattributed meetings, bloated attendee sizes, and budget overrun warnings triggered by heuristical checks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List of Alerts */}
        <div className="lg:col-span-2 space-y-4">
          {activeAnomalies.length === 0 ? (
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-12 text-center rounded-2xl flex flex-col items-center justify-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">Full budget compliance reached</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Meeting audit structures are operating efficiently. Zero active cost lekages registered!
                </p>
              </div>
            </div>
          ) : (
            activeAnomalies.map((anom) => (
              <div
                key={anom.id}
                className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
              >
                {/* Visual Severity Accent Line */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    anom.severity === "high" ? "bg-rose-500" : anom.severity === "medium" ? "bg-amber-500" : "bg-indigo-500"
                  }`}
                />

                <div className="space-y-3 pl-2 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadge(anom.severity)}`}>
                      {anom.severity} RISK
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                      {anom.type}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug truncate">
                    {anom.meetingTitle}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    {anom.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0 self-stretch sm:self-center justify-between sm:justify-center pt-2 sm:pt-0 border-t sm:border-0 border-slate-700/50">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Flagged Cost</p>
                    <p className="text-sm font-bold font-mono text-rose-400">
                      ₹{anom.cost.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAuditRequest(anom.id)}
                      disabled={loadingAuditId === anom.id}
                      className="bg-slate-900 border border-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      {loadingAuditId === anom.id ? "Auditing..." : "AI Audit"}
                    </button>

                    <button
                      onClick={() => onResolveAnomaly(anom.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer shrink-0 shadow"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* AI Explainability & Audit Panel */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/40 min-h-[300px] flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl" />
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> Gemini AI Audit Explainability
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Query model explanations regarding resource leakages and dynamic remediation guidelines
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {selectedAuditResult ? (
                <div className="space-y-4 font-mono animate-scale-up">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase border-b border-indigo-500/10 pb-1 flex items-center justify-between">
                    <span>Audit Verdict</span>
                    <span className="text-slate-500">ID: {selectedAuditResult.anomalyId}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-700/40">
                    {selectedAuditResult.text}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-relaxed italic pr-2">
                    * Remediation saving calculations are projected based on current employee billing coefficients.
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-slate-500 space-y-2 flex flex-col items-center">
                  <AlertTriangle className="w-8 h-8 text-slate-600" />
                  <p>No audit analysis queried yet.</p>
                  <p className="max-w-[180px] leading-relaxed mx-auto">
                    Click "AI Audit" on any alert card to prompt a customized financial analysis.
                  </p>
                </div>
              )}
            </div>

            {selectedAuditResult && (
              <button
                onClick={() => setSelectedAuditResult(null)}
                className="w-full text-center bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white py-2 border border-slate-700/60 rounded-xl text-xs transition-all shrink-0 cursor-pointer"
              >
                Clear Audit Panel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
