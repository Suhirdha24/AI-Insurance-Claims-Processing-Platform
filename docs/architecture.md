# System Architecture & Workflow Specifications

## High-Level Data Flow

```
Customer Portal (Next.js)
       │
       ▼
Express API Gateway (JWT & RBAC Validation)
       │
       ├─────────────────────────┐
       ▼                         ▼
MongoDB Database            Redis BullMQ Queue
(Claims, Users, Policies)   (claim-processing-queue)
                                 │
                                 ▼
                         BullMQ Background Worker
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼
            AI Provider Engine          Deterministic Risk Engine
        (Mock / OpenAI / Gemini)       (Score 0-100 Calculation)
                   │                           │
                   └─────────────┬─────────────┘
                                 ▼
                         MongoDB Update
                                 │
                                 ▼
                         Socket.IO Notification
                                 │
                                 ▼
                    Adjuster Workspace Update
```
