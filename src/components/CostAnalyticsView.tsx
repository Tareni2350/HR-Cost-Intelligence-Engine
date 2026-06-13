import React, { useState } from "react";
import {
  Calendar,
  Search,
  RefreshCw,
  Sparkles,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle,
  HelpCircle,
  Eye,
  Lock
} from "lucide-react";
import { Meeting } from "../types";

interface CostAnalyticsProps {
  meetings: (Meeting & { projectName: string; attendeesDetails: any[] })[];
  userRole: "admin" | "member";
  onSyncCalendar: () => Promise<void>;
  onClassifyMeeting: (id: string, title?: string, desc?: string) => Promise<void>;
}

export default function CostAnalyticsView({
  meetings,
  userRole,
  onSyncCalendar,
  onClassifyMeeting
}: CostAnalyticsProps) {
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [classifyingId, setClassifyingId] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    await onSyncCalendar();
    setIsSyncing(false);
  };

  const handleAIClassify = async (mId: string, title: string, desc: string) => {
    setClassifyingId(mId);
    await onClassifyMeeting(mId, title, desc);
    setClassifyingId(null);
  };

  // Extract list of existing projects for filtering dropdown
  const uniqueProjects = Array.from(new Set(meetings.map((m) => m.projectName))).filter(
    (name) => name !== "Unattributed"
  );

  // Apply search/filtering lists
  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.organizerEmail.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter =
      filterProject === "all" ||
      (filterProject === "unattributed" && m.projectName === "Unattributed") ||
      m.projectName === filterProject;

    return matchesSearch && matchesFilter;
  });

  const formatINR = (val: number) => {
    return "₹" + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  };

  const toggleExpand = (id: string) => {
    if (expandedMeetingId === id) {
      setExpandedMeetingId(null);
    } else {
      setExpandedMeetingId(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Dynamic Meeting ROI Ledger
          </h2>
          <p className="text-sm text-slate-400">
            Real-time calculations of meetings burn-rate against active workspace staff index
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all flex items-center gap-2.5 self-start cursor-pointer shadow-lg shadow-indigo-600/15 border border-indigo-400/20"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? "Connecting Calendar APIs..." : "Sync Calendar APIs"}
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/40 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search meetings, organizers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="all">All Initiatives mapping</option>
            <option value="unattributed">⚠️ Unattributed Only</option>
            {uniqueProjects.map((pName) => (
              <option key={pName} value={pName}>
                {pName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end text-xs text-slate-400 font-mono">
          Showing {filteredMeetings.length} of {meetings.length} meeting rows
        </div>
      </div>

      {/* Main Meetings Listing */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="bg-slate-800/20 py-20 rounded-2xl border border-dashed border-slate-700 text-center flex flex-col items-center justify-center p-6 space-y-4">
            <Calendar className="w-12 h-12 text-slate-600 animate-pulse" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-300">No synced meetings found</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Try syncing with calendar APIs using the button above to load actual workplace metadata.
              </p>
            </div>
          </div>
        ) : (
          filteredMeetings.map((meet) => {
            const isUnattributed = meet.projectName === "Unattributed";
            const isExpanded = expandedMeetingId === meet.id;
            const attendeeRates = meet.attendeesDetails || [];

            return (
              <div
                key={meet.id}
                className={`bg-slate-800/50 rounded-2xl p-5 border transition-all ${
                  isExpanded ? "border-slate-500 shadow-xl" : "border-slate-700/50 hover:border-slate-700"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Icon & Title Info */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 shrink-0 border border-indigo-500/20">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white leading-snug">
                          {meet.title}
                        </h4>
                        {meet.isRecurring && (
                          <span className="text-[9px] font-bold bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-indigo-400 uppercase tracking-wider font-mono">
                            recurring
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap font-mono">
                        <span>Org: {meet.organizerEmail}</span>
                        <span>•</span>
                        <span>{new Date(meet.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        <span>•</span>
                        <span>{new Date(meet.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>
                  </div>

                  {/* Project Tag & Cost */}
                  <div className="flex items-center gap-6 justify-between md:justify-end">
                    <div className="space-y-1 md:text-right">
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Project Attribution</p>
                      {isUnattributed ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded text-orange-400 bg-orange-500/15 border border-orange-500/20 uppercase tracking-wide">
                            Unattributed
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAIClassify(meet.id, meet.title, meet.description);
                            }}
                            disabled={classifyingId === meet.id}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-2 py-1 rounded text-[10px] cursor-pointer shadow flex items-center gap-1.5 shrink-0"
                          >
                            <Sparkles className="w-3 h-3 text-indigo-200" />
                            {classifyingId === meet.id ? "Analyzing..." : "Link via AI"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center md:justify-end gap-1.5">
                          <span className="text-xs font-semibold text-indigo-400 font-mono">
                            {meet.projectName}
                          </span>
                          {meet.attributionConfidence && (
                            <span className="text-[9px] px-1 font-mono font-bold text-slate-400 border border-slate-700 bg-slate-900 rounded">
                              {Math.round(meet.attributionConfidence * 100)}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        {userRole === "admin" ? "Meeting Cost" : "Staff Presence"}
                      </p>
                      <p className="text-base font-bold font-mono text-emerald-400">
                        {userRole === "admin" ? formatINR(meet.totalCost) : `${meet.durationMinutes}m duration`}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleExpand(meet.id)}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700/60 shrink-0 cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Collapsible Section */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-slate-700/60 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-scale-up">
                    {/* Notes Scope */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agenda / Discussion Snippet</p>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
                          {meet.description || "No agenda description synced."}
                        </p>
                      </div>

                      {meet.attributionReasoning && (
                        <div className="space-y-1 font-mono">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> AI Attribution Justification
                          </p>
                          <p className="text-[11px] text-slate-400 leading-relaxed pl-2 border-l border-indigo-500/40">
                            {meet.attributionReasoning}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Attendees Rates Breakdowns */}
                    <div className="lg:col-span-1 border-l border-slate-700/40 pl-0 lg:pl-6 space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-slate-400" /> Attendees ({meet.attendees?.length || 0})
                        </p>
                        {userRole === "admin" ? (
                          <span className="text-[10px] text-slate-400 font-mono">
                            Session Burn Rate: ₹
                            {meet.attendeesDetails.reduce((sum, a) => sum + (a.hourlyRate || 1200), 0)}
                            /hr
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">
                            Active Engagement Team View
                          </span>
                        )}
                      </div>

                      <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                        {attendeeRates.map((att: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-300 truncate">{att.name}</p>
                              <p className="text-[10px] text-slate-500 truncate">{att.role}</p>
                            </div>
                            <span className="font-mono text-[11px] shrink-0 text-slate-450 bg-slate-900/60 border border-slate-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                              {userRole === "admin" ? (
                                <span>₹{att.hourlyRate}/hr</span>
                              ) : (
                                <span>{att.department || "Core"}</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
