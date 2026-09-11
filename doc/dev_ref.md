# Simple Project Task Tracker 2.1 — Master Blueprint (dev_plan_v21.md)  
  
**Status:** Approved for Development    
**Target Platform:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase PostgreSQL, Prisma ORM    
**IDE Target:** Antigravity Standalone Environment    
**Locale / Standard:** Australian English PM Standard (`en-AU`)    
  
---  
  
## 1. Executive Summary & Core Objective  
Version 2.1 transitions the application from a multi-user task tracker into an **Executive Portfolio Intelligence System**.   
  
The main focus of this release is to establish a mathematically rigorous **Weighted Progress Engine**, a **Punctuality Score Engine (PS Engine)** for early delay detection, **S-Curve & Burn-Down Visualisations**, **Global Holiday Management**, and robust **Role-Based Access Control (RBAC) Governance**. Furthermore, it introduces **Milestone Tracking**, advanced **Multi-Project Executive Dashboards**, and dynamic privilege escalation managed by the Super PM.  
  
---  
  
## 2. Refinement Specifications & Core Features  
  
### 📊 A. Weighted Progress Engine  
  
#### 1. Working Days & Global Holidays Basis  
* **Working Days Calculation:** Duration is computed using business working days (Monday–Friday).  
* **Global Holiday Exclusion:** Excludes Saturdays, Sundays, and custom **National Holidays / Corporate Shut-Downs** defined globally by the Super PM.  
* **Date Anchor:** Planned duration uses `updatedStartDate` to `updatedDueDate`.  
  
#### 2. Relative Task Weight ($W_i$)  
* Each task $i$ is assigned a relative weight $W_i$ based on its working-day duration relative to the total working-day duration of all tasks in the project:  
  $$W_i = \frac{D_{\text{planned}_i}}{\sum_{k=1}^{n} D_{\text{planned}_k}}$$  
* The sum of all task weights within a project equals 100% ($\sum_{i=1}^{n} W_i = 1.0$).  
  
#### 3. Symmetrical Progress Calculation (Task vs Project Level)  
* **At Task Level ($i$):**  
  * $\text{Weighted Target Progress}_i = P_{\text{target}_i} \times W_i$  
  * $\text{Weighted Actual Progress}_i = P_{\text{actual}_i} \times W_i$  
* **At Project Level (Linear Direct Sum):**  
  * Project progress is the direct summation of all weighted task progresses without secondary re-weighting:  
    $$P_{\text{actual}_{\text{project}}} = \sum_{i=1}^{n} (P_{\text{actual}_i} \times W_i)$$  
    $$P_{\text{target}_{\text{project}}} = \sum_{i=1}^{n} (P_{\text{target}_i} \times W_i)$$  
  
---  
  
### ⏱️ B. Punctuality Score (PS) & Status Flags Engine  
  
#### 1. Uncapped Target Progress Rate  
* To detect actual delays past due dates, $P_{\text{target}}$ is **uncapped** and grows linearly based on elapsed working days ($E_{\text{elapsed}}$):  
  $$P_{\text{target}} = \frac{E_{\text{elapsed}}}{D_{\text{planned}}}$$  
  
#### 2. Punctuality Score Formulations  
* **Incomplete Tasks ($P_{\text{actual}} < 100\%$):**  
  * Not Started ($P_{\text{actual}} = 0\%$):  
    * $T_{\text{now}} < T_{\text{start}} \implies \text{PS} = 100\%$  
    * $T_{\text{now}} \ge T_{\text{start}} \implies \text{PS} = 100\% - P_{\text{target}}$  
  * In Progress ($0\% < P_{\text{actual}} < 100\%$):  
    * $T_{\text{now}} < T_{\text{start}} \implies \text{PS} = 100\% + P_{\text{actual}}$  
    * $T_{\text{now}} \ge T_{\text{start}} \implies \text{PS} = \frac{P_{\text{actual}}}{P_{\text{target}}} \times 100\%$  
* **Completed Tasks ($P_{\text{actual}} = 100\%$):**  
  $$\text{PS} = \frac{D_{\text{planned}}}{D_{\text{actual}}} \times 100\%$$  
* **Project-Level PS:**  
  $$\text{Project PS} = \frac{P_{\text{actual}_{\text{project}}}}{P_{\text{target}_{\text{project}}}} \times 100\%$$  
  
