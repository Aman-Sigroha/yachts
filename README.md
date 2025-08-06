# Yacht Booking Platform Server

A Node.js TypeScript server that syncs yacht data from the NauSYS API to a local MongoDB database and provides REST API endpoints for a yacht browsing platform.

## Features

- 🔄 **Automatic Data Sync**: Syncs yacht data from NauSYS API every 24 hours
- 🗄️ **Local MongoDB Storage**: Stores all yacht data locally for fast access
- 🔍 **Advanced Filtering**: Filter yachts by price, type, name, length, cabins, etc.
- 📊 **Statistics API**: Get yacht statistics and price ranges
- 🚀 **RESTful API**: Clean API endpoints for frontend integration
- ⚡ **Fast Queries**: Optimized MongoDB queries with pagination
- 🏗️ **TypeScript**: Full TypeScript support with proper compilation
- 🔐 **Environment Variables**: Secure configuration management

## Prerequisites

- Node.js 18+ 
- MongoDB (local instance or MongoDB Atlas)
- Valid NauSYS API credentials
- TypeScript 5.9+

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yachts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/yachts
   NAUSYS_API_BASE=https://ws.nausys.com/CBMS-external/rest/catalogue/v6
   NAUSYS_USERNAME=your_username_here
   NAUSYS_PASSWORD=your_password_here
   PORT=3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your local machine or update the `MONGO_URI` to point to your MongoDB instance.

## Usage

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode (compiled TypeScript)
```bash
npm start
```

### Manual Data Sync
```bash
npm run sync
```

### Build TypeScript to JavaScript
```bash
npm run build
```

## API Endpoints

### Health Check
```
GET /api/health
```
**Response:** `{ "status": "OK", "message": "Yacht API is running" }`

### Get Yachts (with filtering and pagination)
```
GET /api/yachts?page=1&limit=20&search=boat&minPrice=1000&maxPrice=5000&category=sailing&company=123&minLength=30&maxLength=50&minCabins=2&maxCabins=6&sortBy=price.from&sortOrder=asc
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search in yacht name or model
- `minPrice`/`maxPrice`: Price range filter
- `category`: Yacht category filter
- `company`: Charter company filter
- `minLength`/`maxLength`: Length range filter
- `minCabins`/`maxCabins`: Cabin count range filter
- `sortBy`: Sort field (name, price.from, length, etc.)
- `sortOrder`: Sort direction (asc, desc)

**Response:**
```json
{
  "yachts": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 98,
    "pages": 5
  }
}
```

### Get Yacht by ID
```
GET /api/yachts/:id
```

### Get Charter Companies
```
GET /api/companies
```

### Get Yacht Categories
```
GET /api/categories
```

### Get Statistics
```
GET /api/stats
```
**Response:**
```json
{
  "totalYachts": 98,
  "totalCompanies": 5,
  "totalCategories": 3,
  "priceRange": {
    "minPrice": 1000,
    "maxPrice": 50000,
    "avgPrice": 15000
  },
  "lengthRange": {
    "minLength": 10,
    "maxLength": 50,
    "avgLength": 25
  }
}
```

## Data Models

### Yacht
```typescript
interface IYacht {
  yachtId: string;
  name: string;
  yachtModel: string;
  type: string;
  category: string;
  charterCompany: {
    id: string;
    name: string;
  };
  price: {
    from: number;
    currency: string;
    priceListId: string;
  };
  availability: Array<{
    start: Date;
    end: Date;
  }>;
  location: {
    base: string;
    region: string;
    country: string;
  };
  images: string[];
  videos: string[];
  equipment: string[];
  cabins: number;
  bathrooms: number;
  length: number;
  year: number;
  description?: string;
  specifications?: object;
}
```

### CharterCompany
```typescript
interface ICharterCompany {
  id: string;
  name: string;
  nameTranslations: object;
}
```

### Category
```typescript
interface ICategory {
  id: string;
  name: string;
  nameTranslations: object;
}
```

## Data Synchronization

The server automatically syncs data from the NauSYS API every 24 hours. The sync process:

1. **Fetches reference data**: Charter companies, yacht categories, models, equipment
2. **Fetches yachts per company**: Iterates through companies to get all yachts
3. **Upserts to MongoDB**: Updates existing records or creates new ones
4. **Maps IDs to names**: Converts reference IDs to readable names for display

### Manual Sync
You can trigger a manual sync using:
```bash
npm run sync
```

### Sync Status
- ✅ **Yachts**: Successfully synced (98 yachts)
- ✅ **Companies**: Successfully synced
- ✅ **Categories**: Successfully synced
- ✅ **Models**: Successfully synced
- ✅ **Equipment**: Successfully synced
- ⚠️ **Bases/Regions/Countries**: Skipped (endpoints not available)
- ⚠️ **Occupancy/Availability**: Skipped (endpoints return 404)

## Project Structure

```
server/
├── src/
│   ├── models/          # MongoDB schemas
│   │   ├── Yacht.ts
│   │   ├── CharterCompany.ts
│   │   ├── Category.ts
│   │   ├── Base.ts
│   │   ├── Region.ts
│   │   ├── Country.ts
│   │   └── Equipment.ts
│   ├── sync/            # Data synchronization
│   │   └── syncService.ts
│   ├── server.ts        # Express server
│   └── index.ts         # MongoDB connection
├── dist/                # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### TypeScript Compilation
The project uses TypeScript with ES modules. To compile:
```bash
npm run build
```

This generates JavaScript files in the `dist/` directory.

### Adding New Endpoints
1. Add the endpoint in `src/server.ts`
2. Update the README with endpoint documentation
3. Test with appropriate query parameters

### Modifying Data Models
1. Update the schema in `src/models/`
2. Update the sync service to handle new fields
3. Update API endpoints if needed
4. Rebuild with `npm run build`

## Troubleshooting

### Authentication Errors
If you get `AUTHENTICATION_ERROR` (error code 100), check your NauSYS API credentials in the `.env` file.

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the `MONGO_URI` in your `.env` file
- Verify network connectivity if using MongoDB Atlas

### Port Already in Use
If you get `EADDRINUSE: address already in use :::3000`:
```bash
# Kill existing Node.js processes
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
```

### TypeScript Compilation Issues
- Ensure all dependencies are installed: `npm install`
- Check `tsconfig.json` configuration
- Use `npm run build` to compile TypeScript

### API Endpoint Issues
- The `/bases`, `/regions`, `/countries` endpoints return 404 (not implemented in NauSYS API)
- The `/occupancy/{yachtId}` endpoint returns 404 (not available in current API access)

## Current Status

✅ **Fully Functional**
- TypeScript compilation working
- MongoDB connection established
- Data sync completed (98 yachts)
- All API endpoints operational
- Server running on port 3000

## License

ISC 
