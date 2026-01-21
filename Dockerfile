# Use Node.js 20 (LTS version)
FROM node:20-alpine


WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./
COPY flag.txt /

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application (optional for dev, required for prod)
# RUN npm run build

# Expose port
EXPOSE 4000

# Start in development mode
CMD ["npm", "run", "dev"]