#### 3. Matrix of 11 Status Flags (Australian English PM Standard)  
  
| No | Status Flag Name | PS Benchmark | Additional Criteria | Alert Level |  
| :--- | :--- | :--- | :--- | :--- |  
| **1** | **Due to Commence** | $\text{PS} = 100\%$ | $P_{\text{actual}} = 0\%$, $T_{\text{now}} < T_{\text{start}}$ | Info |  
| **2** | **Delayed Commencement** | $85\% \le \text{PS} < 95\%$ | $P_{\text{actual}} = 0\%$, $T_{\text{now}} \ge T_{\text{start}}$ | Amber |  
| **3** | **Critically Overdue Start** | $\text{PS} < 85\%$ | $P_{\text{actual}} = 0\%$, $T_{\text{now}} \ge T_{\text{start}}$ | Red |  
| **4** | **On Track** | $95\% \le \text{PS} < 105\%$ | $0\% < P_{\text{actual}} < 100\%$ | Green |  
| **5** | **Slipping** | $85\% \le \text{PS} < 95\%$ | $0\% < P_{\text{actual}} < 100\%$ | Amber |  
| **6** | **Critically Delayed** | $\text{PS} < 85\%$ | $0\% < P_{\text{actual}} < 100\%$ | Red |  
| **7** | **Ahead of Schedule** | $\text{PS} \ge 105\%$ | $0\% < P_{\text{actual}} < 100\%$ | Green |  
| **8** | **Completed Ahead of Schedule** | $\text{PS} \ge 105\%$ | $P_{\text{actual}} = 100\%$ | Blue / Gray |  
| **9** | **Completed On Time** | $95\% \le \text{PS} < 105\%$ | $P_{\text{actual}} = 100\%$ | Blue / Gray |  
| **10** | **Completed Late** | $85\% \le \text{PS} < 95\%$ | $P_{\text{actual}} = 100\%$ | Amber / Gray |  
| **11** | **Completed Severely Late** | $\text{PS} < 85\%$ | $P_{\text{actual}} = 100\%$ | Red / Gray |  
  
---  
  
### 🛡️ C. Registration Approval Workflow & Advanced RBAC Governance  
  
* **Registration Approval Queue:** Newly registered users automatically enter an `approvalStatus = PENDING` state after email verification. They cannot access the workspace until a Super PM explicitly approves their account.  
* **Dynamic Analytics Privileges (Super PM Invocation):**  
  * By default, PMs and Members can view all dashboard types, whilst Viewers see none.  
  * Super PMs can arbitrarily override dashboard access per user (Analytics by Project, by PM, Total Company, or any combination).  
* **Dynamic Project Visibility & Edit Rights:**  
  * **Default:** PMs can view all projects but edit only their own. Members can only view/edit projects and tasks they are explicitly assigned to. Viewers cannot view any projects by default.  
  * **Super PM Override:** Super PMs have absolute authority to alter project visibility, grant edit rights, or change the designated PM of any project.  
* **Safe Account Deletion & Data Integrity:**  
  * When a Super PM deletes a user account (especially a PM), the system will prompt the Super PM to safely reassign their projects and tasks to another user to maintain relational database integrity, rather than triggering a hard cascade delete.  
  
---  
  
### 🛠️ D. Project Management & Milestones  
  
* **Edit Project Interface:** A dedicated menu accessible only to PMs (for their own projects) and Super PMs (for all projects).  
  * Update core details (Description, Dates).  
  * Add, edit, or remove project members dynamically.  
* **Milestone Tracking Engine:**  
  * PMs/Super PMs can define project Milestones (Name, Description).  
  * Milestones contain three dates: `initialTarget`, `updatedTarget`, and `actualAchieved`.  
  * By default, `updatedTarget` mirrors `initialTarget` upon creation until explicitly altered by a PM.  
  
---  
  
### 🖥️ E. Landing Page & High-Density UI Refactoring  
  
* **Smart Landing Page Views:**  
  * **Super PM / PM:** The dashboard defaults to "My Own Projects" (projects under their direct management).  
  * **Member:** The dashboard defaults to their assigned projects.  
  * **Filters:** Quick toggles for "All Projects", "Projects by PM", and "My Own Projects".  
