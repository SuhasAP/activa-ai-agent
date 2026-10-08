# ACTIVA

### From Intent to Action

**ACTIVA** is an autonomous AI personal assistant and orchestrator built to turn complex, open-ended human goals into structured, deterministic execution plans and controlled backend actions with human oversight.

![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=nodedotjs&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20API-4285F4?logo=googlegemini&logoColor=white)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-37%2F37%20Passing-brightgreen?logo=node.js&logoColor=white)

---

## 1. Overview

Traditional AI assistants operate on a request-response chat pattern:

$$\text{User Prompt} \longrightarrow \text{LLM Output}$$

While useful for Q&A, chat models cannot autonomously coordinate personal tasks, respect calendar availability, ring-fence financial buffers, or perform consequential real-world actions without human supervision.

**ACTIVA** shifts the paradigm from conversation to **autonomous execution**:

$$\text{User Goal} \longrightarrow \text{Intent Analysis} \longrightarrow \text{Context Gathering} \longrightarrow \text{Task Decomposition} \longrightarrow \text{Tool Selection} \longrightarrow \text{Human Approval} \longrightarrow \text{Action Execution} \longrightarrow \text{State Verification}$$

ACTIVA evaluates live user context (tasks, schedule, committed bills, discretionary balance), formulates a multi-step plan, selects restricted backend tools, requests human approval for consequential operations (e.g. creating calendar draft events or time-sensitive reminders), executes approved steps idempotently, and persists the resulting system state.

---

## 2. The Problem

Consider a common student scenario:

> *"I have a DBMS assignment due tomorrow, a Software Engineering exam next week, and only ₹2,000 left for the rest of the month. Help me organize everything without overspending."*

A standard LLM chatbot responds with generic advice: *"Be sure to study DBMS tonight and try to save money."* It cannot verify if you have classes scheduled, check if an electricity bill is due tomorrow, create a study reminder, or enforce spending guardrails.

**ACTIVA solves this by reasoning across domain context:**
1. **Academic Tasks:** Detects high-priority DBMS Assignment 3 (due tomorrow) and upcoming exams.
2. **Schedule Constraints:** Inspects calendar slots to locate free time blocks (e.g., 6:00 PM – 8:00 PM).
3. **Financial Limits:** Audits ₹2,000 balance against ₹650 committed electricity bill, ₹1,000 planned essentials, and protects a ₹350 emergency buffer.
4. **Controlled Action:** Formulates a time-sensitive study reminder and presents an Approval Card for human confirmation before modifying system records.

---

## 3. The Solution & Workflow Architecture

```
                       ┌─────────────────────────┐
                       │     User Goal Input     │
                       └────────────┬────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │   Intent Understanding  │
                       │   (Google Gemini API)   │
                       └────────────┬────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │ System Context Assembly │
                       │ (Tasks, Calendar, $$)   │
                       └────────────┬────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │  Multi-Step Planning    │
                       │  & Tool Selection       │
                       └────────────┬────────────┘
                                    │
                        /───────────────────────\
                       / Is Approval Required?   \
                       \_________________________/
                               /         \
                             YES          NO
                             /             \
            ┌───────────────▼───────┐   ┌───▼──────────────────┐
            │  Human Approval Card  │   │  Direct Tool Execution│
            │  (AWAITING_APPROVAL)  │   └───────────┬──────────┘
            └───────────────┬───────┘               │
                            │                       │
                     /──────────────\               │
                    / User Decision  \              │
                    \________________/              │
                     /              \               │
                 APPROVE           REJECT           │
                   /                  \             │
        ┌─────────▼────────┐   ┌───────▼────────┐   │
        │  Tool Execution  │   │ Action Aborted │   │
        │ & Idempotency    │   │ (No State Mod) │   │
        └─────────┬────────┘   └───────┬────────┘   │
                  │                    │            │
                  └─────────┬──────────┴────────────┘
                            │
               ┌────────────▼────────────┐
               │   Result Verification   │
               │  & Execution Store Sync │
               └─────────────────────────┘
```

---

## 4. Why ACTIVA Is an Autonomous AI Agent

ACTIVA is built around eight foundational agentic capabilities:

| Capability | Implementation Mechanism in ACTIVA |
| :--- | :--- |
| **UNDERSTAND** | Extracts structured intent from natural language using Google Gemini API (`analyzeIntentAndPlan`). |
| **CONTEXT GATHERING** | Reads live domain context (`tasks`, `calendar`, `expenses`, `reminders`, `notes`) prior to planning. |
| **DECOMPOSE** | Breaks complex goals into prioritized execution steps with clear status indicators. |
| **TOOL SELECTION** | Dynamically maps plan requirements to explicit tool definitions in `toolRegistry.js`. |
| **PERMISSION CONTROL**| Distinguishes `READ_ONLY`, `LOW_RISK`, and `APPROVAL_REQUIRED` actions. |
| **HUMAN OVERSIGHT** | Requires explicit user confirmation before running consequential operations. |
| **IDEMPOTENT EXECUTION** | Prevents duplicate actions and duplicate reminders even upon repeated approvals or retries. |
| **PERSISTENCE** | Persists execution records and timeline state to disk (`executions.json`) surviving page refresh and navigation. |

---

## 5. Core Implemented Features

- **Autonomous Goal Orchestration:** Translates natural language goals into multi-step execution plans with live timeline progress.
- **Human Approval Cards:** Consequential actions (`createReminder`, `createCalendarDraft`) render an interactive approval UI before execution.
- **Rejection & State Preservation:** Rejecting a proposed action safely aborts execution without modifying or deleting existing reminders.
- **Idempotency & Duplicate Protection:** Re-submitting identical goals or approving identical actions twice will not duplicate active database entries.
- **Interactive Reminder Management:** Built-in modal supporting interactive calendar date picking, Today/Tomorrow/Weekend shortcuts, 12-hour time picker with direct keyboard typing, AM/PM selection, quick time presets, and live reminder previews.
- **Reminder Lifecycle Tracking:** Dynamic reminder status calculation (`ACTIVE`, `DUE`, `OVERDUE`, `COMPLETED`, `CANCELLED`) with source badges (`ACTIVA AGENT` vs `MANUAL`).
- **Financial Reasoning & Budget Guardrails:** Calculates safe discretionary spending while ring-fencing fixed bills and emergency buffers.
- **Dashboard & Execution Persistence:** Backend acts as the source of truth; navigation between tabs or browser refreshes preserves execution history.

---

## 6. Human-in-the-Loop Safety

ACTIVA adheres to a strict safety model: **The AI proposes; the human disposes.**

```
               [ AI Agent Planning ]
                        │
                        ▼
           [ Proposes Consequential Action ]
                        │
            ┌───────────┴───────────┐
            │                       │
    [ User APPROVES ]       [ User REJECTS ]
            │                       │
            ▼                       ▼
   Tool Router Executes    Action Safely Aborted
   Idempotency Verified    Existing Reminders Preserved
   State Updated in DB     No DB Mutation Performed
```

### Action Permission Levels
1. **`READ_ONLY`:** Internal context reading (`getTasks`, `getSchedule`, `getExpenses`, `getReminders`, `getNotes`, `calculateBudget`). Executed automatically during context assembly.
2. **`LOW_RISK`:** Non-consequential state creation (`createTask`, `updateTask`, `createBudgetPlan`, `createNote`). Executed safely with summary verification.
3. **`APPROVAL_REQUIRED`:** High-consequential actions (`createReminder`, `createCalendarDraft`). Halted at `AWAITING_APPROVAL` status until explicit user interaction.

---

## 7. Agent Execution State Machine

Execution state transitions are strictly governed by the backend:

```
               ┌──────────┐
               │ PENDING  │
               └────┬─────┘
                    │
                    ▼
         ┌──────────────────┐
         │AWAITING_APPROVAL │
         └─────┬──────┬─────┘
               │      │
      APPROVE  │      │ REJECT
               │      │
               ▼      ▼
    ┌──────────┐      ┌──────────┐
    │COMPLETED │      │CANCELLED │
    └──────────┘      └──────────┘
```

### Allowed State Transitions
- `PENDING` $\rightarrow$ `AWAITING_APPROVAL`
- `AWAITING_APPROVAL` $\rightarrow$ `COMPLETED` (User Approves)
- `AWAITING_APPROVAL` $\rightarrow$ `CANCELLED` (User Rejects)
- `PENDING` / `AWAITING_APPROVAL` $\rightarrow$ `FAILED` (Tool execution error)

### Forbidden Transitions
- `CANCELLED` (Rejected) $\rightarrow$ `COMPLETED` / `EXECUTED` (Returns `400 Bad Request`)
- `COMPLETED` (Executed) $\rightarrow$ `CANCELLED` / `REJECTED` (Returns `400 Bad Request`)
- `COMPLETED` $\rightarrow$ `COMPLETED` (Idempotent return: `alreadyExecuted: true`, no second execution)

