FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY /src .
COPY /public .

# Expose port
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev"] 