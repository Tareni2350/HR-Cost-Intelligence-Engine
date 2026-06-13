# HR Cost Intelligence Engine (Enterprise MVP)

An AI-powered Enterprise FinOps platform that automatically monitors and analyzes corporate calendars, dynamically attributes meeting instances to projects using LLMs, assesses dynamic employee hourly rates to calculate financial burn loss, detects compliance anomalies, and provides executive-grade visibility.

## 🚀 Key Software Features

- **Dynamic Meeting ROI Ledger:** Displays live meeting records synced directly from corporate calendar APIs. Lists titles, duration, attendees, and calculates costs.
- **AI-Powered Product Attribution:** Leverages Gemini (via `@google/genai` on server-side) with reasoning schemas to attribute unscheduled meetings to initiatives cleanly.
- **Time-is-Money Burn Meter (Innovation):** A ticking overlay dashboard that increments rupees (₹) spent *every second*, guiding teams to shorter meetings by exposing exact time values.
- **FinOps Compliance Alerts:** Flags meetings with too many attendees, high-budget leaks, unmapped items or low project contribution mappings with Isolation Forest-type heuristic indicators.
- **Gemini AI Audit Explanations:** Runs detailed contextual audits of any flagged meeting, recommending actionable remediations.
- **Executive Chat Copilot:** Natural language prompt assistant utilizing automated RAG contextual DB schemas to answer questions like: *"Which project consumed the highest budget this month?"*

---

## 🛠 Elite Stack

- **Backend Architecture:** Full-stack Express.js built in Node with TypeScript runtime.
- **AI Integration:** Google Gemini Live (`gemini-3.5-flash`) utilizing standard `@google/genai` API.
- **Persistent Data Store:** Relational file-backed schema (`db.json`) ensuring persistent writes and full relations (join operations for meeting-attendees).
- **Core Frontend Visuals:** React 19, Recharts diagrams (Pie metrics of allocations, rounded Bar charts of hours), Tailwind premium Slate/Indigo design, Lucide vectors, and `motion` layout animations.

---

## 🚀 Active Workplace Demo Guide

Give judges an exceptional walk-through in 4 direct steps:

### 1. The Dynamic Ticker (Burn Meter)
Navigate to the **Real-Time Meter**. Start the clock. Watch the costs rise live in Indian Rupees (₹) calculated cleanly across individual attendee hourly rate coefficients (Rajesh, Sneha, Amit, Priya).

### 2. AI Project Mapping in Action
Open the **Meeting Ledger**. Locate any unmapped event. Click **"Link via AI"**. The server queries Gemini, extracts structural context, assigns a project tag, and updates budgets instantly!

### 3. Compliance Warnings (Watchdog Alerts)
Check out **Watchdog Alerts**. Click **"AI Audit"** on the *Massive Status Sync* meeting. Gemini reads the attendee rate coefficients and returns an expert remediation paragraph showing estimated savings if moved to Slack status updates.

### 4. Natural Language Analytical Chats
Open **AI Analyst Copilot**. Ask the template query: *"Which project consumed the highest budget this month?"*. The model checks database context and answers in conversational executive tone with precise numbers.

---

## ⚙️ Quickstart Setup

### Configuration
Update/provide your Google Gemini API key securely in the AI Studio **Secrets** panel using the parameter:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

### Run Locally (Dev Workspace)
```bash
# 1. Install workspace dependencies
npm install

# 2. Boot up development fullstack services
npm run dev
```

Your terminal will boot. The Express backend integrates Vite middleware, serving client layouts at:
👉 **`http://localhost:3000`**
