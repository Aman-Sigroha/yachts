# Yaacht V3 API & Sync Service

A Node.js/TypeScript service that synchronizes data from Nausys API (v6) into MongoDB and exposes a REST API to query yachts, reservations, invoices, and contacts.

## Requirements
- Node.js 18+
- MongoDB (connection string in .env)

## Setup
1. Install dependencies
`
npm install
`

2. Configure environment
Create a .env file in the project root:
`
MONGO_URI=mongodb://localhost:27017/yaacht
NAUSYS_USERNAME=your-nausys-username
NAUSYS_PASSWORD=your-nausys-password
NAUSYS_CREW_SECURITY_CODE=optional-security-code
PORT=3000
`

3. Build
`
npm run build
`

4. Run (development)
`
npm run dev
`

5. Run (production)
`
npm start
`

## Data Sync
Trigger a full sync from Nausys into MongoDB:
`
npm run sync
`
This runs the compiled script at dist/scripts/sync.js and will sequentially sync:
- Catalogue (bases, countries, equipment, categories, services, builders)
- Yachts & yacht models
- Reservations & occupancy
- Crew (requires NAUSYS_CREW_SECURITY_CODE)
- Invoices (base, agency, owner)
- Contacts

## REST API
Base URL (default): http://localhost: (defaults to 3000)

### API Docs (Swagger UI)
- Visit: http://localhost:3000/api-docs

### Invoices
- Get invoices
`
GET /api/invoices?type=agency&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=10
`
- Get invoice by id
`
GET /api/invoices/{id}
`
- Stats summary
`
GET /api/invoices/stats/summary?startDate=2024-01-01&endDate=2024-12-31
`

### Yachts
- Get yachts (filters + pagination)
`
GET /api/yachts?category=1&builder=1&minLength=30&maxLength=50&minCabins=2&maxCabins=4&year=2023&page=1&limit=10
`
- Search
`
GET /api/yachts/search/query?q=luxury
`
- Get by id
`
GET /api/yachts/{id}
`
- Stats
`
GET /api/yachts/stats/summary
`

### Reservations
- List
`
GET /api/reservations?yachtId=123&startDate=2024-01-01&endDate=2024-12-31&status=RESERVATION&page=1&limit=10
`
- Get by id
`
GET /api/reservations/{id}
`
- Availability by yacht
`
GET /api/reservations/availability/{yachtId}?startDate=2024-01-01&endDate=2024-12-31
`
- Stats
`
GET /api/reservations/stats/summary?startDate=2024-01-01&endDate=2024-12-31
`

### Contacts
- List
`
GET /api/contacts?name=John&email=john@example.com&company=true&page=1&limit=10
`
- Search
`
GET /api/contacts/search/query?q=John
`
- Get by id
`
GET /api/contacts/{id}
`
- Stats
`
GET /api/contacts/stats/summary
`

## Scripts
- 
pm run dev - Start server with nodemon (TypeScript)
- 
pm start - Build and start server
- 
pm run build - Compile TypeScript to dist
- 
pm run sync - Build and run full data sync

## Project Structure
`
src/
  db/connection.ts      Mongo connection
  models/               Mongoose schemas & models
  routes/               Express route handlers (REST API)
  services/sync-db.ts   Sync workflows from Nausys to MongoDB
  sync.ts               Nausys API client (axios)
  server.ts             Express app setup
  utils/logger.ts       Centralized logger (winston)
`

## Notes
- Rate limiting is enabled on all /api routes (300 requests / 15 minutes per IP)
- Request logging via morgan  winston (console + files under logs/)
- Swagger docs are auto-generated from JSDoc annotations in src/routes/*
- Some Nausys invoice endpoints require specific permissions and may return AUTHENTICATION_ERROR if not granted

## Troubleshooting
- Ensure MongoDB is reachable and MONGO_URI is correct
- Ensure Nausys credentials are valid and whitelisted
- For Windows + PowerShell, prefer using Postman to test endpoints instead of curl

License: ISC
