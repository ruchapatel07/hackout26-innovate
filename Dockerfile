# Multi-stage Dockerfile for CarbonTrace Full-Stack Deployment
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy frontend source and build
COPY frontend ./frontend
RUN cd frontend && npm run build

# Production Server Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5005

# Copy backend manifests and install production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend source & data
COPY backend ./backend
COPY localdb.json ./

# Copy built frontend dist from builder stage
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 5005

CMD ["node", "backend/server.js"]
