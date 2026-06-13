import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  AlertTriangle,
  Briefcase,
  Calendar,
  DollarSign,
  Bot,
  Sliders,
  Sparkles,
  Users,
  ShieldCheck,
  Power,
  RefreshCw,
  Clock,
  Menu,
  X,
  FileText
} from "lucide-react";

import LoginView from "./components/LoginView";
import DashboardView from "./components/DashboardView";
import CostAnalyticsView from "./components/CostAnalyticsView";
import ProjectsView from "./components/ProjectsView";
import AnomalyMonitoringView from "./components/AnomalyMonitoringView";
import AiCopilotView from "./components/AiCopilotView";
import RealTimeMeterView from "./components/RealTimeMeterView";
import { Meeting, Project, Employee, Anomaly } from "./types";

type Tab = "dashboard" | "analytics" | "projects" | "watchdog" | "meter" | "copilot" | "audit";

interface Toast {
  message: string;
  type: "success" | "warn" | "info";
}

export default function App() {
  // Auth roles
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "member">("admin");
  const [userName, setUserName] = useState("Malathi Swaminathan");

  // Navigation page
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data ledger states
  const [summary, setSummary] = useState({
    totalMeetingCost: 125400,
    totalHours: 449,
    activeProjectsCount: 4,
    averageAttributionConfidence: 94.2,
    totalAnomalies: 2,
    costThisWeek: 52000,
    costThisMonth: 124000
  });

  const [meetings, setMeetings] = useState<(Meeting & { projectName: string; attendeesDetails: any[] })[]>([]);
  const [projects, setProjects] = useState<(Project & { actualSpend: number; hoursSpent: number; meetingCount: number })[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [forecasts, setForecasts] = useState<any[]>([]);

  // Ticking Live cost state polled or calculated every few secs
  const [liveState, setLiveState] = useState({
    active: true,
    title: "HR Cost Dashboard Real-Time Ingest System Walkthrough",
    startTime: new Date().toISOString(),
    elapsedSeconds: 2040,
    hourlyBurnRate: 9200,
    runningCost: 5210,
    estimatedEndCost: 9200,
    attendees: [] as any[]
  });

  // Client Alerts Toast indicators
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: "success" | "warn" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Login event callback
  const handleLogin = (role: "admin" | "member", name: string) => {
    setUserRole(role);
    setUserName(name || "Executive");
    setIsLoggedIn(true);
    showToast(`Access granted: Synchronized role as ${role === "admin" ? "Financial Administrator" : "Finance View Only"}`, "success");
  };

  // Pull ledger metrics from server backend
  const fetchAllData = async () => {
    try {
      const headers = { "x-user-role": userRole };

      // 1. Dashboard summary stats
      const summaryRes = await fetch("/api/dashboard/summary");
      if (summaryRes.ok) {
        const data = await summaryRes.ok ? await summaryRes.json() : summary;
        setSummary(data);
      }

      // 2. Relational meetings
      const meetingsRes = await fetch("/api/meetings");
      if (meetingsRes.ok) {
        setMeetings(await meetingsRes.json());
      }

      // 3. Project totals
      const projectsRes = await fetch("/api/projects");
      if (projectsRes.ok) {
        setProjects(await projectsRes.json());
      }

      // 4. Employee listing (Masked or unmasked dynamically on backend)
      const empRes = await fetch("/api/employees", { headers });
      if (empRes.ok) {
        setEmployees(await empRes.json());
      }

      // 5. Active compliance alerts
      const anomRes = await fetch("/api/anomalies");
      if (anomRes.ok) {
        setAnomalies(await anomRes.json());
      }

      // 6. Forecast stats
      const forecastRes = await fetch("/api/forecasts");
      if (forecastRes.ok) {
        setForecasts(await forecastRes.json());
      }

      // 7. Audit log events
      const logsRes = await fetch("/api/audit-logs");
      if (logsRes.ok) {
        setAuditLogs(await logsRes.json());
      }

      // 8. Ticking active state
      const liveRes = await fetch("/api/live-meeting");
      if (liveRes.ok) {
        setLiveState(await liveRes.json());
      }
    } catch (err) {
      console.error("Networking connection failed on endpoints:", err);
    }
  };

  // Run initial pull and start sync timer
  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
      // Fast polling for ticking live parameters
      const timer = setInterval(async () => {
        try {
          const liveRes = await fetch("/api/live-meeting");
          if (liveRes.ok) {
            setLiveState(await liveRes.json());
          }
        } catch (e) {
          // silent fallback
        }
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [isLoggedIn, userRole]);

  // Sync Calendar endpoints
  const handleSyncCalendar = async () => {
    try {
      const res = await fetch("/api/calendar/sync", { method: "POST" });
      if (res.ok) {
        const payload = await res.json();
        showToast(payload.message || "Calendar synced completely", "success");
        await fetchAllData();
      } else {
        showToast("Error executing calendar sync pipeline", "warn");
      }
    } catch (err) {
      showToast("Sync API endpoints timeout", "warn");
    }
  };

  // Manual project reassignment AI API
  const handleClassifyMeeting = async (meetingId: string, title?: string, desc?: string) => {
    try {
      const res = await fetch("/api/meeting/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId, title, description: desc })
      });
      if (res.ok) {
        const result = await res.json();
        showToast(`AI attribution successful: Linked meeting to '${result.project_name}'`, "success");
        await fetchAllData();
      } else {
        showToast("AI classification pipeline failed", "warn");
      }
    } catch (err) {
      showToast("Connection to LLM models timeout", "warn");
    }
  };

  // Add initiative endpoint
  const handleAddProject = async (p: { name: string; description: string; budget: number }) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        showToast(`Project '${p.name}' initiated in corporate registry`, "success");
        await fetchAllData();
      } else {
        showToast("Failed to record new project", "warn");
      }
    } catch (err) {
      showToast("Service connection issues", "warn");
    }
  };

  // Resolve meeting cost leaks
  const handleResolveAnomaly = async (anomalyId: string) => {
    try {
      const res = await fetch("/api/anomalies/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anomalyId })
      });
      if (res.ok) {
        showToast("Compliance marked resolved successfully.", "success");
        await fetchAllData();
      } else {
        showToast("Could not ignore anomaly", "warn");
      }
    } catch (err) {
      showToast("Failed to connect to endpoints", "warn");
    }
  };

  // Fetch AI anomaly analyses explanations
  const handleFetchAIAudit = async (anomalyId: string): Promise<string> => {
    try {
      const res = await fetch("/api/anomalies/ai-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anomalyId })
      });
      if (res.ok) {
        const result = await res.json();
        return result.aiAuditSummary;
      }
    } catch (err) {
      console.error(err);
    }
    return "Failed to fetch response. Please verify your GEMINI_API_KEY parameters.";
  };

  // Executive chat companion query submission
  const handleSendMessage = async (query: string): Promise<string> => {
    try {
      const res = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      if (res.ok) {
        const result = await res.json();
        return result.answer;
      }
    } catch (err) {
      console.error(err);
    }
    return "Failed to establish a chat callback response. Ensure your container has API networks enabled.";
  };

  // Toggle active ticker mapping
  const handleToggleLive = async () => {
    try {
      const res = await fetch("/api/live-meeting/toggle", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        showToast(data.active ? "Burn ticker engine booted" : "Burn ticker suspended", "info");
        await fetchAllData();
      }
    } catch (e) {
      showToast("Live toggler connection issue", "warn");
    }
  };

  // Logout trigger
  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast("Logged out from the financial console", "info");
  };

  // Display login screen if not authenticated
  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Sidebar Layout Navigation
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: <Sliders className="w-4 h-4" /> },
    { id: "meter", label: "Real-Time Meter", icon: <Activity className="w-4 h-4" /> },
    { id: "analytics", label: "Meeting Ledger", icon: <Calendar className="w-4 h-4" /> },
    { id: "projects", label: "Initiatives", icon: <Briefcase className="w-4 h-4" /> },
    { id: "watchdog", label: "Watchdog Alerts", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "copilot", label: "AI Analyst Copilot", icon: <Bot className="w-4 h-4" /> },
    { id: "audit", label: "System Audits", icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex relative">
      {/* Absolute Decorative Grid blur elements */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-indigo-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-600/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Floating Client Toasts Alerts */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl border shadow-xl flex items-center gap-3 backdrop-blur-md max-w-sm font-mono text-xs ${
              toast.type === "success"
                ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/30"
                : toast.type === "warn"
                ? "bg-rose-950/90 text-rose-300 border-rose-500/30"
                : "bg-indigo-950/90 text-indigo-300 border-indigo-500/30"
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-slate-950/60 border-r border-slate-800/80 p-6 shrink-0 relative z-20 backdrop-blur-md">
        <div>
          {/* System brand header */}
          <div className="flex items-center gap-2.5 px-2 mb-8 text-white font-black tracking-widest text-xs">
            <span className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span>COST INTEL</span>
          </div>

          {/* Nav groups */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {item.id === "watchdog" && anomalies.filter(a => !a.isResolved).length > 0 && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                  {item.id === "meter" && liveState.active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Executive Identity Sidebar Footer */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-indigo-400 border border-slate-700">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0" />
                {userRole === "admin" ? "Financial Admin" : "General View Only"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 py-2.5 rounded-xl text-xs font-semibold hover:text-white cursor-pointer transition-all text-slate-400"
          >
            <Power className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header and Drawer Navigation option */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between lg:hidden bg-slate-950/80 border-b border-slate-800/60 p-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2 font-black text-xs text-white">
            <span className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <ShieldCheck className="w-4.5 h-4.5" />
            </span>
            <span>COST INTEL</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 bg-slate-800 border border-slate-700/60 rounded-lg text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile menu collapsible */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-[57px] bg-slate-950/95 z-30 p-6 overflow-y-auto space-y-6 lg:hidden flex flex-col justify-between">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer ${
                      isActive ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-white">{userName}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{userRole} access</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* 2. Main content viewport section */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-10 w-full max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === "dashboard" && (
                <DashboardView
                  summary={summary}
                  meetings={meetings}
                  projects={projects}
                  userRole={userRole}
                />
              )}

              {activeTab === "meter" && (
                <RealTimeMeterView
                  userRole={userRole}
                  liveState={liveState}
                  onToggleActive={handleToggleLive}
                  onRefresh={fetchAllData}
                />
              )}

              {activeTab === "analytics" && (
                <CostAnalyticsView
                  meetings={meetings}
                  userRole={userRole}
                  onSyncCalendar={handleSyncCalendar}
                  onClassifyMeeting={handleClassifyMeeting}
                />
              )}

              {activeTab === "projects" && (
                <ProjectsView
                  projects={projects}
                  userRole={userRole}
                  onAddProject={handleAddProject}
                  auditLogs={auditLogs}
                />
              )}

              {activeTab === "watchdog" && (
                <AnomalyMonitoringView
                  anomalies={anomalies}
                  userRole={userRole}
                  onResolveAnomaly={handleResolveAnomaly}
                  onFetchAIAudit={handleFetchAIAudit}
                />
              )}

              {activeTab === "copilot" && (
                <AiCopilotView onSendMessage={handleSendMessage} />
              )}

              {activeTab === "audit" && (
                <div className="space-y-6 animate-fade-in text-slate-100">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                      Corporate FinOps Ledger Audits
                    </h2>
                    <p className="text-sm text-slate-400">
                      Decentralized logging of active sync pipelines, rate updates, and compliance exceptions
                    </p>
                  </div>

                  <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 overflow-hidden">
                    <div className="p-4 border-b border-slate-700 bg-slate-950/20 grid grid-cols-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                      <div className="col-span-1">Timestamp / Actor</div>
                      <div className="col-span-1">Action Code</div>
                      <div className="col-span-2">Details Mapping</div>
                    </div>

                    <div className="divide-y divide-slate-800">
                      {auditLogs.length === 0 ? (
                        <div className="text-center py-12 text-xs text-slate-500 font-mono">
                          Zero auditable events tracked in corporate history ledger
                        </div>
                      ) : (
                        auditLogs.map((log) => (
                          <div key={log.id} className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2 text-xs font-mono leading-relaxed hover:bg-slate-800/10 transition-colors">
                            <div className="col-span-1 text-slate-400">
                              <p className="text-[10px]">{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}</p>
                              <p className="text-[9px] text-indigo-400 mt-0.5 font-bold uppercase">{log.user}</p>
                            </div>
                            <div className="col-span-1">
                              <span className="p-1 rounded text-[9px] font-bold bg-slate-900 border border-slate-700/60 text-emerald-400 uppercase">
                                {log.action}
                              </span>
                            </div>
                            <div className="col-span-2 text-slate-300">
                              {log.details}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