---

## 8. Tool Architecture & Registry

All tools available to ACTIVA are declared in `server/tools/toolRegistry.js`. The model **cannot** execute arbitrary JavaScript or system commands.

| Tool Name | Category | Purpose | Permission Level | Human Approval |
| :--- | :--- | :--- | :--- | :---: |
| `getTasks` | Task | Fetch user tasks, deadlines, and priorities | `READ_ONLY` | No |
| `createTask` | Task | Create task with title, description, dueDate, priority | `LOW_RISK` | No |
| `updateTask` | Task | Update task fields by `taskId` | `LOW_RISK` | No |
| `getSchedule` | Calendar | Fetch schedule, classes, and study sessions | `READ_ONLY` | No |
| `findFreeTime` | Calendar | Locate free time blocks for specified duration | `READ_ONLY` | No |
| `createCalendarDraft` | Calendar | Draft a calendar event (e.g. Focus Block) | `APPROVAL_REQUIRED` | **Yes** |
| `getExpenses` | Expense | Fetch committed, planned, and total expenses | `READ_ONLY` | No |
| `calculateBudget` | Expense | Calculate discretionary buffer and emergency funds | `READ_ONLY` | No |
| `createBudgetPlan` | Expense | Save structured spending recommendation plan | `LOW_RISK` | No |
| `getReminders` | Reminder | Fetch active and historic reminders | `READ_ONLY` | No |
| `createReminder` | Reminder | Create a time-sensitive reminder | `APPROVAL_REQUIRED` | **Yes** |
| `getNotes` | Note | Fetch study notes and saved strategies | `READ_ONLY` | No |
| `createNote` | Note | Create a new study note or summary | `LOW_RISK` | No |

---

## 9. Backend Security Architecture

The React frontend is **not** treated as a security boundary. The Express backend independently enforces all rules.

```
React Client (View / Presentation)
       │
       │ HTTP / JSON (No Secret Exposure)
       ▼
Express Backend Security Boundary
 ├── Security Headers Middleware (nosniff, frameguard, XSS filter)
 ├── In-Memory Rate Limiter (30 req/min/IP on /api/agent/execute)
 ├── Request Size Limiter (express.json limit: "100kb")
 ├── Input Validators (validateGoalInput, validateApprovalInput, etc.)
 ├── Prompt Injection Defense Guardrail
 ├── Tool Allowlist Sanitizer (sanitizeAiDecision)
 └── State Machine & Idempotency Router
```

### Core Security Controls
1. **API Key Isolation:** `GEMINI_API_KEY` is loaded only in `server/services/geminiService.js`. Never exported, logged, or bundled in client code.
2. **Prompt Injection Defense:** Goals containing injection phrases ("ignore previous instructions", "reveal gemini api key", "read server/.env") trigger an instant security response with `proposedAction: null`.
3. **Untrusted AI Output Validation:** `sanitizeAiDecision()` strips any tool name returned by the AI that is not present in `TOOL_REGISTRY`.
4. **Approval Enforcement:** Direct calls to execute pending actions without a valid `pendingId` in `AWAITING_APPROVAL` status are rejected with safe HTTP status codes (`400`/`404`).
5. **Payload Size & Rate Limiting:** Body size capped at `100kb`; execution route rate-limited to 30 requests/min per IP.
6. **Error Sanitization:** `errorHandler.js` redacts file system directory paths and secret keys before outputting JSON responses.

---

## 10. Idempotency & Duplicate Prevention

ACTIVA implements two-tier duplicate prevention:

1. **Action-Level Idempotency (`executedActionIds`):**
   When an action is executed, its unique `actionId` is registered in `executionStore.js`. Subsequent approval requests for the same `actionId` return `{ success: true, alreadyExecuted: true }` without executing the underlying tool twice.
2. **Reminder-Level Duplicate Prevention:**
   Before creating a reminder, `db.createReminder` checks for existing non-cancelled active/due/overdue reminders with matching title and time. If found, it preserves the existing reminder and returns `{ duplicate: true }`.

---

## 11. Technology Stack

### Frontend
- **Framework:** React 18.3 (`react-dom`, `react-router-dom` v6)
- **Build Tool:** Vite 5.2
- **Styling:** Tailwind CSS 3.4, Custom CSS variables, Glassmorphism design tokens
- **Icons:** Lucide React (`lucide-react`)

