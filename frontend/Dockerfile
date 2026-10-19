# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Pass the backend URL as a build arg so Vite can bake it in
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

# ---- Production Stage (Nginx) ----
FROM nginx:1.27-alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
