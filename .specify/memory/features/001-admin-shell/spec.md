# Feature Specification: Admin Shell

**Feature Branch**: `001-admin-shell`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "Admin Shell: login page, JWT frontend auth handling, and base admin layout with sidebar navigation"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Logs In Securely (Priority: P1)

The admin navigates to the `/admin/login` page, enters their email and password, and upon
successful authentication is redirected to the main admin dashboard home. A persistent
session is maintained so the admin does not need to log in again on page refresh or
navigation between admin sections.

**Why this priority**: Without a working login and session, no admin functionality is
accessible. This is the absolute prerequisite for every other admin feature.

**Independent Test**: Can be fully tested by visiting `/admin/login`, submitting valid
credentials, and verifying that the admin dashboard home is displayed with the sidebar
visible.

**Acceptance Scenarios**:

1. **Given** the admin is on the login page, **When** they enter a valid email and password
   and submit, **Then** they are redirected to `/admin` (dashboard home) and the sidebar is
   visible.
2. **Given** the admin is on the login page, **When** they enter an invalid email or
   password, **Then** an error message is shown and they remain on the login page.
3. **Given** the admin is authenticated, **When** they refresh or navigate to any `/admin`
   sub-page, **Then** they remain logged in without being asked to re-authenticate.
4. **Given** an unauthenticated user navigates directly to any `/admin` route, **When** the
   page loads, **Then** they are automatically redirected to `/admin/login`.

---

### User Story 2 - Admin Navigates the Dashboard Shell (Priority: P2)

Once logged in, the admin sees a clean, consistent layout with a sidebar listing the four
content management sections (Team, Gallery, Media, Sponsors). Clicking any sidebar link
navigates to the corresponding section page without a full page reload.

**Why this priority**: The shell is the home for all admin features. An unusable or
inconsistent layout blocks all future content management work.

**Independent Test**: Can be tested by logging in, verifying the sidebar renders all four
section links, and clicking each link to confirm navigation occurs and the active link is
highlighted.

**Acceptance Scenarios**:

1. **Given** the admin is on any admin page, **When** the page renders, **Then** the
   sidebar displays links for Team, Gallery, Media, and Sponsors.
2. **Given** the admin clicks a sidebar link, **When** the navigation completes, **Then**
   the clicked link is visually highlighted as active and the correct page content is shown.
3. **Given** the admin is on any admin page, **When** they view the header/top bar, **Then**
   the project name/logo and a logout button are visible.

---

### User Story 3 - Admin Logs Out (Priority: P3)

The admin can log out from any page in the dashboard via a clearly visible logout button.
After logging out, the session is cleared and they are redirected to the login page.
Subsequent attempts to access admin pages redirect back to login.

**Why this priority**: Secure session termination is required to prevent unauthorized
access after the admin leaves their workstation.

**Independent Test**: Can be tested by clicking logout and verifying the admin is
redirected to login and cannot navigate back to admin pages without re-authenticating.

**Acceptance Scenarios**:

1. **Given** the admin is logged in, **When** they click the logout button, **Then** the
   session is cleared and they are redirected to `/admin/login`.
2. **Given** the admin has just logged out, **When** they attempt to navigate to
   `/admin` or any admin sub-route, **Then** they are redirected to `/admin/login`.

---

### Edge Cases

- What happens when the JWT token expires mid-session? The admin should be silently
  redirected to the login page with an informative message.
- What happens if the login API is unreachable? A user-friendly error message must be
  displayed without crashing the page.
- What happens when the admin opens the login page while already authenticated? They
  should be redirected directly to `/admin` without seeing the login form.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a dedicated login page at `/admin/login` accessible only
  to unauthenticated users.
- **FR-002**: System MUST authenticate admins using email and password, returning a session
  token upon success.
- **FR-003**: System MUST store the session token on the client side in a secure,
  persistent manner so it survives page refreshes.
- **FR-004**: System MUST protect all `/admin` routes — unauthenticated access MUST
  redirect to `/admin/login`.
- **FR-005**: System MUST display a sidebar navigation with links to: Team, Gallery,
  Media, and Sponsors sections.
- **FR-006**: System MUST visually indicate the currently active sidebar section.
- **FR-007**: System MUST provide a logout action that clears the session and redirects to
  `/admin/login`.
- **FR-008**: System MUST display meaningful error messages for failed login attempts
  (wrong credentials, server unavailable).
- **FR-009**: System MUST redirect an already-authenticated admin away from the login page
  to the dashboard home.
- **FR-010**: System MUST handle expired sessions gracefully by redirecting to the login
  page.

### Key Entities

- **Admin Session**: Represents an authenticated admin session. Key attributes: token
  (opaque credential), expiry time, associated admin identity.
- **Admin User**: The single privileged user allowed to access the dashboard. Key
  attributes: email, hashed password.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The admin can complete the full login → dashboard → logout flow in under
  60 seconds on a standard connection.
- **SC-002**: Unauthenticated access to any `/admin` route results in a redirect to
  `/admin/login` within 1 second.
- **SC-003**: An invalid login attempt displays a visible error message within 3 seconds
  of form submission.
- **SC-004**: The sidebar renders all four section links and the active-state indicator
  on every admin page without manual refresh.
- **SC-005**: Logging out clears the session such that the browser back button cannot
  restore access to a protected admin page.

## Assumptions

- A single admin account exists (created via the existing `/api/auth/register` endpoint or
  a seed script); self-registration from the admin UI is out of scope.
- The existing backend `/api/auth/login` endpoint returns a JWT on successful
  authentication and is the sole auth mechanism.
- The admin dashboard is accessible under the `/admin` route on the same Next.js frontend
  app (no separate subdomain for this phase).
- Mobile responsiveness for the admin layout is a nice-to-have but not a hard requirement
  for this feature; desktop-first layout is acceptable.
- Locale-based routing (`[locale]` segment) applies to the public site only; the admin
  shell lives outside the locale segment.
