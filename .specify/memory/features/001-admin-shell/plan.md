# Implementation Plan: Admin Shell

**Branch**: `001-admin-shell` | **Date**: 2026-04-06 | **Spec**: [spec.md](file:///c:/Users/Mustafa/Desktop/FATMEH/hack%20and%20escap/.specify/memory/features/001-admin-shell/spec.md)
**Input**: Feature specification from `/specs/001-admin-shell/spec.md`

## Summary

Implement a secure Admin Dashboard shell. This includes a `/admin/login` page for authentication, frontend JWT session management (storing tokens and protecting routes), and a persistent `AdminLayout` with a sidebar providing navigation to Team, Gallery, Media, and Sponsors sections.

## Technical Context

**Language/Version**: Node.js 20+, React 19, Next.js 16  
**Primary Dependencies**: `jsonwebtoken`, `bcryptjs`, `zod`, `react-icons`  
**Storage**: JSON flat-file storage (`backend/data/*.json`)  
**Testing**: Manual Browser Verification (Primary)  
**Target Platform**: Web (Next.js App Router)  
**Project Type**: Web Application (Full-stack)  
**Performance Goals**: <1s for login redirect, <200ms for client-side navigation  
**Constraints**: Must strictly follow Constitution principles (isolated admin routes, mandatory auth)  
**Scale/Scope**: Single admin user, 4 main management sections.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I (Separation)**: All admin routes will live under `/admin` and be isolated from public routes.
- [x] **Principle II (Authentication)**: Backend `/api/auth/login` already exists (assumed); frontend will handle JWT storage and include it in `Authorization` headers.
- [x] **Principle III (CRUD/Confirmation)**: Sidebar will link to CRUD pages; shell will provide consistent layout for confirmation modals.
- [x] **Principle IV (Validation)**: Login form will use `zod` for client-side validation before hitting the API.
- [x] **Principle V (Sync)**: Admin pages will fetch data dynamically via API; no hardcoded content.

## Project Structure

### Documentation (this feature)

```text
.specify/memory/features/001-admin-shell/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   └── auth.js
│   └── controllers/
│       └── authController.js

frontend/
├── src/
│   ├── app/
│   │   └── admin/
│   │       ├── layout.js       # Admin Shell Layout
│   │       ├── page.js         # Admin Dashboard Home
│   │       └── login/
│   │           └── page.js     # Login Page
│   ├── components/
│   │   ├── admin/
│   │   │   ├── Sidebar.js
│   │   │   ├── Header.js
│   │   │   └── ProtectedRoute.js
│   └── lib/
│       └── auth.js             # Client-side auth utilities
```

**Structure Decision**: Option 2: Web application (Next.js frontend + Express backend).

## Verification Plan

### Automated Tests
- None currently infra-supported. PROPOSE: Add `jest` or `vitest` for auth logic in `frontend/src/lib/auth.js`.

### Manual Verification
1.  **Unauthorized Access**:
    - Navigate to `http://localhost:3000/admin`.
    - BEHAVIOR: Redirected to `http://localhost:3000/admin/login`.
2.  **Invalid Login**:
    - Enter wrong credentials at `/admin/login`.
    - BEHAVIOR: Error message displayed.
3.  **Successful Login**:
    - Enter valid credentials.
    - BEHAVIOR: Redirected to `/admin`, sidebar visible with Team, Gallery, Media, Sponsors links.
4.  **Persistent Session**:
    - Refresh `/admin` after login.
    - BEHAVIOR: Remain logged in.
5.  **Logout**:
    - Click logout button.
    - BEHAVIOR: Token cleared, redirected to `/admin/login`.
