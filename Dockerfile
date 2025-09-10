# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (Express)
RUN npm install

# Copy the rest of the project (including dist after build)
COPY . .

# Expose port for Cloud Run
EXPOSE 7777

# Start server
CMD ["node", "app.js"]
