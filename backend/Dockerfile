# Use official lightweight Node image
FROM node:18-alpine

# Enable corepack to use pnpm
RUN corepack enable

# Set working directory inside container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --prod

# Copy rest of the project files
COPY . .

# Expose port (change 5000 if your backend uses another)
EXPOSE 5000

# Start the app
CMD ["pnpm", "start"]
