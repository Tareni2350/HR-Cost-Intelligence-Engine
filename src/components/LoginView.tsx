import React, { useState } from "react";
import { Lock, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

interface LoginProps {
  onLogin: (role: "admin" | "member", userName: string) => void;
}

export default function LoginView({ onLogin }: LoginProps) {
  const [role, setRole] = useState<"admin" | "member">("admin");
  const [name, setName] = useState("Malathi Swaminathan");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role, name || "Enterprise Executive");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-6 relative overflow-hidden">
      {/* Background blur decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full filter blur-3xl" />

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 p-8 shadow-2xl relative z-10">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-indigo-400">
            <ShieldCheck className="w-10 h-10" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            HR COST INTELLIGENCE <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            AI-driven meeting attribution, dynamic rate calculation, and cost visibility
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Priyanjali Sen"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Role-Based Access
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                  role === "admin"
                    ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="font-semibold text-white">Administrator</span>
                <span className="text-[10px] opacity-80">Full Financial Access</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("member")}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                  role === "member"
                    ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="font-semibold text-white">Viewer/Auditor</span>
                <span className="text-[10px] opacity-80">Workforce Alignment View</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/40 flex items-start gap-3">
            <Lock className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
            <div className="text-xs text-slate-400 leading-relaxed">
              {role === "admin" ? (
                <span>
                  <strong>Admin Privileges Triggered:</strong> You have authorization to adjust corporate hourly levels, map projects, and access audit logs directly.
                </span>
              ) : (
                <span>
                  <strong>Viewer Access Toggled:</strong> Personnel metadata, team distribution patterns, and compliance alert files can be reviewed with absolute compensation details restricted.
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:text-black font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            Enter Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/40 text-center text-xs text-slate-500">
          Demo Credential • Built Securely • Enterprise MVP Ready
        </div>
      </div>
    </div>
  );
}
