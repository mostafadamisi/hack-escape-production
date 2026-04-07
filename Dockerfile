# --- Stage 1: Build Frontend ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
# Pass API URL if known at build time, but better to handle at runtime or via Public URL
RUN npm run build

# --- Stage 2: Runtime ---
FROM node:18-alpine
WORKDIR /app

# Install concurrently for process orchestration
RUN npm install -g concurrently

# 1. Prepare Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend ./backend

# 2. Prepare Frontend
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/
COPY frontend/next.config.mjs ./frontend/

# Install Frontend production deps
RUN cd frontend && npm install --production

# Expose Port (Railway uses PORT)
# We will run Next.js on PORT and Backend on 5001
ENV PORT=3000
EXPOSE 3000

# Start both services
# Next.js will listen on PORT (e.g. 3000 or whatever Railway gives us)
# Express will listen on 5001 (internal inside container)
CMD ["concurrently", "-n", "backend,frontend", "-c", "red,blue", "cd backend && PORT=5001 node server.js", "cd frontend && npm start"]
