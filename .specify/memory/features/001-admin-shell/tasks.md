# Tasks: Admin Shell

**Input**: Design documents from `/specs/001-admin-shell/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Verify backend `.env` contains `JWT_SECRET`
- [ ] T002 Verify frontend `.env.local` contains `NEXT_PUBLIC_API_URL`
- [ ] T003 [P] Create `frontend/src/app/admin` directory structure

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T004 Implement `AuthContext` in `frontend/src/components/admin/AuthContext.js`
- [ ] T005 [P] Implement `api` utility for fetch with auth headers in `frontend/src/lib/api.js`
- [ ] T006 [P] Implement client-side auth helpers in `frontend/src/lib/auth.js`

**Checkpoint**: Foundation ready - auth context and API utilities available.

## Phase 3: User Story 1 - Admin Logs In Securely (Priority: P1) 🎯 MVP

**Goal**: Admin can log in with credentials and receive a persistent token.

**Independent Test**: Navigate to `/admin/login`, enter valid credentials, verify redirect to `/admin`.

### Implementation for User Story 1

- [ ] T007 [US1] Create Login form UI in `frontend/src/app/admin/login/page.js`
- [ ] T010 [US1] Connect login form to `POST /api/auth/login` and store token
- [ ] T011 [US1] Implement error message display for failed login attempts
- [ ] T012 [US1] Redirect already-authenticated users from `/admin/login` to `/admin`

**Checkpoint**: User Story 1 functional - login works and persists.

## Phase 4: User Story 2 - Admin Navigates the Dashboard Shell (Priority: P2)

**Goal**: Authenticated admin sees a consistent sidebar layout for navigation.

**Independent Test**: Log in, verify sidebar links (Team, Gallery, Media, Sponsors) are visible.

### Implementation for User Story 2

- [ ] T013 [US2] Create Admin Layout in `frontend/src/app/admin/layout.js`
- [ ] T014 [US2] [P] Implement `Sidebar` component in `frontend/src/components/admin/Sidebar.js`
- [ ] T015 [US2] [P] Implement `Header` component in `frontend/src/components/admin/Header.js`
- [ ] T016 [US2] Implement route protection (redirect to login) in `frontend/src/app/admin/layout.js`

**Checkpoint**: User Story 2 functional - admin shell layout is integrated and protected.

## Phase 5: User Story 3 - Admin Logs Out (Priority: P3)

**Goal**: Admin can terminate their session securely.

**Independent Test**: Click logout, verify redirect to `/admin/login` and inability to return to `/admin` via back button.

### Implementation for User Story 3

- [ ] T017 [US3] Implement logout logic in `frontend/src/lib/auth.js`
- [ ] T018 [US3] Add logout button and handler to `frontend/src/components/admin/Header.js`

**Checkpoint**: All user stories functional.

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T019 [P] Add active state highlighting for sidebar links in `frontend/src/components/admin/Sidebar.js`
- [ ] T020 Add loading spinners for login and navigation transitions
- [ ] T021 Final verification of all scenarios in `spec.md`

## Dependencies & Execution Order

1.  **Phase 1 & 2** are strictly blocking.
2.  **Phase 3 (US1)** must complete before **Phase 4 (US2)** to verify the layout properly while authenticated.
3.  **Phase 5 (US3)** can be integrated into the Shell layout during Phase 4.

---

## Implementation Strategy

### MVP First
1. Complete Setup and Foundational.
2. Complete User Story 1 (Login).
3. Validate MVP: Admin can log in.
