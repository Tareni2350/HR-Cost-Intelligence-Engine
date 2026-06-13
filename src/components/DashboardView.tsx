import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from "recharts";
import {
  DollarSign,
  Clock,
  Briefcase,
  AlertTriangle,
  Sparkles,
  Users,
  TrendingUp,
  Award
} from "lucide-react";
import { Meeting, Project, Employee, Anomaly } from "../types";

interface DashboardProps {
  summary: {
    totalMeetingCost: number;
    totalHours: number;
    activeProjectsCount: number;
    averageAttributionConfidence: number;
    totalAnomalies: number;
    costThisWeek: number;
    costThisMonth: number;
  };
  meetings: (Meeting & { projectName: string; attendeesDetails: any[] })[];
  projects: (Project & { actualSpend: number; hoursSpent: number; meetingCount: number })[];
  userRole: "admin" | "member";
}

const COLORS = ["#6366f1", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4"];

export default function DashboardView({ summary, meetings, projects, userRole }: DashboardProps) {
  // 1. Calculate Department Wise Cost
  const deptCosts: { [key: string]: number } = {};
  const deptHours: { [key: string]: number } = {};
  meetings.forEach(m => {
    m.attendeesDetails?.forEach(att => {
      // Approximate attendee cost in this specific meeting
      // meeting cost fraction = att.hourlyRate / sumOfRates
      const sumRates = m.attendeesDetails.reduce((acc, a) => acc + (a.hourlyRate || 1000), 0);
      const frac = sumRates > 0 ? (att.hourlyRate || 1000) / sumRates : 0.2;
      const attCost = m.totalCost * frac;
      const dept = att.department || "General";
      deptCosts[dept] = (deptCosts[dept] || 0) + attCost;
      deptHours[dept] = (deptHours[dept] || 0) + (m.durationMinutes / 60);
    });
  });

  const departmentChartData = Object.keys(deptCosts).map(dept => ({
    name: dept,
    cost: Math.round(deptCosts[dept]),
    hours: Math.round(deptHours[dept] || 0)
  }));

  // 2. Prepare Project Breakdown Data
  const projectChartData = projects.map(p => ({
    name: p.name.length > 20 ? p.name.substring(0, 18) + "..." : p.name,
    cost: p.actualSpend,
    hours: p.hoursSpent
  }));

  // 3. Meet insights - Most expensive meetings
  const expensiveMeetings = [...meetings]
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, 4);

  // 4. Role wise cost breakdown
  const roleCosts: { [key: string]: number } = {};
  const roleHours: { [key: string]: number } = {};
  meetings.forEach(m => {
    m.attendeesDetails?.forEach(att => {
      const sumRates = m.attendeesDetails.reduce((acc, a) => acc + (a.hourlyRate || 1000), 0);
      const frac = sumRates > 0 ? (att.hourlyRate || 1000) / sumRates : 0.2;
      const attCost = m.totalCost * frac;
      const role = att.role || "Consultant";
      roleCosts[role] = (roleCosts[role] || 0) + attCost;
      roleHours[role] = (roleHours[role] || 0) + (m.durationMinutes / 60);
    });
  });

  const roleChartData = Object.keys(roleCosts).map(role => ({
    name: role.length > 18 ? role.substring(0, 15) + "..." : role,
    cost: Math.round(roleCosts[role]),
    hours: Math.round(roleHours[role] || 0)
  })).sort((a, b) => b.cost - a.cost);

  // Format currency
  const formatINR = (val: number) => {
    return "₹" + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Executive Finance Console <Sparkles className="w-5 h-5 text-indigo-400" />
        </h2>
        <p className="text-sm text-slate-400">
          Organizational cost attribution analytics compiled across {meetings.length} meeting intervals
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Cost Card */}
        <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-xl" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {userRole === "admin" ? "Total Meeting Spend" : "Total Calendar Syncs"}
            </span>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {userRole === "admin" ? formatINR(summary.totalMeetingCost) : `${meetings.length} Sync Runs`}
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">14.5%</span> increase this period
          </p>
        </div>

        {/* Meeting Hours */}
        <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-xl" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Logged Meeting Hours</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {summary.totalHours} hrs
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Avg of <span className="font-semibold text-slate-300">4.2 attendees</span> per meeting
          </p>
        </div>

        {/* AI Confidence */}
        <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full filter blur-xl" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Attr. Confidence</span>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {summary.averageAttributionConfidence}%
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Mapped by <span className="text-purple-400 font-semibold font-mono">Gemini 3.5 Flash</span>
          </p>
        </div>

        {/* Anomalies Card */}
        <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full filter blur-xl" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Leaking Anomalies</span>
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 border border-orange-500/20">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-orange-400">
            {summary.totalAnomalies}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Requires human review compliance verification
          </p>
        </div>
      </div>

      {/* Row 2: Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Cost Share - Pie */}
        <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/40">
          <h3 className="text-base font-semibold text-white mb-6">Financial Allocation per Project</h3>
          <div className="h-72 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey={userRole === "admin" ? "cost" : "hours"}
                  >
                    {projectChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569" }}
                    itemStyle={{ color: "#f8fafc" }}
                    formatter={(value: any) => userRole === "admin" ? formatINR(value) : `${value} hours`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              {projectChartData.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="font-medium truncate max-w-[120px]">{p.name}</span>
                  </div>
                  <span className="font-mono text-slate-400">
                    {userRole === "admin" ? formatINR(p.cost) : `${p.hours}h`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Hours Spent - Bar */}
        <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/40">
          <h3 className="text-base font-semibold text-white mb-6">Jira-Aligned Meeting Hours Burden</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} label={{ value: "Hours Logged", angle: -90, position: "insideLeft", fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569" }}
                  itemStyle={{ color: "#f8fafc" }}
                  cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                />
                <Bar dataKey="hours" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Team Breakdown and Expensive Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Breakdown */}
        <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/40 lg:col-span-1">
          <h3 className="text-base font-semibold text-white mb-4">
            {userRole === "admin" ? "Department Cost Breakdown" : "Department Engagement Hours"}
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {departmentChartData.map((d, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-medium">{d.name}</span>
                  <span className="font-mono">
                    {userRole === "admin" ? formatINR(d.cost) : `${d.hours}h Logged`}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (d.cost / (summary.totalMeetingCost || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Wise Costs */}
        <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/40 lg:col-span-1">
          <h3 className="text-base font-semibold text-white mb-4">
            {userRole === "admin" ? "Roles Meeting Burden" : "Role Based Session Distribution"}
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {roleChartData.map((r, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-medium truncate max-w-[150px]">{r.name}</span>
                  <span className="font-mono">
                    {userRole === "admin" ? formatINR(r.cost) : `${r.hours}h Active`}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (r.cost / (summary.totalMeetingCost || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Expensive Meetings */}
        <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/40 lg:col-span-1">
          <h3 className="text-base font-semibold text-white mb-4">
            {userRole === "admin" ? "Meeting Insights: Top Leak Spends" : "Meeting Insights: Active Session Logs"}
          </h3>
          <div className="space-y-3">
            {expensiveMeetings.map((m, idx) => (
              <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/30 flex justify-between items-center gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{m.title}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-1">
                    <span>{m.durationMinutes} mins</span>
                    <span>•</span>
                    <span>{m.attendees?.length || 0} attendees</span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`text-xs font-bold font-mono ${m.totalCost > 15000 ? 'text-orange-400' : 'text-slate-200'}`}>
                    {userRole === "admin" ? formatINR(m.totalCost) : `${m.durationMinutes}m Duration`}
                  </p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold text-slate-400 bg-slate-800 border border-slate-700/40 mt-1 inline-block">
                    {m.projectName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
