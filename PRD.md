# Product Requirements Document (PRD): Energy Healer Admin Panel

## 1. Introduction & Overview
**Project Name:** Energy Healer Admin Panel
**Purpose:** To provide a centralized administrative interface for managing the Energy Healer application. This panel allows administrators to oversee user activity, manage content such as the "Daily Energy Flow", and monitor platform engagement.

## 2. Target Audience
- **Primary Users:** System Administrators, Content Managers for the Energy Healer platform.
- **Secondary Users:** Customer Support Representatives who may need to assist app users with their accounts.

## 3. Core Features & Scope

### 3.1. Dashboard Overview
- High-level view of platform metrics (e.g., active users, engagement rates).
- Quick links to common administrative tasks.

### 3.2. Content Management: Daily Energy Flow
- **Description:** A dedicated module for managing the "Daily Energy Flow" content.
- **Features:**
  - Ability to create, edit, and publish new Daily Energy Flow entries.
  - Upload audio/visual media associated with the daily flow.
  - Set descriptions, headings, and related metadata.

### 3.3. User Management
- **Description:** Basic tools to manage the platform's user base.
- **Features:**
  - View list of registered users.
  - Search and filter users by status or joining date.
  - Ability to block, unblock, or manage user access permissions.

## 4. Non-Functional Requirements
- **Technology Stack:** Angular frontend (version 15+), using Bootstrap and Angular Material for UI components.
- **Responsiveness:** The admin panel must be fully responsive and accessible on both desktop and tablet devices.
- **Security:** Requires secure authentication (e.g., Firebase Auth/JWT) and role-based access control (RBAC).
- **Performance:** Fast loading times, taking advantage of Angular's optimized build and lazy-loading features.

## 5. Open Questions / Next Steps
- Are there any specific audio formats or file size limits for the Daily Energy Flow audio uploads?
- What specific metrics should be prioritized on the main dashboard?
- Will there be multiple tiers of administrative access (e.g., Super Admin, Content Editor)?

---
*Document Status: Draft*
*Last Updated: February 2026*
