# Stage 1: Build the SSR application
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

# This is the correct build command for Quasar SSR mode
RUN npm run build:prod

# Stage 2: Production server
# We use a slim Node.js image for the final production server
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary production files from the build stage
COPY --from=build /app/dist/ssr ./dist/ssr
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# The default port for Quasar SSR can be configured.
# We'll expose port 3000 as a common default.
# This might need to be adjusted based on your quasar.config.js
EXPOSE 3000

# The command to start the production SSR server
CMD ["node", "dist/ssr/index.js"]