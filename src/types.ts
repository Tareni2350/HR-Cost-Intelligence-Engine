export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  hourlyRate: number;
  salaryBand: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  budget: number;
  status: 'active' | 'archived' | 'completed';
}

export interface Meeting {
  id: string;
  externalId?: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  organizerEmail: string;
  projectId?: string;
  attributionConfidence?: number;
  attributionReasoning?: string;
  isRecurring: boolean;
  totalCost: number;
  attendees: string[]; // employee ids or emails
}

export interface Anomaly {
  id: string;
  meetingId: string;
  meetingTitle: string;
  type: string; // "Cost Overrun" | "Excessive Attendee Count" | "Unattributed Meeting" | "Inefficient Allocation"
  severity: 'low' | 'medium' | 'high';
  description: string;
  cost: number;
  isResolved: boolean;
  createdAt: string;
}

export interface Forecast {
  ds: string; // date string YYYY-MM-DD
  yhat: number; // predicted cost
  yhat_lower: number;
  yhat_upper: number;
  projectedOverrun: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface LiveMeetingState {
  id: string;
  title: string;
  attendees: Array<{
    id: string;
    name: string;
    role: string;
    hourlyRate: number;
  }>;
  startTime: string;
  hourlyBurnRate: number;
  elapsedSeconds: number;
}
