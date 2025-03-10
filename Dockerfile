# Build stage
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Default port (can be overridden)
ENV PORT=80

# Replace default port in nginx config
CMD sh -c "sed -i 's/listen 80/listen '$PORT'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"

# Expose the port
EXPOSE $PORT