# Quickstart: Admin Shell

## 1. Setup Environment
Ensure your `.env` files in `backend/` and `frontend/` are correctly configured.
- `backend/.env`: Must have `JWT_SECRET`.
- `frontend/.env.local`: Must have `NEXT_PUBLIC_API_URL` pointing to the backend.

## 2. Seed Admin User
If no users exist in `backend/data/users.json`, run the seed script:
```bash
cd backend
npm run seed
```
*Default Credentials*: `admin@example.com` / `admin123` (Verify `scripts/seed.js` for actual values).

## 3. Run Applications
Start both backend and frontend:
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

## 4. Verify Shell
1.  Navigate to `http://localhost:3000/admin`.
2.  You should be redirected to `/admin/login`.
3.  Login with the seeded credentials.
4.  Verify the sidebar is visible and links to Team, Gallery, Media, and Sponsors.
5.  Click Logout to verify session termination.

## 5. Development Notes
- The Admin Shell layout is located in `frontend/src/app/admin/layout.js`.
- Auth state is managed via the `AuthContext` in `frontend/src/components/admin/AuthContext.js`.
- API calls use the `api` utility in `frontend/src/lib/api.js`.
