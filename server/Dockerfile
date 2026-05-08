FROM node:20

WORKDIR /app

# Copy root package files (server shares root package.json)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy server source
COPY server/ ./server/

EXPOSE 3001

CMD ["node", "server/index.js"]
