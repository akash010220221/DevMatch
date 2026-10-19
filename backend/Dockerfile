# ---- Base Stage ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json ./

# ---- Dependencies Stage ----
FROM base AS deps
RUN npm install --omit=dev

# ---- Final Stage ----
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["node", "src/app.js"]
