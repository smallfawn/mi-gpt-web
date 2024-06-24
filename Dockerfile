# Stage 1: Build frontend Vue.js application
FROM node:20 AS frontend-builder

WORKDIR /app
COPY ./web/package*.json ./
RUN npm install
COPY ./web .
RUN npm run build

# Stage 2: Setup backend Node.js application
FROM node:20 AS backend

WORKDIR /app
COPY ./server/package*.json ./
RUN npm install
COPY ./server .

# Install PM2 globally
RUN npm install pm2 -g


# Expose backend port (not needed to map externally)
EXPOSE 3344

# Start backend using PM2
CMD ["pm2-runtime", "index.js", "--watch", "--no-daemon"]

# Stage 3: Setup Nginx to serve frontend and proxy backend
FROM nginx:latest

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose frontend port
EXPOSE 6024

# Start Nginx with daemon off
CMD ["nginx", "-g", "daemon off;"]