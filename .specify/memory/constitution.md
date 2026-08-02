<!--
Sync Impact Report
==================
Version change: [TEMPLATE] → 1.0.0 (initial constitution population)
Modified principles: All placeholders replaced with concrete values derived from codebase.
Added sections:
  - Technology Stack & Constraints
  - Development Workflow & Quality Gates
Removed sections: None (template sections all populated)
Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending — verify Constitution Check references updated
  - .specify/templates/spec-template.md ⚠ pending — verify scope constraints aligned
  - .specify/templates/tasks-template.md ⚠ pending — verify task categories reflect security & upload principles
Deferred TODOs:
  - TODO(RATIFICATION_DATE): Exact project kick-off date unknown; marked as project start estimate 2026-04-06.
-->

# Hack & Escape Constitution

## Core Principles

### I. Separation of Concerns — Admin vs. Public

The Admin Dashboard MUST be completely isolated from the public-facing website in both routing
and access. Admin routes MUST live under `/admin` (or a dedicated subdomain) and MUST
never be reachable by unauthenticated users. The public website MUST only consume data
through the `/api` read-only public endpoints; it MUST NOT call admin-only endpoints.

**Rationale**: Mixing admin and public surfaces creates attack vectors and tightly couples
two domains with fundamentally different audiences and trust levels.

### II. Authentication-First (NON-NEGOTIABLE)

Every state-mutating API endpoint (Create, Update, Delete) MUST be protected by the JWT
authentication middleware (`authMiddleware.js`). No protected route may be reached without
a valid, unexpired JWT. Tokens MUST be signed with the `JWT_SECRET` environment variable;
hard-coded secrets are strictly forbidden. Password storage MUST use `bcryptjs` hashing —
never plaintext.

**Rationale**: The admin dashboard controls all website content. A single authentication
bypass exposes the entire public presence.

### III. Full CRUD with Confirmation Gates

Every managed resource (Team, Gallery, Media, Sponsors) MUST expose all four CRUD
operations through dedicated API routes and matching admin UI pages. Destructive operations
(Delete) MUST require an explicit confirmation step (dialog/popup) before execution.
The frontend MUST optimistically update the UI only after receiving a successful API
response — never before.

**Rationale**: Content integrity depends on atomic, confirmed operations. Optimistic
mutations without server confirmation lead to data inconsistency.

### IV. Validated Input & Safe File Handling

All incoming data MUST be validated using `zod` schemas before any database write or file
operation. File uploads (Gallery images, Sponsor logos) MUST be processed exclusively
through the `uploadMiddleware.js` (Multer) pipeline, which enforces MIME-type checking and
size constraints. Raw, unvalidated user input MUST never reach the persistence layer.

**Rationale**: Unvalidated input is the primary source of data corruption and injection
attacks. Zod provides a single source-of-truth schema shared by documentation and runtime.

### V. Real-Time Content Synchronisation

Any data change made in the Admin Dashboard MUST be immediately visible on the public
website's corresponding page without requiring a rebuild or redeployment. The main website
pages (Team, Gallery, Media, Home/Sponsors) MUST fetch data dynamically from the backend
API on each request. Static hardcoded content in the frontend is strictly forbidden for
the four managed sections.

**Rationale**: The core value proposition of the admin dashboard is live content
management. Stale or hardcoded content defeats the purpose entirely.

## Technology Stack & Constraints

- **Backend**: Node.js + Express 5 with CommonJS modules. Middleware stack: Helmet
  (security headers), CORS, Morgan (request logging), Multer (uploads), Zod (validation),
  bcryptjs (password hashing), jsonwebtoken (auth tokens).
- **Database**: JSON flat-file store via `src/lib/db.js`. Collections: `team`, `gallery`,
  `media`, `sponsors`, `users`. Each document receives an auto-generated `_id` (timestamp)
  and `createdAt`/`updatedAt` ISO timestamps.
- **File Storage**: Uploaded images MUST be served via the static `/uploads` endpoint
  (`/backend/public/uploads`). Image URLs stored in DB MUST be relative paths, not
  absolute host-specific URLs.
- **Frontend**: Next.js 16 (App Router) + React 19, vanilla CSS. I18n routing via
  `[locale]` segment. No external UI component libraries permitted without explicit
  approval.
- **Localisation**: The application supports bilingual routes (locale-based routing).
  Any new page or content section MUST include both locale route handlers.
- **Environment Variables**: All secrets and environment-specific config MUST reside in
  `.env` files. Hard-coded values for PORT, JWT_SECRET, DB paths, or email credentials
  are strictly prohibited.

## Development Workflow & Quality Gates

- **API-First**: Backend routes and data schemas MUST be defined and agreed upon before
  frontend components are built against them.
- **Endpoint Naming**: Public read endpoints use `/api/<resource>` (GET only). Admin
  mutation endpoints MUST be added under a protected namespace (e.g., `/api/admin/<resource>`)
  with the `authMiddleware` applied at the router level, not per-route.
- **Error Handling**: All errors MUST propagate to the global error handler in `app.js`.
  Controllers MUST use `next(err)` for unhandled exceptions. HTTP status codes MUST be
  semantically correct (400 validation, 401 unauthenticated, 403 forbidden, 404 not found,
  500 server error).
- **Image Previews**: The admin UI MUST render an image preview before the upload is
  confirmed, giving the admin a chance to verify the asset before saving.
- **Delete Confirmation**: A modal/popup confirmation MUST appear before any delete action
  is dispatched to the API.
- **Readability**: All response bodies MUST be JSON. No HTML error pages from the API.

## Governance

This constitution supersedes all other verbal or informal practices. Any amendment MUST:

1. Be documented in this file with a version bump following semantic versioning
   (MAJOR.MINOR.PATCH as defined below).
2. Receive explicit approval before implementation begins.
3. Include a migration plan if the amendment changes an existing principle that
   implemented code already relies on.

**Versioning Policy**:
- MAJOR: Removal or redefinition of a core principle, or breaking change to the
  mandatory stack/data model.
- MINOR: Addition of a new principle, section, or materially expanded guidance.
- PATCH: Clarifications, wording improvements, typo fixes, non-semantic refinements.

**Compliance**: All feature specs and implementation plans MUST include a "Constitution
Check" section confirming each principle is addressed. Any deviation requires documented
justification and a constitution amendment.

**Version**: 1.0.0 | **Ratified**: 2026-04-06 | **Last Amended**: 2026-04-06