### Backend
- **Runtime:** Node.js (ES Modules, `type: "module"`)
- **Server:** Express 4.19
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`) / Google Gemini API
- **State & Storage:** Synchronized In-Memory & File Store (`seedData.js`, `executionStore.js` $\rightarrow$ `executions.json`)
- **Security:** In-memory Rate Limiting, Custom Security Headers, Input Validation Middleware

### Testing
- **Runner:** Node.js Native Test Runner (`node --test`)
- **Assertions:** Node.js Native Assert Strict (`node:assert/strict`)

---

## 12. Project Structure

```
ACTIVA/
├── .env.example                # Environment template (GEMINI_API_KEY placeholder)
├── .gitignore                  # Git exclusions (.env, node_modules, dist)
├── package.json                # Root package configuration & orchestration scripts
├── README.md                   # Technical documentation
│
├── client/                     # React Frontend Single-Page Application
│   ├── index.html              # HTML5 entrypoint
│   ├── package.json            # Client dependencies & scripts
│   ├── vite.config.js          # Vite build configuration
│   └── src/
│       ├── App.jsx             # Top-level routing & layout shell
│       ├── index.css           # Global design system tokens & theme styles
│       ├── main.jsx            # React root mount
│       ├── components/         # Reusable UI components
│       │   ├── ActivityTimeline.jsx
│       │   ├── ApprovalCard.jsx
│       │   ├── CommandCenter.jsx
│       │   ├── DashboardCards.jsx
│       │   ├── DateTimePickerModal.jsx
│       │   ├── ExecutionPlan.jsx
│       │   ├── Navbar.jsx
│       │   └── ResultCard.jsx
│       ├── pages/              # Primary application views
│       │   ├── CalendarPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── ExpensesPage.jsx
│       │   ├── RemindersPage.jsx
│       │   └── TasksPage.jsx
│       └── services/           # Frontend API client
│           └── api.js
│
└── server/                     # Express Backend & Agent Orchestrator
    ├── app.js                  # Express middleware & router registration
    ├── server.js               # HTTP server listener (Port 5000)
    ├── package.json            # Server dependencies & test script
    ├── controllers/            # Route handler logic
    │   ├── agentController.js
    │   ├── calendarController.js
    │   ├── executionController.js
    │   ├── expenseController.js
    │   ├── noteController.js
    │   ├── reminderController.js
    │   └── taskController.js
    ├── data/                   # Data storage & seed initializers
    │   ├── executions.json     # Execution state persistence store
    │   ├── executionStore.js   # Execution disk/cache manager
    │   └── seedData.js         # Domain data store (tasks, calendar, expenses)
    ├── middleware/             # Security & validation middleware
    │   ├── errorHandler.js
    │   ├── rateLimiter.js
    │   └── validateInput.js
    ├── routes/                 # Express API routers
    │   ├── agentRoutes.js
    │   ├── calendarRoutes.js
    │   ├── executionRoutes.js
    │   ├── expenseRoutes.js
    │   ├── noteRoutes.js
    │   ├── reminderRoutes.js
    │   └── taskRoutes.js
    ├── services/               # Core Agent Reasoning Engine
    │   ├── agentService.js     # Goal processing & approval workflow
    │   ├── geminiService.js    # Google Gemini API client & prompt injection defense
    │   └── toolRouter.js       # Context gathering & tool execution router
    ├── tools/                  # Controlled backend tool implementations
    │   ├── calendarTool.js
    │   ├── expenseTool.js
    │   ├── noteTool.js
    │   ├── reminderTool.js
    │   ├── taskTool.js
    │   └── toolRegistry.js     # Tool allowlist & permission definitions
    └── tests/                  # Automated test suite
        └── agent.test.js       # 37/37 behavioral & security tests
```

---

## 13. API Documentation

### Agent Endpoints
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/agent/execute` | Process goal, run plan, return action | `{ "goal": "string" }` |
| `POST` | `/api/agent/approve` | Approve pending action by ID | `{ "pendingId": "string" }` |
| `POST` | `/api/agent/reject` | Reject pending action by ID | `{ "pendingId": "string" }` |
| `POST` | `/api/agent/reset` | Reset store to initial seed state | `{}` |

### Execution State Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/executions` | Fetch all historical agent executions |
| `GET` | `/api/executions/latest` | Fetch the single most recent execution |
| `GET` | `/api/executions/:id` | Fetch execution details by `id` or `pendingId` |