* **Enhanced Project Cards:** Each project card on the landing page now explicitly displays the PM's name, the project's Status Flag, and a compact Target vs. Actual progress indicator for rapid scannability.  
* **High-Density Data Table:** Replaces the basic list view with an interactive data table displaying Title, Process Group, Priority, Weight, Multi-Dates, PIC, and Weighted Progress. Allows for inline cell editing.  
  
---  
  
### 📈 F. Advanced Visualisations: Gantt & Dashboards  
  
* **Per-Project Analytics Dashboard:**  
  * Incorporates S-Curve logic (Planned vs. Actual realisation line) and Burn-Down Charts mapping remaining effort.  
  * Integrates Target vs. Actual progress metrics and the overall Status Flag directly into the dashboard header.  
* **Per-Project Gantt Chart Enhancements:**  
  * Neatly displays the project's Target progress, Actual progress, and Status Flag.  
  * Overlays vertical lines denoting Milestones (anchored to the Target date if unachieved, or Actual date if completed).  
* **Multi-Project Executive Portfolio Dashboard:**  
  * Housed under a dedicated route/button distinct from per-project views.  
  * Features three viewing scopes: **Analytics by Project**, **Analytics by PM** (aggregating a specific PM's portfolio), and **Total Company Projects** (a macro view of all active capital investments).  
* **Executive Multi-Project Gantt Chart:**  
  * Displayed at the top of the *Analytics by PM* and *Total Company* dashboards.  
  * **Simplified Project Bars:** Displays 3 clean timeline bars per project (Initial, Updated, Actual) without cluttering the screen with individual tasks.  
  * **Date Spans:** The bars stretch from the earliest start date to the latest end date of the tasks within that tier. If the project is unfinished, the Actual bar terminates at "Today".  
  * **Milestone Nodes:** Bars are decorated with milestone icons. Hovering triggers an instant tooltip detailing the Milestone Name, Description, and Achieved Date.  
  
---  
  
### ⚙️ G. Global Settings & System "About"  
  
* **Settings Menu:** Active interface restricted to Super PMs (except for Personal Profile edits).  
  * Registration Approvals queue.  
  * Privilege Invocation & Safe User Deletion.  
  * Global Holiday Calendar (CRUD interface for public holidays).  
* **About / Credits Page:** A dedicated modal outlining the application version (v2.1.0), the tech stack, and official architectural credits denoting you as the Grand Designer.  
  
---  
  
## 3. Database Schema Extensions (Prisma ORM)  
  
All database entities will be upgraded to include an **Audit Trail** (`createdAt`, `createdBy`, `updatedAt`, `updatedBy`).  
  
```prisma  
// 1. Audit Trail applied across all models  
// 2. Global Holidays Table  
model Holiday {  
  id          String   @id @default(uuid())  
  date        DateTime @unique @db.Date  
  description String  
  isNational  Boolean  @default(true)  
  createdAt   DateTime @default(now())  
  createdBy   String?  
  updatedAt   DateTime @updatedAt  
  updatedBy   String?  
}  
  
// 3. User Approval Status & Advanced Privileges  
enum ApprovalStatus {  
  PENDING  
  APPROVED  
  REJECTED  
}  
  
model User {  
  // ... existing fields  
  approvalStatus    ApprovalStatus @default(PENDING)  
  approvedAt        DateTime?  
  approvedBy        String?  
  dashboardAccess   String[]       // e.g., ["PROJECT", "PM", "COMPANY"]  
  projectVisibility String[]       // Array of Project IDs explicitly permitted  
}  
  
// 4. Milestone Entity  
model Milestone {  
  id              String   @id @default(uuid())  
  projectId       String  
  project         Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)  
  name            String  
  description     String?  
  initialTarget   DateTime @db.Date  
  updatedTarget   DateTime @db.Date  
  actualAchieved  DateTime? @db.Date  
  createdAt       DateTime @default(now())  
  createdBy       String?  
  updatedAt       DateTime @updatedAt  
  updatedBy       String?  
}  
  
// 5. Task Weight Extension  
model Task {  
  // ... existing fields  
  weight       Float    @default(1.0) // Task Volume / Duration Weight  
  createdAt    DateTime @default(now())  
  createdBy    String?  
  updatedAt    DateTime @updatedAt  
  updatedBy    String?  
}  
