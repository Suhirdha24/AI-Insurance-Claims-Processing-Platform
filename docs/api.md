# REST API Documentation

## Authentication Endpoints
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user & return JWT tokens
- `GET /api/auth/me` - Fetch currently authenticated profile
- `POST /api/auth/logout` - Clear user session

## Claims Endpoints
- `POST /api/claims` - Submit a new claim
- `GET /api/claims` - List claims (Filtered by role & parameters)
- `GET /api/claims/:id` - Fetch full claim details, documents, extractions, risk & damage reports
- `POST /api/claims/:id/approve` - Adjuster claim approval
- `POST /api/claims/:id/reject` - Adjuster claim rejection
- `POST /api/claims/:id/request-information` - Adjuster information request
- `POST /api/claims/natural-language-search` - Convert NL query to safe MongoDB filter

## Documents & AI Endpoints
- `POST /api/claims/:claimId/documents` - Upload document file & trigger AI extraction
- `POST /api/ai/chat` - Interact with contextual AI Claim Assistant

## Admin & Analytics Endpoints
- `GET /api/analytics/dashboard` - Platform KPIs, status breakdown, workload metrics
- `GET /api/users` - Admin user directory
- `PATCH /api/users/:id/role` - Update user role
- `GET /api/audit-logs` - Retrieve system audit trail logs
