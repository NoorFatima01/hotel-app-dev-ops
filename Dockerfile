# Stage 1 — Build Frontend
FROM node:18 AS frontend-builder
WORKDIR /app
# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
# Copy source and build
COPY frontend ./frontend
RUN cd frontend && npm run build

# Stage 2 — Build Backend
FROM node:18 AS backend-builder
WORKDIR /app
# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install
# Copy the rest of backend source and build it
COPY backend ./backend
WORKDIR /app/backend
RUN npm run build   # generates /app/backend/dist

# Stage 3 — Final Runtime Image
FROM node:18 AS production
WORKDIR /app
# Copy backend compiled code (TypeScript → dist)
COPY --from=backend-builder /app/backend/dist ./dist

# Copy backend dependencies
COPY --from=backend-builder /app/backend/node_modules ./node_modules

# Copy package.json so npm can find scripts
COPY --from=backend-builder /app/backend/package*.json ./

# Copy frontend build into dist/public
COPY --from=frontend-builder /app/frontend/dist ./dist/public

# Expose backend port
EXPOSE 7000
# Start backend 
CMD ["npm", "start"]
