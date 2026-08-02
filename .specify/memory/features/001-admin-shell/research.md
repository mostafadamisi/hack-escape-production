# Research: Admin Shell

## Decision: JWT Storage & Session Management
- **Chosen**: `localStorage` + `Authorization: Bearer <token>` header.
- **Rationale**: The existing backend (`authController.js`) returns the token in the response body, not as a cookie. Client-side storage is necessary. `localStorage` is straightforward for this project's scope.
- **Alternatives considered**: 
    - **HttpOnly Cookies**: Requires backend changes to set `Set-Cookie` header. Rejected to avoid scope creep for 001.
    - **Context API only**: Rejected because it doesn't persist on refresh.

## Decision: Route Protection (Next.js 16)
- **Chosen**: Client-side `useEffect` check + Next.js Middleware.
- **Rationale**:
    - **Middleware**: For immediate redirect of unauthenticated users visiting `/admin/*`.
    - **Client-side Check**: To handle token expiration mid-session and update global auth state.
- **Alternatives considered**: 
    - **Server Components only**: Harder to manage `localStorage` (server can't read it).

## Decision: Admin Layout
- **Chosen**: Nested `layout.js` in `app/admin/layout.js`.
- **Rationale**: Ensures the sidebar and header are persistent across all `/admin` sub-routes without re-rendering the layout.
- **Structure**:
    - `Sidebar`: Links to managed sections.
    - `Header`: Project logo + Logout button.
    - `AuthGate`: Wrapper or Middleware to enforce login.

## Backend Integration Details
- **Endpoint**: `POST /api/auth/login`
- **Request**: `{ email, password }`
- **Response**: `{ _id, name, email, role, token }`
- **Auth Header**: `Authorization: Bearer <token>`

## Identified Needs for Phase 1
- `AdminUser` zod schema for form validation.
- `AuthContext` or `useAuth` hook for managing global auth state.
- `Sidebar` component with active state handling.
