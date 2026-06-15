# HR Cost Intelligence Engine 

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

### 1. The Dynamic Ticker (Burn Meter)
Navigate to the **Real-Time Meter**. Start the clock. Watch the costs rise live in Indian Rupees (₹) calculated cleanly across individual attendee hourly rate coefficients (Rajesh, Sneha, Amit, Priya).

### 2. AI Project Mapping in Action
Open the **Meeting Ledger**. Locate any unmapped event. Click **"Link via AI"**. The server queries Gemini, extracts structural context, assigns a project tag, and updates budgets instantly!

### 3. Compliance Warnings (Watchdog Alerts)
Check out **Watchdog Alerts**. Click **"AI Audit"** on the *Massive Status Sync* meeting. Gemini reads the attendee rate coefficients and returns an expert remediation paragraph showing estimated savings if moved to Slack status updates.

### 4. Natural Language Analytical Chats
Open **AI Analyst Copilot**. Ask the template query: *"Which project consumed the highest budget this month?"*. The model checks database context and answers in conversational executive tone with precise numbers.

---

## Screenshots:
<img width="1440" height="900" alt="Screenshot 2026-06-13 at 3 16 02 PM" src="https://github.com/user-attachments/assets/a99fbded-3f57-4dbf-8c0f-75fa9fb05481" />
<img width="1440" height="900" alt="Screenshot 2026-06-13 at 3 16 09 PM" src="https://github.com/user-attachments/assets/70b118ae-b684-4acb-b26e-bed6693a663a" />
<img width="1440" height="900" alt="Screenshot 2026-06-13 at 3 16 18 PM" src="https://github.com/user-attachments/assets/9ecda60d-bf4c-4ad1-b56a-911050c55250" />
<img width="1440" height="900" alt="Screenshot 2026-06-13 at 3 16 25 PM" src="https://github.com/user-attachments/assets/ab0f2e9c-71a8-4465-850e-b83f391bc9ee" />
<img width="1440" height="900" alt="Screenshot 2026-06-13 at 3 16 29 PM" src="https://github.com/user-attachments/assets/d35cfb11-0bfd-45bf-8a99-378f16c35e9e" />
<img width="1440" height="900" alt="Screenshot 2026-06-13 at 3 16 35 PM" src="https://github.com/user-attachments/assets/9791b5ae-78f1-4599-8812-427c6de3cec3" />
<img width="1440" height="900" alt="Screenshot 2026-06-13 at 3 16 38 PM" src="https://github.com/user-attachments/assets/d5e18a2b-cc79-4c9c-bb3b-83b6f172c54e" />


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
