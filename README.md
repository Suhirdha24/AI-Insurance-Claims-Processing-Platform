# SHIELD AI - Enterprise Insurance Claims Processing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Docker Compose](https://img.shields.io/badge/docker--compose-v2-blue.svg)](https://www.docker.com/)

A complete, production-quality, end-to-end AI-assisted insurance claims management platform built with Next.js 14 App Router, Express.js, MongoDB, BullMQ, Redis, and a flexible AI Provider abstraction layer.

---

## 🚀 Key Platform Features

- 🔒 **Role-Based & Resource-Level Authorization**: Roles (`CUSTOMER`, `ADJUSTER`, `ADMIN`) with strict server-side resource isolation.
- 📑 **Multi-Step Claim Submission Wizard**: Customer portal with vehicle incident forms, drag-and-drop document uploader, and validation.
- 🤖 **AI Provider Abstraction Layer**: Pluggable provider interface supporting `MockAIProvider` (zero API key dependency), `OpenAIProvider`, `GeminiProvider`, and `AnthropicProvider`.
- 🔍 **AI Document Extraction**: Automated OCR & structured data extraction with Zod schema validation.
- ⚠️ **Cross-Document Discrepancy Engine**: Automatically detects date, vehicle registration, and amount mismatches between claim forms, police reports, and repair estimates.
- 📸 **AI Visual Damage Assessment**: Multimodal computer vision analysis identifying damage areas, severity, and repair estimates with adjuster manual override.
- 📊 **Deterministic Risk Engine**: Multi-factor scoring algorithm (0–100) evaluating amount anomalies, document mismatches, duplicate claim signals, and historical frequency.
- 🧑‍⚖️ **Human-in-the-Loop 3-Column Review Workspace**: Dedicated workspace for claims adjusters. **AI is 100% advisory—final business decisions rest with authorized human adjusters**.
- 💬 **Contextual AI Claim Assistant**: Secure claim-specific chatbot for adjusters.
- 🔎 **Natural Language Claim Search**: Converts queries ("Show high-risk vehicle claims above ₹2 lakh") into safe MongoDB filters.
- ⚡ **Asynchronous Background Processing**: Powered by Redis & BullMQ queue workers.
- 📈 **Real-Time Socket.IO Updates**: Live UI status transitions without page refreshes.
- 🛡️ **Immutable Audit Logging**: Compliance audit trail recording all user actions, AI processing runs, and adjuster verdicts.
- 🐳 **Full Docker Orchestration**: Production multi-container `docker-compose.yml`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, React Hook Form, Zod |
| **Backend API** | Node.js, Express.js, TypeScript, Mongoose, JWT, bcryptjs, Helmet, CORS, Express Rate Limit |
| **Background Processing** | Redis 7, BullMQ 5 |
| **Database** | MongoDB 7 |
| **Real-time** | Socket.IO |
| **Infrastructure** | Docker, Docker Compose |

---

## 🔑 Demo Login Credentials

Run `npm run seed` or launch Docker Compose to populate demo data:

| Role | Email | Password | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@example.com` | `password123` | Submit vehicle claims & track status timeline |
| **Adjuster** | `adjuster@example.com` | `password123` | Review 3-column workspace & render approval/rejection |
| **Admin** | `admin@example.com` | `password123` | System analytics, user management & audit logs |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js >= 20.0.0
- Docker & Docker Compose (or local MongoDB + Redis instances)

### Option A: Running with Docker Compose (Recommended)

```bash
# 1. Clone & enter workspace
cd "c:\AI Insurance"

# 2. Launch all services (MongoDB, Redis, API, Worker, Web)
docker compose up --build
```
Access points:
- **Web App**: `http://localhost:3000`
- **REST API**: `http://localhost:5000`

### Option B: Running Monorepo Workspaces Locally

```bash
# 1. Install all monorepo dependencies
npm install

# 2. Build shared types package
npm run build:shared

# 3. Seed MongoDB with demo data
npm run seed

# 4. Start API, Worker, and Web concurrently
npm run dev
```

---

## 🧮 Deterministic Risk Scoring Algorithm

Risk Score (0–100) is calculated deterministically from AI signals and business rules:

$$\text{Risk Score} = \min(100, \text{Amount Anomaly} + \text{Document Discrepancies} + \text{Duplicate Signals} + \text{Claim Frequency})$$

- **Amount Anomaly (Max 20 pts)**: Triggered when claim amount > 80% of policy limit.
- **Document Discrepancies (Max 30 pts)**: Date mismatch (+15 pts), Registration mismatch (+15 pts), Name mismatch (+10 pts).
- **Duplicate Claim Signals (30 pts)**: Vehicle reg or incident date matches a previously filed claim.
- **Historical Claim Frequency (Max 20 pts)**: Claimant has >1 claim in past 12 months.

**Risk Tiers**: `LOW` (0–30), `MEDIUM` (31–60), `HIGH` (61–80), `CRITICAL` (81–100).

---

## 📄 Documentation

- [`AI_USAGE.md`](AI_USAGE.md) - Transparency report on AI assistance and provider architecture
- [`docs/architecture.md`](docs/architecture.md) - System architecture diagram and queue workflow
- [`docs/api.md`](docs/api.md) - REST API specification endpoints
- [`docs/database.md`](docs/database.md) - Database collections and index design

---

## ⚖️ License
MIT License.
