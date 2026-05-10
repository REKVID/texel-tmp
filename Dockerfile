# ── Stage 1: Build React frontend ──────────────────────────────────────────────
FROM node:20 AS builder

WORKDIR /app

# Install dependencies (need full node:20 for sqlite3 native build in deps)
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Vite env vars baked in at build time.
# nginx will proxy /ai-chat/* → ai-chat-service:8001
# nginx will proxy /news-api/* → news-service:8002
ARG VITE_AI_CHAT_API_URL=/ai-chat
ARG VITE_NEWS_API_URL=/news-api
ENV VITE_AI_CHAT_API_URL=$VITE_AI_CHAT_API_URL
ENV VITE_NEWS_API_URL=$VITE_NEWS_API_URL

RUN npm run build

# ── Stage 2: Serve with nginx ───────────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
