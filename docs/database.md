# Database Design & Schemas

## MongoDB Collections Overview

1. `users`: User credentials, hashed passwords, roles (`CUSTOMER`, `ADJUSTER`, `ADMIN`).
2. `policies`: Customer policy numbers, coverage limits, deductibles, start/end dates, exclusions.
3. `claims`: Claim records, status, estimated/approved amounts, risk scores, vehicle details, timeline events.
4. `claimDocuments`: Metadata for uploaded PDFs and image evidence files.
5. `documentExtractions`: Structured JSON fields extracted by AI provider.
6. `damageAnalyses`: Visual damage areas, repair cost estimates, and adjuster overrides.
7. `riskAnalyses`: Overall risk scores, risk factors, and cross-document discrepancy mismatches.
8. `coverageAnalyses`: Policy limit eligibility, deductible application, and exclusion flags.
9. `claimNotes`: Adjuster internal record notes.
10. `notifications`: Real-time user notifications.
11. `auditLogs`: Read-only compliance audit entries.
