# Project Plan

RESTAURANT MARKETING COMMAND CENTER — Production-Ready Web Application
Tech Stack: React, Vite, TypeScript, Tailwind CSS, Lucide Icons, LocalStorage fallback & Supabase integration ready architecture.
Features:
1. Executive Marketing Dashboard (Spend, Revenue, ROAS, Active Campaigns, Reservations, Guests, New/Repeat customers, Channel performance table, Management insights).
2. Campaign Management (Full CRUD, Search, Filters by Status & Channel, Automatic ROAS calculation, Campaign Detail view/modal, Target vs Actual tracking).
3. Audience & CRM (Customer list preview, CLV, customer segments: New, Repeat, VIP, Birthday).
4. Calendar & Events (Marketing & event calendar preview grid for October 2026).
5. Reports (Weekly, Monthly, Management report templates with simulated PDF/CSV export).
6. Settings (Workspace configuration, Role permissions matrix for Owner, GM, Assistant Manager, Marketing, Finance, Integration toggles).
7. Restaurant Workspace Selector (YourName Cafe & Resto, Gourmet Bistro, Urban Eats).
8. Visual Design: Premium SaaS aesthetics inspired by ILIVOS (#6C73E8 primary purple, #8B72DE secondary purple, #668BE8 blue accent, #25283A dark text, #F7F8FC background, #FFFFFF cards, subtle borders, Manrope/Inter typography).
9. Desktop-first responsive layout with left sidebar, top header, breadcrumbs, workspace badge, notification bell, user profile avatar.

## Project Brief

# Restaurant Marketing Command Center - Project Brief

## Features
1. **Executive Marketing Dashboard**: High-level overview of core metrics (Spend, Revenue, ROAS, Active Campaigns, Reservations, and Guest counts), channel performance breakdown, and automated management insights.
2. **Campaign Management**: Interactive campaign management featuring status and channel filtering, automatic ROAS calculation, target vs. actual metrics tracking, and campaign detail views.
3. **Audience & CRM**: Customer list and customer lifetime value (CLV) overview, with audience segmentation into key categories (New, Repeat, VIP, Birthday).
4. **Multi-Workspace Selector**: Quick context-switching capability between different restaurant locations/workspaces (e.g., YourName Cafe & Resto, Gourmet Bistro, Urban Eats).

## High-Level Tech Stack
* **Language**: Kotlin
* **UI Framework**: Jetpack Compose (Material 3)
* **Navigation**: Jetpack Navigation 3 (state-driven navigation architecture)
* **Adaptive Layout Strategy**: Compose Material Adaptive library (`androidx.compose.material3.adaptive`) for responsive list-detail and multi-pane UI across phone, foldable, and tablet form factors
* **Asynchronous & State Management**: Kotlin Coroutines, StateFlow, ViewModel

## Implementation Steps
**Total Duration:** 8m 27s

### WebTask_1_ProjectSetupAndDataModels: Setup Vite + React + TypeScript + Tailwind CSS project configuration, package.json, TypeScript domain models, and LocalStorage/Supabase repository layer preloaded with realistic demo data.
- **Status:** COMPLETED
- **Updates:** Configured Vite + React + TypeScript + Tailwind CSS environment in web/, defined TypeScript interfaces (Campaign, Workspace, DashboardMetrics, ChannelPerformance, ManagementInsight, Customer, EventItem, ReportTemplate, RolePermission), and built LocalStorage / Supabase repository service preloaded with realistic demo campaigns. Verified build with `npm run build`.
- **Acceptance Criteria:**
  - package.json and Vite + React + TypeScript + Tailwind setup created
  - TypeScript interfaces defined for Campaign, Workspace, DashboardMetrics, Insight, ChannelPerformance
  - LocalStorage repository preloaded with demo data (Weekend Family, Birthday Experience, Live Music October, Lunch Weekday)
  - Data service layer functioning cleanly

### WebTask_2_ShellAndOverviewDashboard: Build Layout Shell (Sidebar, Workspace Switcher, Top Header, Navigation) and Executive Overview Dashboard screen with KPI cards, revenue analytics, channel breakdown, and insight cards.
- **Status:** COMPLETED
- **Updates:** Built Web Layout Shell (Sidebar with Workspace Switcher dropdown, TopHeader with breadcrumb and notifications, responsive mobile drawer) and Executive Overview Dashboard (KPI grid for Spend, Revenue, ROAS, Active Campaigns, Reservations, Guests, New vs Repeat customer breakdown, Top & Underperforming campaign cards, Channel Performance Table, and Management Insight Cards). Integrated with campaignService data layer and verified build with `npm run build`.
- **Acceptance Criteria:**
  - Desktop-first responsive shell with sidebar navigation and workspace dropdown switcher
  - Executive Overview Dashboard displaying spend, revenue, ROAS, active count, reservations, guests, new/repeat ratio
  - Channel performance table and actionable management insights
  - Design system styling matching #6C73E8 ILIVOS aesthetic
- **Duration:** 2m 56s

### WebTask_3_CampaignManagementAndFeatures: Implement full Campaign Management module (List/Detail view, search, status/channel filters, Create/Edit campaign modal with auto-calculated ROAS, delete confirmation) and feature modules (Performance, CRM, Calendar, Reports, Settings).
- **Status:** COMPLETED
- **Updates:** Implemented full Campaign Management module (CampaignsView, CampaignTable, CampaignDetailModal, CampaignFormModal with auto-calculated ROAS formula, DeleteCampaignModal) and feature screens (PerformanceView with attribution models, CrmView with CLV and WhatsApp broadcast modal, CalendarView with month grid, ReportsView with PDF/CSV export simulation, SettingsView with workspace setup & RBAC matrix). Wired all routes in App.tsx and verified build with `npm run build`.
- **Acceptance Criteria:**
  - Campaign Management with table/card view, detail pane, search, status and channel filter
  - Create and Edit campaign modal with auto-calculated ROAS formula
  - Delete confirmation modal
  - Performance, CRM, Calendar, Reports, and Settings screens implemented with rich preview states
- **Duration:** 5m 1s

### WebTask_4_WebBuildAndVerification: Perform web build verification (npm run build), verify static server launch setup, and document instructions for running the web application.
- **Status:** COMPLETED
- **Updates:** Verified web application build using `npm run build` (`tsc && vite build`). TypeScript type checking passed with 0 errors. Vite generated production distribution assets in `web/dist/`. Documented running and preview instructions (`npm run dev`, `npm run build`, `npm run preview`).
- **Acceptance Criteria:**
  - Vite build passes cleanly without TypeScript/JSX errors
  - Run script instructions documented
  - Final web application report delivered
- **Duration:** 30s

