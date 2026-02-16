FROM node:20-alpine

WORKDIR /app

# Install dependencies first (caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start command
CMD ["npm", "start"]
