# 🚀 ClaimFlow AI — Production Cloud Deployment Guide

This guide walks you through deploying **ClaimFlow AI** live to production using **Vercel** (Next.js Frontend) and **Render / Railway** (Node.js API & Background Worker).

---

## 📋 Overview of Deployment Architecture

| Component | Host Service | Build Command | Environment / Notes |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | **Vercel** | `npm run build:shared && npm run build:web` | `NEXT_PUBLIC_API_URL` |
| **REST API Backend** | **Render / Railway / Cloud Run** | `npm run build:shared && npm run build:api` | Node 20.x, MongoDB, JWT |
| **Background Worker** | **Render / Railway / Cloud Run** | `npm run build:shared && npm run build:worker` | Async claims & OCR processing |
| **Database** | **MongoDB Atlas** | Managed Cluster | Connection string `MONGODB_URI` |

---

## 1. 🌐 Step 1: Deploy Frontend on Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... -> Project**.
2. Import your GitHub repository: `Suhirdha24/AI-Insurance-Claims-Processing-Platform`.
3. In **Project Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build:shared && npm run build:web`
   - **Output Directory**: `apps/web/.next`
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = `https://<your-render-api-domain>.onrender.com/api` (or your live API URL)
5. Click **Deploy**. Vercel will build and assign your live domain (e.g. `https://claimflow-ai.vercel.app`).

---

## 2. ⚙️ Step 2: Deploy Backend API & Worker on Render

1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New + -> Blueprint**.
3. Connect your repository `Suhirdha24/AI-Insurance-Claims-Processing-Platform`.
4. Render will automatically detect `render.yaml` and prompt you for configuration:
   - **Service 1**: `claimflow-ai-api` (Web Service)
   - **Service 2**: `claimflow-ai-worker` (Background Worker)
5. Set Environment Variables:
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/ai_insurance_claims?retryWrites=true&w=majority`
   - `CORS_ORIGIN`: `https://claimflow-ai.vercel.app` (your Vercel domain)
   - `JWT_SECRET`: `super_secret_production_jwt_key_2026`
6. Click **Apply**. Render will compile TypeScript packages and spin up live endpoints.

---

## 3. 🗄️ Step 3: Seed Production Database

To populate initial policy plans, claims, and default accounts in your live production MongoDB database:

```bash
# Set your MongoDB Atlas URI in .env and run:
npm run seed
```

Default Production Accounts:
- **Admin**: `admin@example.com` / `password123`
- **Adjuster**: `adjuster@example.com` / `password123`
- **Customer**: `customer@example.com` / `password123`

---

## 🐳 Alternative: 1-Click Local Docker Deployment

To launch the full production stack locally with Docker containers:

```bash
# Build and launch web, api, worker, mongodb, and redis containers
docker-compose up -d --build

# View container logs
docker-compose logs -f
```

- **Frontend**: `http://localhost:3000`
- **API Server**: `http://localhost:5000`
