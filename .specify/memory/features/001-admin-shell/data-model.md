# Data Model: Admin Shell

## Entities

### User (`users` collection)
The core identity permitted to access the admin dashboard.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `_id` | String | Unique ID (timestamp-based) | Auto-generated |
| `name` | String | Display name | Required, min 2 chars |
| `email` | String | Unique login email | Required, Email format |
| `password` | String | Hashed password (bcryptjs) | Required, min 8 chars |
| `role` | String | Access level (`organizer`, `admin`) | Required |
| `createdAt`| ISO8601| Creation timestamp | Auto-generated |
| `updatedAt`| ISO8601| Last update timestamp | Auto-generated |

### Session (Client-side only)
Represents the active authenticated state in the browser.

| Field | Type | Description |
|-------|------|-------------|
| `token` | String | JWT received from `/api/auth/login` |
| `user` | Object | The `name`, `email`, and `role` of the logged-in user |
| `isAuthenticated`| Boolean| Reactive state to guard UI routes |

## Relationships
- A **User** authenticates to create a **Session**.
- The **Session** token is used in the `Authorization` header to access protected **CRUD** resources (Team, Gallery, Media, Sponsors).

## State Transitions
1.  **Unauthenticated**: Initial state or after logout/expiry.
2.  **Authenticating**: Pending API response from `/api/auth/login`.
3.  **Authenticated**: Token stored, redirects allowed to `/admin`.
4.  **Error**: Failed login attempt, display message.