### Domain Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Fetch all tasks |
| `POST` | `/api/tasks` | Create task (`title`, `description`, `dueDate`, `priority`) |
| `PUT` | `/api/tasks/:id` | Update task fields |
| `GET` | `/api/calendar` | Fetch schedule and events |
| `GET` | `/api/expenses` | Fetch expenses breakdown |
| `GET` | `/api/reminders` | Fetch active and historical reminders |
| `POST` | `/api/reminders` | Create manual reminder |
| `PUT` | `/api/reminders/:id/complete` | Mark reminder complete |
| `PUT` | `/api/reminders/:id/cancel` | Cancel reminder |
| `GET` | `/api/notes` | Fetch study notes |
| `POST` | `/api/notes` | Create study note |
| `GET` | `/api/health` | Service health status check |

---

## 14. Installation & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-repo/activa-agent.git
cd activa-agent
npm run setup
```

### 2. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```bash
cp .env.example server/.env
```
Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If `GEMINI_API_KEY` is omitted or set to placeholder, ACTIVA automatically uses its deterministic heuristic planning fallback without crashing).*

### 3. Run Development Servers
To run backend and client concurrently:
```bash
# Start backend (Port 5000)
npm run dev:server

# In a separate terminal, start client (Port 5173)
npm run dev:client
```

### 4. Build & Run Single Production Server
To build the React production bundle and serve it via Express on Port 5000:
```bash
npm run build
npm start
```
Open `http://localhost:5000` in your browser.

---

## 15. Automated Test Suite

Run the full automated test suite (37/37 passing):
```bash
npm test
```

### Verified Test Categories
- **Behavioral Scenarios (1–17):** First request approval, repeated request duplicate prevention, rejection survival of existing reminders, first request rejection creating zero reminders, title/time differentiation, cancelled/completed reminder recreation, unique execution IDs, and dashboard count consistency.
- **Security Hardening Suite (S1–S20):** Missing API key fallback, invalid execution ID safe handling, unknown tool blocking, approval bypass attempts, invalid state machine transitions (`REJECTED → EXECUTED`), duplicate approval idempotency, input length validation, prompt injection defense, secret leak prevention, and filesystem path error sanitization.

---

## 16. Hackathon Demo Scenario

To evaluate ACTIVA during testing, submit the following prompt in the Command Center:

> **"I have an assignment due tomorrow, an exam next week, and only ₹2,000 left this month. Help me organize everything without overspending."**

### Expected Agent Lifecycle:
1. **Intent Understanding:** Detects academic deadlines and financial constraints.
2. **Context Audit:** Inspects tasks (DBMS Assignment 3), calendar schedule, and expense ledger.
3. **Execution Plan:** Formulates 5 structured steps, prioritizing the assignment, exam study blocks, fixed ₹650 bill payment, and ₹350 emergency buffer protection.
4. **Approval Card:** Displays interactive confirmation card for creating a study reminder: *"Complete DBMS Assignment" for Tomorrow at 7:00 PM*.
5. **Human Oversight:**
   - **Click APPROVE:** The reminder is created (`ACTIVA AGENT` source badge), and mission completion is verified.
   - **Click REJECT:** Action is safely cancelled; no new reminder is added; existing data remains intact.

---

## 17. Prototype Limitations & Future Scope

### Current Prototype Scope
- Single-user demo instance with local file-backed persistence (`executions.json`).
- Internal structured calendar/schedule dataset (simulating Google Calendar).
- Local session state without multi-tenant user authentication.

### Future Scope
- **OAuth2 Integration:** Live Google Calendar, Google Tasks, and Gmail API integration.
- **Multi-Tenant Auth:** Cloud database persistence (PostgreSQL / MongoDB) with JWT/OAuth user authentication.
- **Voice & Mobile:** Voice-to-intent pipeline and Mobile PWA dashboard.

---

## 18. Hackathon Submission Alignment

ACTIVA directly addresses the **AI-Powered Personal Assistant & Autonomous Agents** challenge:
- **Minimal Human Intervention:** Automates domain context gathering, task decomposition, budget calculations, and scheduling.
- **Appropriate Oversight:** Enforces strict human approval before executing any consequential action.
- **Defensible Security:** Demonstrates production-ready backend security boundaries, prompt injection resilience, input validation, and state machine integrity.

---

## 19. License

Developed for hackathon evaluation.
